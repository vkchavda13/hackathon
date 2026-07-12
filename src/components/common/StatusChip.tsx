'use client';

import { Box, Typography } from '@mui/material';
import { assetStatusColors, assetStatusLabels, assetConditionColors, maintenanceStatusColors, maintenanceStatusLabels, maintenancePriorityColors, bookingStatusColors, bookingStatusLabels, allocationStatusColors, auditStatusColors, auditResultColors, employeeStatusColors, notificationPriorityColors } from '@/constants/status';
import React from 'react';

export type StatusType = 
  | 'asset' 
  | 'condition' 
  | 'maintenance' 
  | 'priority' 
  | 'booking' 
  | 'allocation' 
  | 'audit' 
  | 'auditResult' 
  | 'employee' 
  | 'notification';

interface StatusChipProps {
  status: string;
  type: StatusType;
}

export default function StatusChip({ status, type }: StatusChipProps) {
  const normStatus = status.toLowerCase();
  let colorConfig = { bg: '#f1f5f9', color: '#475569' };
  let label = status;

  switch (type) {
    case 'asset':
      if (assetStatusColors[normStatus]) colorConfig = assetStatusColors[normStatus];
      if (assetStatusLabels[normStatus]) label = assetStatusLabels[normStatus];
      break;
    case 'condition':
      if (assetConditionColors[normStatus]) colorConfig = assetConditionColors[normStatus];
      label = status.charAt(0).toUpperCase() + status.slice(1);
      break;
    case 'maintenance':
      if (maintenanceStatusColors[normStatus]) colorConfig = maintenanceStatusColors[normStatus];
      if (maintenanceStatusLabels[normStatus]) label = maintenanceStatusLabels[normStatus];
      break;
    case 'priority':
      if (maintenancePriorityColors[normStatus]) colorConfig = maintenancePriorityColors[normStatus];
      label = status.charAt(0).toUpperCase() + status.slice(1);
      break;
    case 'booking':
      if (bookingStatusColors[normStatus]) colorConfig = bookingStatusColors[normStatus];
      if (bookingStatusLabels[normStatus]) label = bookingStatusLabels[normStatus];
      break;
    case 'allocation':
      if (allocationStatusColors[normStatus]) colorConfig = allocationStatusColors[normStatus];
      label = status.charAt(0).toUpperCase() + status.slice(1);
      break;
    case 'audit':
      if (auditStatusColors[normStatus]) colorConfig = auditStatusColors[normStatus];
      label = status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      break;
    case 'auditResult':
      if (auditResultColors[normStatus]) colorConfig = auditResultColors[normStatus];
      label = status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      break;
    case 'employee':
      if (employeeStatusColors[normStatus]) colorConfig = employeeStatusColors[normStatus];
      label = status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      break;
    case 'notification':
      if (notificationPriorityColors[normStatus]) colorConfig = notificationPriorityColors[normStatus];
      label = status.charAt(0).toUpperCase() + status.slice(1);
      break;
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.25,
        borderRadius: 9999,
        backgroundColor: colorConfig.bg,
        color: colorConfig.color,
        border: `1px solid ${colorConfig.bg === '#ffffff' ? '#e2e8f0' : 'transparent'}`,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.625rem',
          fontWeight: 600,
          lineHeight: 1.4,
          textTransform: 'capitalize',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
