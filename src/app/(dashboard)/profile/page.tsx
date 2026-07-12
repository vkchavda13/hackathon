'use client';

import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Avatar, Divider, Button, Alert } from '@mui/material';
import { User, Mail, Phone, Briefcase, Calendar, Shield, Award, CheckCircle, Package } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { formatDate, getInitials } from '@/utils/format';
import Link from 'next/link';
import React from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem('user-info');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  if (!user) {
    return (
      <PageContainer>
        <Alert severity="error">Unable to load employee profile context. Please sign in again.</Alert>
      </PageContainer>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <PageHeader title="My Employee Profile" />
      <PageContainer>
        <Grid container spacing={3}>
          {/* Left card: User summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <CardContent sx={{ p: '32px !important', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    fontSize: '2rem',
                    fontWeight: 700,
                    backgroundColor: '#714B67',
                    boxShadow: '0 4px 10px rgba(113, 75, 103, 0.15)',
                    mb: 2,
                  }}
                >
                  {getInitials(fullName)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {fullName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mt: 0.5 }}>
                  {user.designation}
                </Typography>

                <Box sx={{ mt: 2, px: 2, py: 0.5, borderRadius: 1.5, backgroundColor: 'rgba(0, 160, 157, 0.08)', border: '1px solid rgba(0, 160, 157, 0.15)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#00A09D', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                    {user.role}
                  </Typography>
                </Box>

                <Divider sx={{ width: '100%', my: 3 }} />

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 750, color: '#714B67' }}>
                      {user.allocatedAssets || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                      Assets Held
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 750, color: '#00A09D' }}>
                      Active
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                      Account Status
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right card: Detail attributes */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
              <CardContent sx={{ p: '32px !important' }}>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 3.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <User size={18} color="#714B67" />
                  Personal Information
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      FIRST NAME
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 550, color: '#1e293b' }}>
                      {user.firstName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      LAST NAME
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 550, color: '#1e293b' }}>
                      {user.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      EMAIL ADDRESS
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Mail size={14} color="#64748b" />
                      <Typography variant="body2" sx={{ fontWeight: 550, color: '#1e293b' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      PHONE NUMBER
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone size={14} color="#64748b" />
                      <Typography variant="body2" sx={{ fontWeight: 550, color: '#1e293b' }}>
                        {user.phone || '—'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3.5 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 3.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Briefcase size={18} color="#714B67" />
                  Organization & Employment Registry
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      EMPLOYEE ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {user.employeeId}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      DEPARTMENT
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 550, color: '#1e293b' }}>
                      {user.departmentName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      DESIGNATION
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 550, color: '#1e293b' }}>
                      {user.designation}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      JOIN DATE
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar size={14} color="#64748b" />
                      <Typography variant="body2" sx={{ fontWeight: 550, color: '#1e293b' }}>
                        {formatDate(user.joinDate)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    component={Link}
                    href="/assets"
                    variant="outlined"
                    color="primary"
                    startIcon={<Package size={15} />}
                    sx={{ height: 36 }}
                  >
                    View My Asset Inventory
                  </Button>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
