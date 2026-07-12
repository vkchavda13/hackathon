'use client';

import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';
import React from 'react';

// ─── Table Skeleton ─────────────────────────────────────────────────────────
export function TableSkeleton() {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Search toolbar skeleton */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
        <Skeleton variant="rounded" width={240} height={36} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 2 }} />
      </Box>
      
      {/* Table grid skeleton */}
      <Card sx={{ border: '1px solid #f1f5f9' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 4 }}>
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} variant="text" width={`${20 - i}%`} height={24} />
          ))}
        </Box>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Array(6).fill(0).map((_, rowIndex) => (
            <Box key={rowIndex} sx={{ display: 'flex', gap: 4, py: 0.5 }}>
              <Skeleton variant="rounded" width={80} height={20} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="30%" height={20} />
              <Skeleton variant="text" width="15%" height={20} />
              <Skeleton variant="text" width="15%" height={20} />
              <Skeleton variant="rounded" width={90} height={20} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}

// ─── Detail Skeleton ─────────────────────────────────────────────────────────
export function DetailSkeleton() {
  return (
    <Grid container spacing={3}>
      {/* Left Main column */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header block */}
          <Card>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="rounded" width="40%" height={32} sx={{ borderRadius: 1.5, mb: 1 }} />
                  <Skeleton variant="text" width="25%" height={20} />
                </Box>
                <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 1.5 }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1.5 }} />
                <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1.5 }} />
              </Box>
            </CardContent>
          </Card>

          {/* Details fields */}
          <Card>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
              <Grid container spacing={2}>
                {Array(6).fill(0).map((_, i) => (
                  <Grid key={i} size={{ xs: 6, sm: 4 }}>
                    <Skeleton variant="text" width="40%" height={16} sx={{ mb: 0.5 }} />
                    <Skeleton variant="rounded" width="80%" height={28} sx={{ borderRadius: 1 }} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>

      {/* Right Sidebar column */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Secondary stats */}
          <Card>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton variant="rounded" width="60%" height={24} sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="20%" height={20} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="45%" height={20} />
                  <Skeleton variant="text" width="15%" height={20} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="text" width="25%" height={20} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Timeline skeleton */}
          <Card>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
              {Array(3).fill(0).map((_, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="circular" width={28} height={28} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="70%" height={20} />
                    <Skeleton variant="text" width="50%" height={16} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}

// ─── Dashboard Skeleton ─────────────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Alert banner skeleton */}
      <Skeleton variant="rounded" width="100%" height={48} sx={{ borderRadius: 1.5 }} />

      {/* Button controls skeleton */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Skeleton variant="rounded" width={130} height={36} sx={{ borderRadius: 1.5 }} />
        <Skeleton variant="rounded" width={130} height={36} sx={{ borderRadius: 1.5 }} />
        <Skeleton variant="rounded" width={130} height={36} sx={{ borderRadius: 1.5 }} />
      </Box>

      {/* KPI Cards skeleton */}
      <Grid container spacing={2}>
        {Array(4).fill(0).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="rounded" width="40%" height={32} sx={{ borderRadius: 1 }} />
                </Box>
                <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: 1.5 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts & timeline skeleton */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="circular" width={160} height={160} sx={{ mx: 'auto' }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" width="100%" height={160} sx={{ borderRadius: 1.5 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
              {Array(3).fill(0).map((_, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="circular" width={28} height={28} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="60%" height={16} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
