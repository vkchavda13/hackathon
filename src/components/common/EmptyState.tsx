'use client';

import { Box, Typography, Button } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import React from 'react';

interface EmptyStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No records found',
  description,
  actionLabel,
  onActionClick,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
        backgroundColor: '#ffffff',
        border: '1px dashed #e2e8f0',
        borderRadius: 1,
      }}
    >
      <Box sx={{ color: '#cbd5e1', mb: 2 }}>
        {icon || <InboxOutlinedIcon sx={{ fontSize: 48 }} />}
      </Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 320, mb: actionLabel ? 2 : 0 }}>
        {description}
      </Typography>
      {actionLabel && onActionClick && (
        <Button variant="outlined" size="small" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
