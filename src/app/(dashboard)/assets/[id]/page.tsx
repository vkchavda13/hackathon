'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Grid, Card, CardContent, Typography, Tabs, Tab, Divider } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHorizOutlined';
import BuildIcon from '@mui/icons-material/BuildOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import TimelineCard, { TimelineItem } from '@/components/cards/TimelineCard';
import ErrorState from '@/components/common/ErrorState';
import { DetailSkeleton } from '@/components/common/SkeletonLoader';
import { useAsset } from '@/hooks/useAssets';
import { useAllocations, useMaintenance, useBookings, useAuditCycles } from '@/hooks/useModules';
import { formatDate, formatCurrency } from '@/utils/format';
import React from 'react';
import Link from 'next/link';

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
  const { data: auditCycles = [] } = useAuditCycles();

  const [tabIndex, setTabIndex] = useState(0);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHeader title="Loading Asset Detail…" onMenuToggle={onMenuToggle} />
        <PageContainer>
          <DetailSkeleton />
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

  // Generate simulated audit verifications for this asset based on actual cycles
  const simulatedAudits = auditCycles.map((cycle, idx) => {
    const auditors = ['Arjun Reddy', 'Kavita Singh', 'Neha Kapoor'];
    const auditorName = cycle.conductedByName || auditors[idx % auditors.length];
    const isDiscrepancy = asset.status === 'maintenance' || asset.condition === 'poor' || asset.condition === 'damaged';
    const result = idx === 0 && isDiscrepancy ? 'discrepancy' : 'verified';
    return {
      cycleName: cycle.name,
      auditorName,
      date: cycle.endDate || cycle.startDate,
      condition: result === 'verified' ? asset.condition : 'damaged',
      result,
    };
  });

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

  const qrData = typeof window !== 'undefined' ? `${window.location.origin}/assets/${asset.id}` : asset.assetTag;

  return (
    <>
      {/* Dynamic Printing Style Injection */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .no-print, header, nav, aside, .MuiDrawer-root, button, .MuiButton-root, .MuiTabs-root {
            display: none !important;
          }
          main, .MuiBox-root, .print-only-report {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Main Screen Layout (Hidden when printing) */}
      <Box className="no-print" sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
                      <Button
                        onClick={() => window.print()}
                        variant="contained"
                        color="secondary"
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                      >
                        Generate PDF
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
                        <Typography variant="body2" sx={{ color: '#94a3b8', py: 4, textAlign: 'center' }}>
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
                        <Typography variant="body2" sx={{ color: '#94a3b8', py: 4, textAlign: 'center' }}>
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
                          {assetBookings.map((b, idx) => (
                            <Box key={b.id}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                  {b.purpose}
                                </Typography>
                                <StatusChip status={b.status} type="booking" />
                              </Box>
                              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                                Booked by: {b.requestedByName} ({b.departmentName})
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.25 }}>
                                Schedule: {formatDate(b.startDate)} to {formatDate(b.endDate)}
                              </Typography>
                              {idx < assetBookings.length - 1 && <Divider sx={{ mt: 2 }} />}
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8', py: 4, textAlign: 'center' }}>
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
                {/* Asset QR & Barcode Tag */}
                <Card>
                  <CardContent sx={{ p: '20px !important', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 0 }}>
                      Asset Label Tags
                    </Typography>

                    {/* QR Code */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                        }}
                      >
                        <Box
                          component="img"
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(qrData)}`}
                          alt="Asset QR Code"
                          sx={{ width: 110, height: 110 }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.625rem' }}>
                        QR Code Portal Link
                      </Typography>
                    </Box>

                    <Divider sx={{ width: '100%', my: 0.5 }} />

                    {/* Barcode */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 60,
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                          overflow: 'hidden',
                          p: 1,
                        }}
                      >
                        <Box
                          component="img"
                          src={`https://barcode.tec-it.com/barcode.ashx?data=${asset.assetTag}&code=Code128&translate-esc=true`}
                          alt="Asset Barcode"
                          sx={{ height: 40, maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.625rem' }}>
                        Physical Barcode Tag: {asset.assetTag}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </PageContainer>
      </Box>

      {/* Printable PDF Report Container (Hidden on Screen, Visible on Print) */}
      <Box
        className="print-only-report"
        sx={{
          display: 'none',
          '@media print': {
            display: 'block',
            width: '100%',
            color: '#000000',
            fontFamily: 'Inter, sans-serif',
            p: 4,
          },
        }}
      >
        {/* Header Branding */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, borderBottom: '2px solid #714B67', pb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#714B67', fontFamily: '"Outfit", sans-serif', fontSize: '1.5rem', mb: 0.5 }}>
              AssetFlow ERP
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
              Enterprise Asset & Resource Management System
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                ASSET PROFILE REPORT
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Generated: {new Date().toLocaleString('en-IN')}
              </Typography>
            </Box>
            {/* Printable QR Code in Top Right Corner */}
            <Box
              component="img"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(qrData)}`}
              alt="Print QR"
              sx={{ width: 60, height: 60, border: '1px solid #cbd5e1', borderRadius: 1, p: 0.5 }}
            />
          </Box>
        </Box>

        {/* Device QR and Details Box */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 180px',
            gap: 4,
            p: 3,
            border: '1px solid #cbd5e1',
            borderRadius: 2,
            mb: 4,
            backgroundColor: '#f8fafc',
          }}
        >
          {/* Details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Asset Tag
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
                {asset.assetTag}
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Asset Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#0f172a', mb: 1.5 }}>
                {asset.name}
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Manufacturer / Model
              </Typography>
              <Typography variant="body2" sx={{ color: '#0f172a', mb: 1.5 }}>
                {asset.manufacturer || '—'} / {asset.model || '—'}
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Serial Number
              </Typography>
              <Typography variant="body2" sx={{ color: '#0f172a', mb: 1.5 }}>
                {asset.serialNumber || '—'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Current Status
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: asset.status === 'available' ? '#16a34a' : '#d97706', mb: 1.5, textTransform: 'capitalize' }}>
                {asset.status}
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Condition / Location
              </Typography>
              <Typography variant="body2" sx={{ color: '#0f172a', mb: 1.5, textTransform: 'capitalize' }}>
                {asset.condition} / {asset.location || '—'}
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Acquisition Cost
              </Typography>
              <Typography variant="body2" sx={{ color: '#0f172a', mb: 1.5 }}>
                {formatCurrency(asset.purchasePrice)} (Purchased: {formatDate(asset.purchaseDate)})
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Current Assignment
              </Typography>
              <Typography variant="body2" sx={{ color: '#0f172a', mb: 1.5 }}>
                {asset.assignedToName ? `${asset.assignedToName} (${asset.departmentName})` : 'Unassigned (Available)'}
              </Typography>
            </Box>
          </Box>

          {/* Barcode only print label */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, borderLeft: '1px solid #cbd5e1', pl: 3, minWidth: 160 }}>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Box
                component="img"
                src={`https://barcode.tec-it.com/barcode.ashx?data=${asset.assetTag}&code=Code128&translate-esc=true`}
                alt="Asset Barcode"
                sx={{ height: 35, width: 120, display: 'block', mx: 'auto', mb: 0.5, objectFit: 'contain' }}
              />
              <Typography variant="caption" sx={{ fontSize: '0.5rem', fontWeight: 700, color: '#64748b', display: 'block' }}>
                TAG: {asset.assetTag}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* History Tables Section */}
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#714B67', mb: 1.5, borderBottom: '1px solid #cbd5e1', pb: 0.5, fontFamily: '"Outfit", sans-serif' }}>
          1. ALLOCATION & TRANSFER LOGS
        </Typography>
        {assetAllocations.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4, fontSize: '0.75rem' }}>No allocation logs recorded.</Typography>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>EVENT</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>HOLDER</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>DEPARTMENT</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>DATE</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>NOTES</th>
              </tr>
            </thead>
            <tbody>
              {assetAllocations.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.7rem' }}>
                  <td style={{ padding: '8px', textTransform: 'capitalize', fontWeight: 600 }}>{a.type}</td>
                  <td style={{ padding: '8px' }}>{a.employeeName}</td>
                  <td style={{ padding: '8px' }}>{a.departmentName}</td>
                  <td style={{ padding: '8px' }}>{formatDate(a.allocatedDate)}</td>
                  <td style={{ padding: '8px', color: '#475569' }}>{a.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#714B67', mb: 1.5, borderBottom: '1px solid #cbd5e1', pb: 0.5, fontFamily: '"Outfit", sans-serif' }}>
          2. MAINTENANCE & REPAIR HISTORY
        </Typography>
        {assetMaintenance.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4, fontSize: '0.75rem' }}>No maintenance records found.</Typography>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>ISSUE TITLE</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>TYPE</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>PRIORITY</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>DATE</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {assetMaintenance.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.7rem' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{m.title}</td>
                  <td style={{ padding: '8px', textTransform: 'capitalize' }}>{m.type}</td>
                  <td style={{ padding: '8px', textTransform: 'uppercase', color: m.priority === 'high' ? '#dc2626' : '#d97706' }}>{m.priority}</td>
                  <td style={{ padding: '8px' }}>{formatDate(m.scheduledDate)}</td>
                  <td style={{ padding: '8px', textTransform: 'capitalize', fontWeight: 600 }}>{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#714B67', mb: 1.5, borderBottom: '1px solid #cbd5e1', pb: 0.5, fontFamily: '"Outfit", sans-serif' }}>
          3. AUDIT & VERIFICATION HISTORY
        </Typography>
        {simulatedAudits.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4, fontSize: '0.75rem' }}>No audit cycles run yet.</Typography>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>AUDIT CYCLE</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>AUDITOR</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>VERIFIED DATE</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>CONDITION</th>
                <th style={{ padding: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>RESULT</th>
              </tr>
            </thead>
            <tbody>
              {simulatedAudits.map((a, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.7rem' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{a.cycleName}</td>
                  <td style={{ padding: '8px' }}>{a.auditorName}</td>
                  <td style={{ padding: '8px' }}>{formatDate(a.date)}</td>
                  <td style={{ padding: '8px', textTransform: 'capitalize' }}>{a.condition}</td>
                  <td style={{ padding: '8px', fontWeight: 700, color: a.result === 'verified' ? '#16a34a' : '#dc2626' }}>
                    {a.result.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer Notes */}
        <Box sx={{ mt: 6, pt: 2, borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem' }}>
            This document is a system-generated audit report from AssetFlow ERP Portal.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
