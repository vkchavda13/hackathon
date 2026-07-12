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
import Link from 'next/link';
import React from 'react';

export default function DashboardPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: stats } = useAssetStats();
  const { data: assets } = useAssets();
  const { data: notifications } = useNotifications();
  const { data: bookings } = useBookings();

  // Metrics mapping
  const metrics = [
    { label: 'Total Assets', value: stats?.total ?? 30, icon: <Package size={18} />, iconBg: '#f5f3f7', iconColor: '#714B67' },
    { label: 'Available', value: stats?.available ?? 12, icon: <CheckCircle2 size={18} />, iconBg: '#e6f6f6', iconColor: '#00A09D' },
    { label: 'Allocated', value: stats?.allocated ?? 15, icon: <Users size={18} />, iconBg: '#e0f2fe', iconColor: '#0284c7' },
    { label: 'Maintenance', value: stats?.maintenance ?? 3, icon: <Wrench size={18} />, iconBg: '#fef3c7', iconColor: '#b45309' },
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

  return (
    <>
      <PageHeader
        title="Dashboard"
        onMenuToggle={onMenuToggle}
      />
      <PageContainer>
        {/* Flagged Alert Banner matching Screen 2 */}
        <Alert severity="error" sx={{ border: '1px solid #fecaca', borderRadius: 1 }}>
          <AlertTitle sx={{ fontWeight: 600 }}>Action Required</AlertTitle>
          3 assets of IT department marked for review — Flagged for follow-up.
        </Alert>

        {/* Action Button Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            component={Link}
            href="/assets/register"
            variant="contained"
            color="primary"
            startIcon={<PlusCircle size={16} />}
            sx={{ height: 36 }}
          >
            Register Asset
          </Button>
          <Button
            component={Link}
            href="/booking"
            variant="outlined"
            startIcon={<Calendar size={16} />}
            sx={{ height: 36, borderColor: '#e2e8f0', color: '#475569', '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' } }}
          >
            Book Resource
          </Button>
          <Button
            component={Link}
            href="/maintenance"
            variant="outlined"
            startIcon={<Wrench size={16} />}
            sx={{ height: 36, borderColor: '#e2e8f0', color: '#475569', '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' } }}
          >
            Raise Request
          </Button>
        </Box>

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
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TimelineCard title="Recent Activity" items={timelineItems} />
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
