'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, Button, Grid, Card, CardContent, Typography, Alert } from '@mui/material';
import EventIcon from '@mui/icons-material/EventOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import DateField from '@/components/forms/DateField';
import SectionHeader from '@/components/common/SectionHeader';
import StatusChip from '@/components/common/StatusChip';
import DataGrid from '@/components/tables/DataGrid';
import { useAssets } from '@/hooks/useAssets';
import { useBookings, useCreateBooking, useUpdateBooking } from '@/hooks/useModules';
import { formatDate } from '@/utils/format';
import type { BookingFormData, Booking } from '@/types';
import React from 'react';

const schema = zod.object({
  assetId: zod.string().min(1, 'Please select a bookable resource'),
  startDate: zod.string().min(1, 'Start date is required'),
  endDate: zod.string().min(1, 'End date is required'),
  purpose: zod.string().min(5, 'Purpose of booking is required (min 5 chars)'),
  notes: zod.string().optional(),
});

export default function BookingPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: assets = [] } = useAssets();
  const { data: bookings = [], isLoading } = useBookings();
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();

  const { control, handleSubmit, reset } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      purpose: '',
      notes: '',
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createBooking.mutate(data, {
      onSuccess: () => {
        reset({
          assetId: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          purpose: '',
          notes: '',
        });
      },
    });
  };

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    updateBooking.mutate({ id, data: { status } });
  };

  // Filter assets to those that can be booked (e.g. Projectors, Vehicles, A/V Equipment, etc.)
  const bookableCategories = ['cat-007', 'cat-009', 'cat-008']; // Vehicles, AV, Lab Equipment
  const bookableAssets = assets.filter((a) => bookableCategories.includes(a.categoryId) || a.status === 'available');

  const columns = [
    { field: 'assetTag', headerName: 'Tag', flex: 0.8 },
    { field: 'assetName', headerName: 'Resource / Asset', flex: 1.5 },
    { field: 'requestedByName', headerName: 'Requested By', flex: 1.2 },
    {
      field: 'dates',
      headerName: 'Schedule Time',
      flex: 1.8,
      valueGetter: (value: any, row: any) => `${formatDate(row.startDate)} to ${formatDate(row.endDate)}`,
    },
    { field: 'purpose', headerName: 'Purpose', flex: 1.5 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: any) => <StatusChip status={params.value} type="booking" />,
    },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      flex: 1.5,
      align: 'right' as const,
      headerAlign: 'right' as const,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
          {params.row.status === 'pending' && (
            <>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => handleStatusChange(params.row.id, 'approved')}
                sx={{ py: 0, height: 24, fontSize: '0.65rem' }}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleStatusChange(params.row.id, 'rejected')}
                sx={{ py: 0, height: 24, fontSize: '0.65rem' }}
              >
                Reject
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Resource Booking Calendar"
        onMenuToggle={onMenuToggle}
      />
      <PageContainer>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ p: '24px !important' }}>
                <SectionHeader title="Book Resource Form" />
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <SelectField
                    name="assetId"
                    label="Select Resource"
                    control={control}
                    required
                    options={bookableAssets.map((a) => ({
                      label: `${a.assetTag} — ${a.name}`,
                      value: a.id,
                    }))}
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DateField name="startDate" label="From Date" control={control} required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DateField name="endDate" label="To Date" control={control} required />
                    </Grid>
                  </Grid>

                  <FormField name="purpose" label="Purpose of Use" control={control} multiline rows={2} required />
                  <FormField name="notes" label="Additional Notes" control={control} multiline rows={2} />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ alignSelf: 'flex-end', height: 36 }}
                    disabled={createBooking.isPending}
                  >
                    Submit Booking
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent sx={{ p: '20px !important' }}>
                <SectionHeader title="Resource Schedule Registry" />
                <DataGrid
                  rows={bookings}
                  columns={columns}
                  loading={isLoading}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
