'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Grid, Card, CardContent, Typography, Avatar, Tabs, Tab, Button, Divider, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/BadgeOutlined';
import CalendarIcon from '@mui/icons-material/EventOutlined';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import LoadingState from '@/components/common/LoadingState';
import { useEmployee } from '@/hooks/useEmployees';
import { useAssets } from '@/hooks/useAssets';
import { useBookings, useAllocations } from '@/hooks/useModules';
import { formatDate } from '@/utils/format';
import React from 'react';

export default function EmployeeProfilePage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: employee, isLoading: isEmpLoading } = useEmployee(id);
  const { data: assets = [], isLoading: isAssetsLoading } = useAssets();
  const { data: bookings = [], isLoading: isBookingsLoading } = useBookings();
  const { data: allocations = [], isLoading: isAllocLoading } = useAllocations();

  const [tabIndex, setTabIndex] = useState(0);

  if (isEmpLoading || isAssetsLoading || isBookingsLoading || isAllocLoading) {
    return <LoadingState message="Retrieving employee profile database records..." />;
  }

  if (!employee) {
    return (
      <PageContainer>
        <Alert severity="error" sx={{ mt: 2 }}>
          Employee profile not found.
        </Alert>
      </PageContainer>
    );
  }

  // Filter items matching this employee
  const currentAssets = assets.filter((a) => a.assignedToId === employee.id);
  const employeeBookings = bookings.filter((b) => b.requestedById === employee.id);
  const employeeAllocations = allocations.filter((al) => al.employeeId === employee.id);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        onMenuToggle={onMenuToggle}
        breadcrumbs={[
          { label: 'Organization' },
          { label: 'Employees', href: '/organization/employees' },
          { label: employee.firstName },
        ]}
      />
      <PageContainer>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/organization/employees')}
          sx={{ mb: 2, textTransform: 'none', color: '#64748b' }}
        >
          Back to Directory
        </Button>

        <Grid container spacing={3}>
          {/* Left Column: Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: '24px !important', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar
                  src={employee.avatarUrl ?? undefined}
                  sx={{ width: 100, height: 100, mb: 2, fontSize: '2rem', bgcolor: '#714B67' }}
                >
                  {employee.firstName[0]}{employee.lastName[0]}
                </Avatar>

                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '1.25rem' }}>
                  {employee.firstName} {employee.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 2 }}>
                  {employee.designation}
                </Typography>

                <Box sx={{ mb: 3, display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <StatusChip status={employee.status} type="employee" />
                  {(() => {
                    const getRoleBadgeStyle = (role: string) => {
                      switch (role) {
                        case 'admin': return { bg: 'rgba(113, 75, 103, 0.08)', text: '#714B67', border: 'rgba(113, 75, 103, 0.15)', label: 'Admin' };
                        case 'manager': return { bg: 'rgba(0, 160, 157, 0.08)', text: '#00A09D', border: 'rgba(0, 160, 157, 0.15)', label: 'Manager' };
                        case 'head': return { bg: 'rgba(217, 119, 6, 0.08)', text: '#d97706', border: 'rgba(217, 119, 6, 0.15)', label: 'Dept Head' };
                        default: return { bg: 'rgba(71, 85, 105, 0.08)', text: '#475569', border: 'rgba(71, 85, 105, 0.15)', label: 'Employee' };
                      }
                    };
                    const roleStyle = getRoleBadgeStyle(employee.role);
                    return (
                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.25,
                          fontSize: '0.625rem',
                          fontWeight: 650,
                          borderRadius: 1,
                          backgroundColor: roleStyle.bg,
                          color: roleStyle.text,
                          border: `1px solid ${roleStyle.border}`,
                          textTransform: 'uppercase',
                        }}
                      >
                        {roleStyle.label}
                      </Box>
                    );
                  })()}
                </Box>

                <Divider sx={{ width: '100%', mb: 3 }} />

                {/* Profile Meta list */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <BadgeIcon sx={{ color: '#94a3b8' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Employee ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {employee.employeeId}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <BusinessIcon sx={{ color: '#94a3b8' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Department / Role
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {employee.departmentName} ({employee.role.toUpperCase()})
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <EmailIcon sx={{ color: '#94a3b8' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Email Address
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1e293b', wordBreak: 'break-all' }}>
                        {employee.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <PhoneIcon sx={{ color: '#94a3b8' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1e293b' }}>
                        {employee.phone}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <CalendarIcon sx={{ color: '#94a3b8' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Join Date
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1e293b' }}>
                        {formatDate(employee.joinDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Tabbed Histories */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ height: '100%', minHeight: 450 }}>
              <CardContent sx={{ p: '0px !important' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                  <Tabs value={tabIndex} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                    <Tab label={`Allocated Assets (${currentAssets.length})`} sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'none' }} />
                    <Tab label={`Bookings (${employeeBookings.length})`} sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'none' }} />
                    <Tab label={`Transfer Logs (${employeeAllocations.length})`} sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'none' }} />
                  </Tabs>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Tab 0: Allocated Assets */}
                  {tabIndex === 0 && (
                    <Box>
                      {currentAssets.length > 0 ? (
                        <Grid container spacing={2}>
                          {currentAssets.map((asset) => (
                            <Grid key={asset.id} size={{ xs: 12, sm: 6 }}>
                              <Card
                                sx={{
                                  border: '1px solid #e2e8f0',
                                  cursor: 'pointer',
                                  boxShadow: 'none',
                                  transition: 'all 0.15s ease',
                                  '&:hover': {
                                    borderColor: '#714B67',
                                    backgroundColor: 'rgba(113, 75, 103, 0.01)',
                                    transform: 'translateY(-2px)',
                                  },
                                }}
                                onClick={() => router.push(`/assets/${asset.id}`)}
                              >
                                <CardContent sx={{ p: '16px !important' }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography variant="caption" sx={{ px: 1, py: 0.25, bgcolor: '#f1f5f9', borderRadius: 0.5, fontWeight: 700, color: '#475569' }}>
                                      {asset.assetTag}
                                    </Typography>
                                    <StatusChip status={asset.status} type="asset" />
                                  </Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '0.875rem' }}>
                                    {asset.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mb: 1 }}>
                                    Serial: {asset.serialNumber}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                    Location: {asset.location}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8', py: 6, textAlign: 'center' }}>
                          No assets currently allocated to this employee.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Tab 1: Bookings */}
                  {tabIndex === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {employeeBookings.length > 0 ? (
                        employeeBookings.map((b, idx) => (
                          <Box key={b.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                  {b.assetName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                                  Purpose: {b.purpose}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.25 }}>
                                  Dates: {formatDate(b.startDate)} to {formatDate(b.endDate)}
                                </Typography>
                              </Box>
                              <StatusChip status={b.status} type="booking" />
                            </Box>
                            {idx < employeeBookings.length - 1 && <Divider sx={{ mt: 2 }} />}
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8', py: 6, textAlign: 'center' }}>
                          No requested bookings made by this employee.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Tab 2: Transfer Logs */}
                  {tabIndex === 2 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {employeeAllocations.length > 0 ? (
                        employeeAllocations.map((al, idx) => (
                          <Box key={al.id}>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#714B67' }}>
                                  {al.assetName} ({al.assetTag})
                                </Typography>
                                <Typography variant="caption" sx={{ px: 1, py: 0.25, bgcolor: '#f0fdf4', color: '#166534', borderRadius: 0.5, fontWeight: 600 }}>
                                  {al.status.toUpperCase()}
                                </Typography>
                              </Box>
                              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                Allocated on: {formatDate(al.createdAt)}
                              </Typography>
                              {al.returnDate && (
                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.25 }}>
                                  Returned on: {formatDate(al.returnDate)}
                                </Typography>
                              )}
                            </Box>
                            {idx < employeeAllocations.length - 1 && <Divider sx={{ mt: 2 }} />}
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8', py: 6, textAlign: 'center' }}>
                          No historical allocation transfers recorded.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
