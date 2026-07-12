'use client';

import { Grid } from '@mui/material';
import StatCard from '@/components/common/StatCard';
import React from 'react';

interface KPIMetric {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

interface KPIGridProps {
  metrics: KPIMetric[];
}

export default function KPIGrid({ metrics }: KPIGridProps) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <StatCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
}
