'use client';

import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/providers/AuthProvider';
import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        <CircularProgress sx={{ color: '#714B67' }} />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
