'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, Button, Grid, Card, CardContent, Alert, AlertTitle, Typography } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHorizOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import DateField from '@/components/forms/DateField';
import SectionHeader from '@/components/common/SectionHeader';
import TimelineCard, { TimelineItem } from '@/components/cards/TimelineCard';
import { useAssets, useUpdateAsset } from '@/hooks/useAssets';
import { useEmployees } from '@/hooks/useEmployees';
import { useAllocations, useCreateAllocation } from '@/hooks/useModules';
import { formatDate } from '@/utils/format';
import type { AllocationFormData } from '@/types';
import React from 'react';

const schema = zod.object({
  assetId: zod.string().min(1, 'Asset selection is required'),
  employeeId: zod.string().min(1, 'Employee assignment is required'),
  type: zod.enum(['assignment', 'transfer', 'return']),
  allocatedDate: zod.string().min(1, 'Date is required'),
  expectedReturnDate: zod.string().nullable().optional(),
  notes: zod.string().min(5, 'Notes are required (min 5 characters)'),
});

export default function AllocationPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: assets = [] } = useAssets();
  const { data: employees = [] } = useEmployees();
  const { data: allocations = [], isLoading } = useAllocations();
  const createAllocation = useCreateAllocation();
  const updateAsset = useUpdateAsset();

  const [alreadyAllocatedUser, setAlreadyAllocatedUser] = useState<string | null>(null);

  const { control, handleSubmit, setValue, reset } = useForm<AllocationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'assignment',
      allocatedDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: '',
      notes: '',
    },
  });

  // Watch assetId to trigger the "Double-allocation check" alert
  const watchedAssetId = useWatch({ control, name: 'assetId' });

  useEffect(() => {
    if (watchedAssetId) {
      const selectedAsset = assets.find((a) => a.id === watchedAssetId);
      if (selectedAsset && selectedAsset.status === 'allocated') {
        setAlreadyAllocatedUser(selectedAsset.assignedToName || 'another employee');
        setValue('type', 'transfer'); // auto-switch action to Transfer
      } else {
        setAlreadyAllocatedUser(null);
        setValue('type', 'assignment');
      }
    } else {
      setAlreadyAllocatedUser(null);
    }
  }, [watchedAssetId, assets, setValue]);

  const onSubmit = (data: AllocationFormData) => {
    const selectedAsset = assets.find((a) => a.id === data.assetId);
    const selectedEmp = employees.find((e) => e.id === data.employeeId);

    if (!selectedAsset || !selectedEmp) return;

    createAllocation.mutate(data, {
      onSuccess: () => {
        // Update the asset status inside the repository cache
        const nextStatus = data.type === 'return' ? 'available' : 'allocated';
        const nextEmpId = data.type === 'return' ? null : selectedEmp.id;
        const nextEmpName = data.type === 'return' ? null : `${selectedEmp.firstName} ${selectedEmp.lastName}`;

        updateAsset.mutate({
          id: selectedAsset.id,
          data: {
            status: nextStatus,
            assignedToId: nextEmpId,
            assignedToName: nextEmpName,
          },
        });

        // Reset form
        reset({
          assetId: '',
          employeeId: '',
          type: 'assignment',
          allocatedDate: new Date().toISOString().split('T')[0],
          expectedReturnDate: '',
          notes: '',
        });
        setAlreadyAllocatedUser(null);
      },
    });
  };

  // Maps allocations history timeline
  const timelineItems: TimelineItem[] = allocations.map((a) => ({
    id: a.id,
    title: `${a.assetTag} — ${a.type.toUpperCase()}`,
    subtitle: `Employee: ${a.employeeName} (${a.departmentName})`,
    description: a.notes,
    timestamp: formatDate(a.allocatedDate),
    icon: <SwapHorizIcon sx={{ fontSize: 14 }} />,
    iconBg: a.type === 'return' ? '#f1f5f9' : '#eff6ff',
    iconColor: a.type === 'return' ? '#475569' : '#2563eb',
  }));

  return (
    <>
      <PageHeader
        title="Asset Allocation & Transfer"
        onMenuToggle={onMenuToggle}
      />
      <PageContainer>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent sx={{ p: '24px !important' }}>
                <SectionHeader title="Create Allocation Record" />
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Select Asset */}
                  <SelectField
                    name="assetId"
                    label="Select Asset"
                    control={control}
                    required
                    options={assets.map((a) => ({
                      label: `${a.assetTag} — ${a.name} (${a.status})`,
                      value: a.id,
                    }))}
                  />

                  {/* Wireframe double-allocation warning */}
                  {alreadyAllocatedUser && (
                    <Alert severity="warning" sx={{ border: '1px solid #fef3c7' }}>
                      <AlertTitle sx={{ fontWeight: 600 }}>Double-Allocation Warning</AlertTitle>
                      Already Allocated to <strong>{alreadyAllocatedUser}</strong>. Action auto-adjusted to <strong>Transfer</strong>. Submit to execute transfer automatically.
                    </Alert>
                  )}

                  {/* Select Employee */}
                  <SelectField
                    name="employeeId"
                    label="Assign to Employee"
                    control={control}
                    required
                    options={employees.map((e) => ({
                      label: `${e.firstName} ${e.lastName} (${e.designation})`,
                      value: e.id,
                    }))}
                  />

                  {/* Type and date settings */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        name="type"
                        label="Transaction Type"
                        control={control}
                        required
                        options={[
                          { label: 'Initial Assignment', value: 'assignment' },
                          { label: 'Transfer Ownership', value: 'transfer' },
                          { label: 'Return to Storage', value: 'return' },
                        ]}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DateField name="allocatedDate" label="Effective Date" control={control} required />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <DateField name="expectedReturnDate" label="Expected Return Date (Optional)" control={control} />
                    </Grid>
                  </Grid>

                  {/* Notes */}
                  <FormField name="notes" label="Allocation / Return Reason" control={control} multiline rows={3} required />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ alignSelf: 'flex-end', height: 36 }}
                    disabled={createAllocation.isPending}
                  >
                    Submit Transaction
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <TimelineCard title="Global Allocation Logs" items={timelineItems} />
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
}
