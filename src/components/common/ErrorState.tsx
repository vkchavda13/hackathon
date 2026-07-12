'use client';

import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/Error';
import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
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
        border: '1px solid #fecaca',
        borderRadius: 1,
      }}
    >
      <Box sx={{ color: '#ef4444', mb: 2 }}>
        <ErrorOutlineIcon sx={{ fontSize: 40 }} />
      </Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#b91c1c', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#f87171', maxWidth: 320, mb: onRetry ? 2 : 0 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" size="small" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
}
