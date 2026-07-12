'use client';

import { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Alert, AlertTitle } from '@mui/material';
import { PlusCircle, Calendar, Wrench, CheckCircle2, FileText, AlertCircle, Package, Users } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import KPIGrid from '@/components/cards/KPIGrid';
import TimelineCard, { TimelineItem } from '@/components/cards/TimelineCard';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import { useAssetStats, useAssets } from '@/hooks/useAssets';
import { useNotifications, useBookings } from '@/hooks/useModules';
import { DashboardSkeleton } from '@/components/common/SkeletonLoader';
import Link from 'next/link';
import React from 'react';

export default function DashboardPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: stats, isLoading: statsLoading } = useAssetStats();
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: notifications = [] } = useNotifications();
  const { data: bookings = [] } = useBookings();

  if (statsLoading || assetsLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHeader title="Dashboard" onMenuToggle={onMenuToggle} />
        <PageContainer>
          <DashboardSkeleton />
        </PageContainer>
      </Box>
    );
  }

  // Metrics mapping
  const metrics = [
    {
      label: 'Total Assets',
      value: stats?.total ?? 30,
      icon: <Package size={18} />,
      iconBg: '#f5f3f7',
      iconColor: '#714B67',
      trend: { value: '+12% MoM', isPositive: true },
      description: 'Active devices in database',
    },
    {
      label: 'Available',
      value: stats?.available ?? 12,
      icon: <CheckCircle2 size={18} />,
      iconBg: '#e6f6f6',
      iconColor: '#00A09D',
      description: 'Ready to allocate to staff',
    },
    {
      label: 'Allocated',
      value: stats?.allocated ?? 15,
      icon: <Users size={18} />,
      iconBg: '#e0f2fe',
      iconColor: '#0284c7',
      trend: { value: '+8% MoM', isPositive: true },
      description: 'Deployed in departments',
    },
    {
      label: 'Maintenance',
      value: stats?.maintenance ?? 3,
      icon: <Wrench size={18} />,
      iconBg: '#fef3c7',
      iconColor: '#b45309',
      trend: { value: '-25% YoY', isPositive: true },
      description: 'In service pipeline',
    },
  ];

  // Activities list matching Screen 2
  const timelineItems: TimelineItem[] = [
    {
      id: '1',
      title: 'Laptop AF-001 Allocated',
      subtitle: 'Rajesh Sharma (IT Department)',
      timestamp: '2 hours ago',
      icon: <Users size={14} />,
      iconBg: '#e0f2fe',
      iconColor: '#0284c7',
    },
    {
      id: '2',
      title: 'Logitech Rally Bar Booked',
      subtitle: 'Priya Mehta (Marketing Room D3)',
      timestamp: '4 hours ago',
      icon: <Calendar size={14} />,
      iconBg: '#e6f6f6',
      iconColor: '#00A09D',
    },
    {
      id: '3',
      title: 'Projector AF-003 Maintenance Resolved',
      subtitle: 'HP Support - Complete replacement',
      timestamp: '1 day ago',
      icon: <Wrench size={14} />,
      iconBg: '#f1f5f9',
      iconColor: '#475569',
    },
  ];

  // Prepare chart data: Count by category
  const categoryCounts = assets?.reduce((acc: Record<string, number>, curr) => {
    acc[curr.categoryName] = (acc[curr.categoryName] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts || { 'Laptops': 10, 'Furniture': 15, 'Servers': 5 }).map(([name, count]) => ({
    name,
    count,
  }));

  // Prepare chart data: Count by department
  const deptCounts = assets?.reduce((acc: Record<string, number>, curr) => {
    acc[curr.departmentName] = (acc[curr.departmentName] || 0) + 1;
    return acc;
  }, {});
  const departmentData = Object.entries(deptCounts || { 'IT': 8, 'Operations': 12, 'Finance': 6, 'HR': 4 }).map(([name, count]) => ({
    name,
    count,
  }));

  const dashboardActions = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        component={Link}
        href="/assets/register"
        variant="contained"
        color="primary"
        startIcon={<PlusCircle size={14} />}
        sx={{ height: 32, py: 0, fontSize: '0.7rem' }}
      >
        Register Asset
      </Button>
      <Button
        component={Link}
        href="/booking"
        variant="outlined"
        startIcon={<Calendar size={14} />}
        sx={{ height: 32, py: 0, fontSize: '0.7rem', borderColor: '#cbd5e1', color: '#475569', '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' } }}
      >
        Book Resource
      </Button>
      <Button
        component={Link}
        href="/maintenance"
        variant="outlined"
        startIcon={<Wrench size={14} />}
        sx={{ height: 32, py: 0, fontSize: '0.7rem', borderColor: '#cbd5e1', color: '#475569', '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' } }}
      >
        Raise Request
      </Button>
    </Box>
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        onMenuToggle={onMenuToggle}
        breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]}
        actionButtons={dashboardActions}
      />
      <PageContainer>

        {/* Stats metrics */}
        <KPIGrid metrics={metrics} />

        {/* Charts and activity list */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <PieChart
                  title="Assets by Category"
                  data={categoryData}
                  dataKey="count"
                  nameKey="name"
                  height={220}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BarChart
                  title="Assets by Department"
                  data={departmentData}
                  dataKey="count"
                  xAxisKey="name"
                  height={220}
                  colors={['#714B67', '#00A09D', '#0284c7', '#d97706', '#16a34a', '#475569']}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Flagged Alert Banner relocated from top */}
              <Alert severity="error" sx={{ border: '1px solid #fecaca', borderRadius: 1.5 }}>
                <AlertTitle sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>Action Required</AlertTitle>
                <Typography variant="body2" sx={{ fontSize: '0.725rem', color: '#7f1d1d', lineHeight: 1.4 }}>
                  3 assets of IT department marked for review — Flagged for follow-up.
                </Typography>
              </Alert>
              <TimelineCard title="Recent Activity" items={timelineItems} />
            </Box>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
