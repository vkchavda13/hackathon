'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';

interface StatCardProps {
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

export default function StatCard({
  label,
  value,
  icon,
  iconBg = '#eff6ff',
  iconColor = '#2563eb',
  description,
  trend,
  onClick,
}: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              borderColor: '#cbd5e1',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            }
          : {},
        transition: 'all 150ms ease',
      }}
    >
      <CardContent sx={{ p: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </Typography>
          {icon && (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: iconBg,
                color: iconColor,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.5rem', lineHeight: 1 }}>
            {value}
          </Typography>
          {trend && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: trend.isPositive ? '#16a34a' : '#dc2626',
              }}
            >
              {trend.value}
            </Typography>
          )}
        </Box>
        {description && (
          <Typography variant="body2" sx={{ mt: 1, color: '#94a3b8', fontSize: '0.7rem' }}>
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
