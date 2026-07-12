'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import React from 'react';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}

interface TimelineCardProps {
  items: TimelineItem[];
  title?: string;
}

export default function TimelineCard({ items, title }: TimelineCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '20px !important' }}>
        {title && (
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#475569',
              mb: 2.5,
            }}
          >
            {title}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
                {/* Timeline node & line */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: item.iconBg || '#eff6ff',
                      color: item.iconColor || '#2563eb',
                      zIndex: 1,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  {!isLast && (
                    <Box
                      sx={{
                        width: 2,
                        flexGrow: 1,
                        backgroundColor: '#e2e8f0',
                        my: 0.5,
                        minHeight: 24,
                      }}
                    />
                  )}
                </Box>

                {/* Timeline content */}
                <Box sx={{ pb: isLast ? 0 : 3.5, flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6875rem' }}>
                      {item.timestamp}
                    </Typography>
                  </Box>
                  {item.subtitle && (
                    <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 500, mt: 0.25 }}>
                      {item.subtitle}
                    </Typography>
                  )}
                  {item.description && (
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.75 }}>
                      {item.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
