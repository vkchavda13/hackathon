'use client';

import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Tabs, Tab, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider } from '@mui/material';
import { Info, RefreshCw, Wrench, Calendar, Circle, CheckCheck } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useModules';
import { formatRelativeTime } from '@/utils/format';
import type { Notification } from '@/types';
import React from 'react';

export default function NotificationsPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [activeTab, setActiveTab] = useState(0);

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  // Filter notifications based on the Screen 10 groups: All, Alerts, Approvals, Bookings
  const filtered = notifications.filter((n) => {
    if (activeTab === 0) return true; // All
    if (activeTab === 1) return n.priority === 'high' || n.type === 'warranty_expiring'; // Alerts
    if (activeTab === 2) return n.type === 'booking_approved' || n.type === 'asset_allocated' || n.type === 'asset_transferred'; // Approvals
    if (activeTab === 3) return n.type === 'booking_approved' || n.type === 'booking_rejected'; // Bookings
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'asset_allocated':
      case 'asset_transferred':
      case 'asset_returned':
        return <RefreshCw size={16} color="#714B67" />;
      case 'maintenance_due':
      case 'maintenance_completed':
        return <Wrench size={16} color="#d97706" />;
      case 'booking_approved':
      case 'booking_rejected':
        return <Calendar size={16} color="#00A09D" />;
      default:
        return <Info size={16} color="#64748b" />;
    }
  };

  return (
    <>
      <PageHeader
        title="Activity logs & Notifications"
        onMenuToggle={onMenuToggle}
        actionLabel="Mark all as read"
        actionIcon={<CheckCheck size={16} />}
        onActionClick={handleMarkAllRead}
      />
      <PageContainer>
        <Card>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{ borderBottom: 1, borderColor: '#e2e8f0', px: 2 }}
          >
            <Tab label="All Notifications" />
            <Tab label="Alerts" />
            <Tab label="Approvals" />
            <Tab label="Bookings" />
          </Tabs>

          <CardContent sx={{ p: '0px !important' }}>
            <List sx={{ py: 0 }}>
              {filtered.map((item, idx) => (
                <Box key={item.id}>
                  {idx > 0 && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                  <ListItem
                    sx={{
                      backgroundColor: item.isRead ? 'transparent' : 'rgba(113, 75, 103, 0.03)',
                      py: 1.75,
                      px: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                      },
                      transition: 'background-color 150ms ease',
                    }}
                    secondaryAction={
                      !item.isRead && (
                        <IconButton
                          edge="end"
                          onClick={() => handleMarkRead(item.id)}
                          size="small"
                          title="Mark as Read"
                          sx={{ color: '#714B67' }}
                        >
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#714B67' }} />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>{getNotifIcon(item.type)}</ListItemIcon>
                    <Box sx={{ flex: '1 1 auto', minWidth: 0, py: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: item.isRead ? 550 : 700,
                          color: '#1e293b',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mt: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.3 }}>
                          {item.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                          {formatRelativeTime(item.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                </Box>
              ))}

              {filtered.length === 0 && (
                <Box sx={{ py: 8, textAlign: 'center', color: '#94a3b8' }}>
                  <Typography variant="body2">No notifications found in this segment.</Typography>
                </Box>
              )}
            </List>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
