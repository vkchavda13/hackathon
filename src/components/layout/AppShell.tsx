'use client';

import { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DRAWER_WIDTH = 220;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    const expiry = localStorage.getItem('user-token-expiry');

    if (!token) {
      router.push('/login');
      return;
    }

    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-info');
      localStorage.removeItem('user-token-expiry');
      toast.error('Session expired. Please sign in again.');
      router.push('/login');
    }
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={handleDrawerClose}
        drawerWidth={DRAWER_WIDTH}
      />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Pass the handleDrawerToggle down as context or prop when mounting layouts */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Typings workarounds for props injection
            return React.cloneElement(child, {
              onMenuToggle: handleDrawerToggle,
            } as any);
          }
          return child;
        })}
      </Box>
    </Box>
  );
}
