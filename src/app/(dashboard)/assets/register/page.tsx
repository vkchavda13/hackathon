'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import DateField from '@/components/forms/DateField';
import SectionHeader from '@/components/common/SectionHeader';
import { useCreateAsset } from '@/hooks/useAssets';
import { useCategories } from '@/hooks/useCategories';
import { useDepartments } from '@/hooks/useDepartments';
import type { AssetFormData } from '@/types';
import React from 'react';

const schema = zod.object({
  name: zod.string().min(2, 'Asset name is required'),
  description: zod.string().min(5, 'Description is required (min 5 chars)'),
  categoryId: zod.string().min(1, 'Category is required'),
  departmentId: zod.string().min(1, 'Department is required'),
  serialNumber: zod.string().min(2, 'Serial number is required'),
  model: zod.string().min(2, 'Model is required'),
  manufacturer: zod.string().min(2, 'Manufacturer is required'),
  purchaseDate: zod.string().min(1, 'Purchase date is required'),
  purchasePrice: zod.coerce.number().min(1, 'Purchase price must be greater than 0'),
  warrantyExpiry: zod.string().nullable().optional(),
  location: zod.string().min(2, 'Location is required'),
  condition: zod.enum(['excellent', 'good', 'fair', 'poor', 'damaged']),
  notes: zod.string().optional(),
});

export default function RegisterAssetPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter();
  const createMutation = useCreateAsset();
  const { data: categories = [] } = useCategories();
  const { data: departments = [] } = useDepartments();

  const { control, handleSubmit } = useForm<AssetFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      condition: 'excellent',
      purchasePrice: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: '',
      notes: '',
    },
  });

  const onSubmit = (data: AssetFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/assets');
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Register Asset"
        onMenuToggle={onMenuToggle}
        breadcrumbs={[{ label: 'Assets', href: '/assets' }, { label: 'Register' }]}
      />
      <PageContainer>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardContent sx={{ p: '24px !important', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Section 1: General Details */}
              <Box>
                <SectionHeader title="General Asset Specifications" />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField name="name" label="Asset Name" control={control} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectField
                      name="categoryId"
                      label="Asset Category"
                      control={control}
                      required
                      options={categories.map((c) => ({ label: c.name, value: c.id }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormField name="description" label="Detailed Description" control={control} multiline rows={3} required />
                  </Grid>
                </Grid>
              </Box>

              {/* Section 2: Hardware Details */}
              <Box>
                <SectionHeader title="Hardware Specs & Identifiers" />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="manufacturer" label="Manufacturer" control={control} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="model" label="Model" control={control} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="serialNumber" label="Serial Number / Service Tag" control={control} required />
                  </Grid>
                </Grid>
              </Box>

              {/* Section 3: Financials & Location */}
              <Box>
                <SectionHeader title="Financial Information & Logistics" />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="purchasePrice" label="Purchase Price (INR)" control={control} type="number" required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <DateField name="purchaseDate" label="Purchase Date" control={control} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <DateField name="warrantyExpiry" label="Warranty Expiry" control={control} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectField
                      name="departmentId"
                      label="Owning Department"
                      control={control}
                      required
                      options={departments.map((d) => ({ label: d.name, value: d.id }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="location" label="Physical Location" control={control} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectField
                      name="condition"
                      label="Initial Condition"
                      control={control}
                      required
                      options={[
                        { label: 'Excellent', value: 'excellent' },
                        { label: 'Good', value: 'good' },
                        { label: 'Fair', value: 'fair' },
                        { label: 'Poor', value: 'poor' },
                        { label: 'Damaged', value: 'damaged' },
                      ]}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormField name="notes" label="Additional Notes" control={control} multiline rows={2} />
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, borderTop: '1px solid #f1f5f9', pt: 2.5, justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => router.push('/assets')}
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Registering…' : 'Register Asset'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    </>
  );
}
