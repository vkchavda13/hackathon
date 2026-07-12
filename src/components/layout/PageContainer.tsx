'use client';

import { Box } from '@mui/material';
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minHeight: 0, // Flex child scroll bugfix
      }}
    >
      {children}
    </Box>
  );
}
