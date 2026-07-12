'use client';

import { Box, Typography, Button, Breadcrumbs, Link as MuiLink, IconButton, Badge, Menu, MenuItem, Tooltip, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Bell, Info, Calendar, Wrench, RefreshCw, Circle, CheckCheck } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useModules';
import { formatRelativeTime } from '@/utils/format';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
  onMenuToggle?: () => void;
  actionButtons?: React.ReactNode;
}

function NotificationMenu() {
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };
  
  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };
  
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'allocation':
        return <RefreshCw size={14} color="#2563eb" />;
      case 'maintenance':
        return <Wrench size={14} color="#d97706" />;
      case 'booking':
        return <Calendar size={14} color="#16a34a" />;
      default:
        return <Info size={14} color="#64748b" />;
    }
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ color: '#64748b', p: 1 }}>
        <Badge badgeContent={unreadCount} color="error" slotProps={{ badge: { sx: { fontSize: '0.625rem', height: 16, minWidth: 16 } } }}>
          <Bell size={18} />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxHeight: 450,
              borderRadius: 3,
              mt: 1.5,
              border: '1px solid #f1f5f9',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
              overflow: 'hidden',
              p: 0,
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="subtitle1" sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              startIcon={<CheckCheck size={12} />}
              sx={{ fontSize: '0.65rem', py: 0.25, px: 1, minHeight: 0, color: '#714B67', textTransform: 'none' }}
            >
              Mark all read
            </Button>
          )}
        </Box>

        {/* List */}
        <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            notifications.slice(0, 5).map((n) => {
              const getNotificationUrl = (type: string) => {
                if (type.startsWith('booking')) return '/booking';
                if (type.startsWith('maintenance')) return '/maintenance';
                if (type.startsWith('allocation') || type.startsWith('asset')) return '/assets';
                return '/notifications';
              };
              return (
                <MenuItem
                  key={n.id}
                  component={Link}
                  href={getNotificationUrl(n.type)}
                  onClick={() => {
                    handleMarkRead(n.id);
                    handleClose();
                  }}
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    whiteSpace: 'normal',
                    backgroundColor: n.isRead ? 'transparent' : 'rgba(113, 75, 103, 0.02)',
                    borderBottom: '1px solid #f8fafc',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                <Box sx={{ mt: 0.25, display: 'flex', flexShrink: 0 }}>{getIcon(n.type)}</Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: n.isRead ? 500 : 700, fontSize: '0.75rem', color: '#0f172a', lineHeight: 1.3 }}>
                    {n.title}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontSize: '0.6875rem', mt: 0.25, lineHeight: 1.3 }}>
                    {n.message}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontSize: '0.625rem', mt: 0.5 }}>
                    {formatRelativeTime(n.createdAt)}
                  </Typography>
                </Box>
                {!n.isRead && (
                  <Box sx={{ mt: 0.75, display: 'flex', flexShrink: 0 }}>
                    <Circle size={6} fill="#714B67" color="#714B67" />
                  </Box>
                )}
              </MenuItem>
            );
          })
          )}
        </Box>

        <Divider sx={{ my: 0 }} />

        {/* Footer */}
        <Box sx={{ p: 1, textAlign: 'center', backgroundColor: '#f8fafc' }}>
          <Button
            component={Link}
            href="/notifications"
            onClick={handleClose}
            fullWidth
            size="small"
            sx={{ fontSize: '0.7rem', color: '#714B67', textTransform: 'none' }}
          >
            View all activity
          </Button>
        </Box>
      </Menu>
    </>
  );
}

function RoleSwitcherMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRole, setActiveRole] = useState<'admin' | 'manager' | 'head' | 'employee'>('admin');
  const open = Boolean(anchorEl);

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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectRole = (role: 'admin' | 'manager' | 'head' | 'employee') => {
    localStorage.setItem('user-role', role);
    setActiveRole(role);
    window.dispatchEvent(new Event('user-role-changed'));
    handleClose();
  };

  const getRoleBadgeColor = () => {
    switch (activeRole) {
      case 'admin': return { bg: 'rgba(113, 75, 103, 0.08)', text: '#714B67', border: 'rgba(113, 75, 103, 0.15)' };
      case 'manager': return { bg: 'rgba(0, 160, 157, 0.08)', text: '#00A09D', border: 'rgba(0, 160, 157, 0.15)' };
      case 'head': return { bg: 'rgba(217, 119, 6, 0.08)', text: '#d97706', border: 'rgba(217, 119, 6, 0.15)' };
      case 'employee': return { bg: 'rgba(71, 85, 105, 0.08)', text: '#475569', border: 'rgba(71, 85, 105, 0.15)' };
    }
  };

  const colors = getRoleBadgeColor();

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        size="small"
        sx={{
          py: 0.5,
          px: 1.25,
          minHeight: 28,
          fontSize: '0.6875rem',
          backgroundColor: colors.bg,
          color: colors.text,
          borderColor: colors.border,
          borderRadius: 1.5,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          '&:hover': {
            backgroundColor: colors.bg,
            borderColor: colors.text,
          }
        }}
      >
        Role: {activeRole}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              width: 200,
              borderRadius: 2,
              mt: 1,
              border: '1px solid #f1f5f9',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            }
          }
        }}
      >
        <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
          Switch Simulated Role
        </Typography>
        <MenuItem onClick={() => handleSelectRole('admin')} selected={activeRole === 'admin'} sx={{ fontSize: '0.75rem', py: 0.75, fontWeight: activeRole === 'admin' ? 600 : 500 }}>
          System Administrator
        </MenuItem>
        <MenuItem onClick={() => handleSelectRole('manager')} selected={activeRole === 'manager'} sx={{ fontSize: '0.75rem', py: 0.75, fontWeight: activeRole === 'manager' ? 600 : 500 }}>
          Asset Manager
        </MenuItem>
        <MenuItem onClick={() => handleSelectRole('head')} selected={activeRole === 'head'} sx={{ fontSize: '0.75rem', py: 0.75, fontWeight: activeRole === 'head' ? 600 : 500 }}>
          Department Head
        </MenuItem>
        <MenuItem onClick={() => handleSelectRole('employee')} selected={activeRole === 'employee'} sx={{ fontSize: '0.75rem', py: 0.75, fontWeight: activeRole === 'employee' ? 600 : 500 }}>
          Staff Member
        </MenuItem>
      </Menu>
    </>
  );
}

export default function PageHeader({
  title,
  icon,
  breadcrumbs = [],
  actionLabel,
  actionHref,
  onActionClick,
  actionIcon,
  onMenuToggle,
  actionButtons,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        px: { xs: 1.5, sm: 2 },
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* Left section: breadcrumbs, title, icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        {onMenuToggle && (
          <IconButton
            onClick={onMenuToggle}
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 0.5, p: 0.5 }}
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs
              separator={<NavigateNextIcon sx={{ fontSize: 10, color: '#cbd5e1' }} />}
              sx={{ mb: 0.25 }}
            >
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography key={index} variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6875rem', fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                ) : (
                  <MuiLink
                    key={index}
                    component={Link}
                    href={item.href || '#'}
                    sx={{
                      color: '#64748b',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': { color: '#714B67' },
                    }}
                  >
                    {item.label}
                  </MuiLink>
                );
              })}
            </Breadcrumbs>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon && <Box sx={{ display: 'flex', color: '#94a3b8' }}>{icon}</Box>}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#0f172a',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right section: Notifications, Role Switcher and CTA action */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {actionButtons}
        <NotificationMenu />

        {actionLabel && (
          actionHref ? (
            <Button
              component={Link}
              href={actionHref}
              variant="contained"
              color="primary"
              startIcon={actionIcon}
              sx={{ height: 32 }}
            >
              {actionLabel}
            </Button>
          ) : (
            <Button
              onClick={onActionClick}
              variant="contained"
              color="primary"
              startIcon={actionIcon}
              sx={{ height: 32 }}
            >
              {actionLabel}
            </Button>
          )
        )}
      </Box>
    </Box>
  );
}
