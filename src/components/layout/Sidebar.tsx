'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Shield, Menu, LogOut, ExternalLink } from 'lucide-react';
import { navGroups } from '@/constants/navigation';
import React from 'react';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  drawerWidth: number;
}

export default function Sidebar({ mobileOpen, onMobileClose, drawerWidth }: SidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && (href !== '/' || pathname === '/');
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
            AssetFlow Admin
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>
            ERP Portal
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onMobileClose} sx={{ color: '#64748b' }}>
            <Menu size={18} />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2, px: 1.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {navGroups.map((group) => (
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
                        borderRadius: 1,
                        py: 0.75,
                        px: 1.25,
                        minHeight: 34,
                        color: active ? '#714B67' : '#94a3b8',
                        backgroundColor: active ? 'rgba(113, 75, 103, 0.1)' : 'transparent',
                        '&:hover': {
                          color: '#f1f5f9',
                          backgroundColor: active ? 'rgba(113, 75, 103, 0.15)' : 'rgba(255, 255, 255, 0.05)',
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

      {/* Footer Utility Actions */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(250, 250, 248, 0.1)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <ListItemButton
          href="/"
          target="_blank"
          sx={{
            borderRadius: 1,
            py: 0.75,
            px: 1.25,
            minHeight: 34,
            color: '#94a3b8',
            '&:hover': {
              color: '#f1f5f9',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
            <ExternalLink size={16} strokeWidth={2.2} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'inherit' }}>
                Live Portal
              </Typography>
            }
          />
        </ListItemButton>
        <ListItemButton
          component={Link}
          href="/login"
          sx={{
            borderRadius: 1,
            py: 0.75,
            px: 1.25,
            minHeight: 34,
            color: '#94a3b8',
            '&:hover': {
              color: '#f87171',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
            <LogOut size={16} strokeWidth={2.2} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'inherit' }}>
                Logout
              </Typography>
            }
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(250, 250, 248, 0.1)' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
