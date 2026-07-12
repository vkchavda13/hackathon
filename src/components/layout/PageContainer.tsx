'use client';

import { Box, Paper, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function PageContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<'admin' | 'manager' | 'head' | 'employee'>('admin');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('user-role') as any;
    if (saved) setActiveRole(saved);

    const handleRoleChange = () => {
      const current = localStorage.getItem('user-role') as any;
      if (current) setActiveRole(current);
    };

    window.addEventListener('user-role-changed', handleRoleChange);
    return () => window.removeEventListener('user-role-changed', handleRoleChange);
  }, []);

  if (!isMounted) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          px: { xs: 1.5, sm: 2 },
          pt: 1.5,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          minHeight: 0,
        }}
      >
        {children}
      </Box>
    );
  }

  // Determine if path is restricted
  let isRestricted = false;
  let requiredRoles = '';

  if (activeRole === 'manager') {
    if (pathname.startsWith('/organization')) {
      isRestricted = true;
      requiredRoles = 'System Administrator';
    }
  } else if (activeRole === 'head') {
    if (
      pathname.startsWith('/organization') ||
      pathname.startsWith('/assets/register') ||
      pathname.startsWith('/maintenance') ||
      pathname.startsWith('/audit') ||
      pathname.startsWith('/settings')
    ) {
      isRestricted = true;
      requiredRoles = 'System Administrator or Asset Manager';
    }
  } else if (activeRole === 'employee') {
    if (
      pathname.startsWith('/organization') ||
      pathname.startsWith('/assets/register') ||
      pathname.startsWith('/allocation') ||
      pathname.startsWith('/audit') ||
      pathname.startsWith('/reports') ||
      pathname.startsWith('/settings')
    ) {
      isRestricted = true;
      requiredRoles = 'System Administrator, Asset Manager or Department Head';
    }
  }

  if (isRestricted) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          px: { xs: 1.5, sm: 2 },
          pt: 8,
          pb: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            maxWidth: 420,
            p: 4,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.04)',
            border: '1px solid #f1f5f9',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              backgroundColor: 'rgba(217, 119, 6, 0.08)',
              color: '#d97706',
              display: 'flex',
            }}
          >
            <ShieldAlert size={36} />
          </Box>
          <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#0f172a' }}>
            Access Restricted
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.5 }}>
            This screen is restricted to authorized roles. To access this section, please switch your role to <strong>{requiredRoles}</strong> using the selector at the bottom of the sidebar.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        px: { xs: 1.5, sm: 2 },
        pt: 1.5,
        pb: 3,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        minHeight: 0, // Flex child scroll bugfix
        animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {children}
    </Box>
  );
}
