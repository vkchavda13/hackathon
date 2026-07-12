'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton, useTheme, useMediaQuery, Button } from '@mui/material';
import { Shield, Menu as MenuIcon } from 'lucide-react';
import { navGroups } from '@/constants/navigation';
import React, { useState, useEffect } from 'react';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  drawerWidth: number;
}

export default function Sidebar({ mobileOpen, onMobileClose, drawerWidth }: SidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeRole, setActiveRole] = useState<'admin' | 'manager' | 'head' | 'employee' | 'auditor'>('admin');

  useEffect(() => {
    const saved = localStorage.getItem('user-role') as any;
    if (saved) setActiveRole(saved);

    const handleRoleChange = () => {
      const current = localStorage.getItem('user-role') as any;
      if (current) setActiveRole(current);
    };

    window.addEventListener('user-role-changed', handleRoleChange);
    return () => window.removeEventListener('user-role-changed', handleRoleChange);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && (href !== '/' || pathname === '/');
  };

  // Filter navigation groups based on active role
  const filteredNavGroups = navGroups.map((group) => {
    const allowedItems = group.items.filter((item) => {
      if (activeRole === 'admin') {
        return true;
      } else if (activeRole === 'manager') {
        return !item.href.startsWith('/organization') && !item.href.startsWith('/settings');
      } else if (activeRole === 'head') {
        return (
          item.href === '/' ||
          item.href.startsWith('/assets') && !item.href.startsWith('/assets/register') ||
          item.href.startsWith('/booking') ||
          item.href.startsWith('/allocation')
        );
      } else if (activeRole === 'auditor') {
        return (
          item.href === '/' ||
          item.href.startsWith('/assets') && !item.href.startsWith('/assets/register') ||
          item.href.startsWith('/audit') ||
          item.href.startsWith('/reports')
        );
      } else if (activeRole === 'employee') {
        return (
          item.href === '/' ||
          item.href.startsWith('/assets') && !item.href.startsWith('/assets/register') ||
          item.href.startsWith('/booking') ||
          item.href.startsWith('/maintenance')
        );
      }
      return true;
    });

    return { ...group, items: allowedItems };
  }).filter((group) => group.items.length > 0);

  const getRoleLabel = () => {
    switch (activeRole) {
      case 'admin':
        return 'System Admin';
      case 'manager':
        return 'Asset Manager';
      case 'head':
        return 'Dept Head';
      case 'auditor':
        return 'Auditor';
      case 'employee':
        return 'Staff Member';
      default:
        return 'Employee';
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bg: '#0B1120', backgroundColor: '#0B1120', color: '#94a3b8' }}>
      {/* Logo Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, height: 56, borderBottom: '1px solid rgba(250, 250, 248, 0.1)', shrink: 0 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: 1.5, background: 'linear-gradient(135deg, #714B67 0%, #54384d 100%)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(113, 75, 103, 0.2)' }}>
          <Shield size={16} color="#ffffff" strokeWidth={2.2} />
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc', lineHeight: 1.2, fontSize: '0.75rem', letterSpacing: '-0.01em' }}>
            AssetFlow
          </Typography>
          <Typography variant="caption" sx={{ color: '#00A09D', fontSize: '0.625rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>
            {getRoleLabel()}
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onMobileClose} sx={{ color: '#64748b' }}>
            <MenuIcon size={18} />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          py: 2,
          px: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {filteredNavGroups.map((group) => (
          <Box key={group.label}>
            <Typography sx={{ px: 1.25, mb: 1, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569' }}>
              {group.label}
            </Typography>
            <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <ListItem key={item.href} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      onClick={isMobile ? onMobileClose : undefined}
                      sx={{
                        borderRadius: 0,
                        py: 0.75,
                        px: 1.25,
                        minHeight: 34,
                        color: active ? '#ffffff' : '#94a3b8',
                        backgroundColor: active ? 'rgba(113, 75, 103, 0.25)' : 'transparent',
                        borderLeft: active ? '3px solid #00A09D' : '3px solid transparent',
                        pl: active ? '9px' : '12px',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          color: '#ffffff',
                          backgroundColor: active ? 'rgba(113, 75, 103, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                        <item.icon size={16} strokeWidth={2.2} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: active ? 600 : 500, color: 'inherit' }}>
                            {item.label}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Branding Footer */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(250, 250, 248, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, shrink: 0 }}>
        <Button
          onClick={() => {
            localStorage.removeItem('user-token');
            localStorage.removeItem('user-role');
            localStorage.removeItem('user-info');
            localStorage.removeItem('user-token-expiry');
            window.location.href = '/login';
          }}
          variant="outlined"
          color="error"
          fullWidth
          size="small"
          sx={{
            py: 0.5,
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            '&:hover': {
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
            }
          }}
        >
          Sign Out
        </Button>
        <Typography variant="caption" sx={{ fontSize: '0.55rem', color: '#64748b', display: 'block', mt: 0.5 }}>
          AssetFlow v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', borderRadius: 0 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(250, 250, 248, 0.1)', borderRadius: 0 },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}


