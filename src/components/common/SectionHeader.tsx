'use client';

import { Box, Typography, Divider } from '@mui/material';
import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: description ? 0.5 : 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {title}
        </Typography>
        {action && <Box>{action}</Box>}
      </Box>
      {description && (
        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mb: 1 }}>
          {description}
        </Typography>
      )}
      <Divider sx={{ borderColor: '#f1f5f9' }} />
    </Box>
  );
}
