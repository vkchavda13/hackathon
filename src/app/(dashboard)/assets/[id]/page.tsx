'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Grid, Card, CardContent, Typography, Tabs, Tab, Divider, Alert, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwapHorizIcon from '@mui/icons-material/SwapHorizOutlined';
import BuildIcon from '@mui/icons-material/BuildOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import TimelineCard, { TimelineItem } from '@/components/cards/TimelineCard';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import InfoCard from '@/components/common/StatCard'; // We can reuse card content simply
import { useAsset, useUpdateAsset } from '@/hooks/useAssets';
import { useAllocations, useMaintenance, useBookings } from '@/hooks/useModules';
import { formatDate, formatCurrency } from '@/utils/format';
import React from 'react';

export default function AssetDetailPage({
  params: paramsPromise,
  onMenuToggle,
}: {
  params: Promise<{ id: string }>;
  onMenuToggle?: () => void;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { id } = params;

  const { data: asset, isLoading, error } = useAsset(id);
  const { data: allocations = [] } = useAllocations();
  const { data: maintenanceRecords = [] } = useMaintenance();
  const { data: bookings = [] } = useBookings();
  const updateMutation = useUpdateAsset();

  const [tabIndex, setTabIndex] = useState(0);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHeader title="Loading Asset Detail…" onMenuToggle={onMenuToggle} />
        <PageContainer>
          <LoadingState message="Fetching asset data files…" />
        </PageContainer>
      </Box>
    );
  }

  if (error || !asset) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHeader title="Asset Not Found" onMenuToggle={onMenuToggle} />
        <PageContainer>
          <ErrorState message="The asset ID requested does not exist or has been archived." onRetry={() => router.push('/assets')} />
        </PageContainer>
      </Box>
    );
  }

  // Filter histories mapping to this specific asset
  const assetAllocations = allocations.filter((a) => a.assetId === asset.id);
  const assetMaintenance = maintenanceRecords.filter((m) => m.assetId === asset.id);
  const assetBookings = bookings.filter((b) => b.assetId === asset.id);

  // Parse timelines
  const timelineItems: TimelineItem[] = assetAllocations.map((a) => ({
    id: a.id,
    title: a.type === 'assignment' ? 'Asset Allocated' : a.type === 'transfer' ? 'Asset Transferred' : 'Asset Returned',
    subtitle: `Employee: ${a.employeeName} (${a.departmentName})`,
    description: a.notes,
    timestamp: formatDate(a.allocatedDate),
    icon: <SwapHorizIcon sx={{ fontSize: 14 }} />,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
  }));

  const mntTimelineItems: TimelineItem[] = assetMaintenance.map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: `${m.type.toUpperCase()} — Priority: ${m.priority.toUpperCase()}`,
    description: m.description,
    timestamp: formatDate(m.scheduledDate),
    icon: <BuildIcon sx={{ fontSize: 14 }} />,
    iconBg: '#fef3c7',
    iconColor: '#b45309',
  }));

  const handleStatusChange = (newStatus: any) => {
    updateMutation.mutate({ id: asset.id, data: { status: newStatus } });
  };

  return (
    <>
      <PageHeader
        title={`${asset.assetTag} — ${asset.name}`}
        onMenuToggle={onMenuToggle}
        breadcrumbs={[{ label: 'Assets', href: '/assets' }, { label: asset.assetTag }]}
      />
      <PageContainer>
        {/* Detail grids */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent sx={{ p: '24px !important' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <StatusChip status={asset.status} type="asset" />
                    <StatusChip status={asset.condition} type="condition" />
                  </Box>

                  {/* Actions buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {asset.status !== 'allocated' && (
                      <Button
                        component={Link}
                        href="/allocation"
                        variant="outlined"
                        size="small"
                        startIcon={<SwapHorizIcon />}
                      >
                        Allocate
                      </Button>
                    )}
                    <Button
                      component={Link}
                      href="/maintenance"
                      variant="outlined"
                      size="small"
                      startIcon={<BuildIcon />}
                    >
                      Schedule Service
                    </Button>
                  </Box>
                </Box>

                {/* Tabs selection */}
                <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 3 }}>
                  <Tab label="Asset Profile" />
                  <Tab label={`Allocations (${assetAllocations.length})`} />
                  <Tab label={`Maintenance (${assetMaintenance.length})`} />
                  <Tab label={`Bookings (${assetBookings.length})`} />
                </Tabs>

                {/* Tab content 1: Profile specs */}
                {tabIndex === 0 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                        Manufacturer / Brand
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', mb: 2 }}>
                        {asset.manufacturer || '—'}
                      </Typography>

                      <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                        Model
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', mb: 2 }}>
                        {asset.model || '—'}
                      </Typography>

                      <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                        Serial Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', mb: 2 }}>
                        {asset.serialNumber || '—'}
                      </Typography>

                      <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                        Description
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                        {asset.description || '—'}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                        Purchase Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', mb: 2 }}>
                        {formatDate(asset.purchaseDate)}
                      </Typography>

                      <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                        Original Cost
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', mb: 2 }}>
                        {formatCurrency(asset.purchasePrice)}
                      </Typography>

                      <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                        Current Value
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', mb: 2 }}>
                        {formatCurrency(asset.currentValue)}
                      </Typography>

                      <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                        Current Assignment
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', mb: 2 }}>
                        {asset.assignedToName ? `${asset.assignedToName} (${asset.departmentName})` : 'Unassigned (Available)'}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {/* Tab content 2: Allocations */}
                {tabIndex === 1 && (
                  <Box>
                    {timelineItems.length > 0 ? (
                      <TimelineCard items={timelineItems} />
                    ) : (
                      <Typography variant="body2" sx={{ color: '#94a3b8', py: 4, textItems: 'center', textAlign: 'center' }}>
                        No allocation logs found for this asset.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Tab content 3: Maintenance */}
                {tabIndex === 2 && (
                  <Box>
                    {mntTimelineItems.length > 0 ? (
                      <TimelineCard items={mntTimelineItems} />
                    ) : (
                      <Typography variant="body2" sx={{ color: '#94a3b8', py: 4, textItems: 'center', textAlign: 'center' }}>
                        No maintenance operations recorded yet.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Tab content 4: Bookings */}
                {tabIndex === 3 && (
                  <Box>
                    {assetBookings.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {assetBookings.map((b) => (
                          <Card key={b.id}>
                            <CardContent sx={{ p: '12px !important' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {b.purpose}
                                </Typography>
                                <StatusChip status={b.status} type="booking" />
                              </Box>
                              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                                Booked by: {b.requestedByName} ({b.departmentName})
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                Schedule: {formatDate(b.startDate)} to {formatDate(b.endDate)}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#94a3b8', py: 4, textItems: 'center', textAlign: 'center' }}>
                        No calendar bookings made for this asset.
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right column: meta attributes */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Asset QR Placeholder */}
              <Card>
                <CardContent sx={{ p: '20px !important', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 2 }}>
                    Asset Tag Barcode
                  </Typography>
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {/* Simulated barcode */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 100, height: 40, borderLeft: '2px solid black', borderRight: '4px solid black', background: 'repeating-linear-gradient(90deg, black, black 2px, white 2px, white 6px)' }} />
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                        {asset.assetTag}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Scan QR / Barcode tag during audits to verify locations.
                  </Typography>
                </CardContent>
              </Card>

              {/* Maintenance checklist warnings */}
              {asset.status === 'maintenance' && (
                <Alert severity="warning">
                  <AlertTitle sx={{ fontWeight: 600 }}>Asset in Service</AlertTitle>
                  This asset is currently marked in maintenance. Bookings and allocations are suspended until resolved.
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
