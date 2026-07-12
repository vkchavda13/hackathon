'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading details…' }: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress size={24} thickness={4} color="primary" />
      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
        {message}
      </Typography>
    </Box>
  );
}
