'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, Button, Grid, Card, CardContent, Typography, Alert, AlertTitle, LinearProgress } from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheckOutlined';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SearchToolbar from '@/components/common/SearchToolbar';
import DataGrid from '@/components/tables/DataGrid';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import DateField from '@/components/forms/DateField';
import SectionHeader from '@/components/common/SectionHeader';
import { useAuditCycles, useCreateAuditCycle } from '@/hooks/useModules';
import { useDepartments } from '@/hooks/useDepartments';
import { formatDate } from '@/utils/format';
import type { AuditCycleFormData } from '@/types';
import React from 'react';

const schema = zod.object({
  name: zod.string().min(3, 'Audit name is required'),
  description: zod.string().min(5, 'Description is required'),
  startDate: zod.string().min(1, 'Start date is required'),
  departmentId: zod.string().nullable().optional(),
});

export default function AuditPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: auditCycles = [], isLoading } = useAuditCycles();
  const { data: departments = [] } = useDepartments();
  const createAuditCycle = useCreateAuditCycle();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<AuditCycleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      departmentId: null,
    },
  });

  const onSubmit = (data: AuditCycleFormData) => {
    createAuditCycle.mutate(data, {
      onSuccess: () => {
        setFormOpen(false);
        reset();
      },
    });
  };

  const filtered = auditCycles.filter((cycle) =>
    cycle.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'name', headerName: 'Audit Cycle', flex: 1.5, renderCell: (params: any) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
          {params.row.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', lineHeight: 1.2, mt: 0.25 }}>
          Dept: {params.row.departmentName || 'All Departments'}
        </Typography>
      </Box>
    )},
    { field: 'startDate', headerName: 'Start Date', flex: 1, valueGetter: (value: any, row: any) => formatDate(row.startDate) },
    {
      field: 'progress',
      headerName: 'Progress',
      flex: 1.2,
      renderCell: (params: any) => {
        const total = params.row.totalAssets;
        const progressVal = total > 0 ? Math.round((params.row.verifiedCount / total) * 100) : 0;
        return (
          <Box sx={{ width: '100%', py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{progressVal}%</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>{params.row.verifiedCount}/{total}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progressVal} sx={{ height: 4, borderRadius: 2 }} />
          </Box>
        );
      },
    },
    { field: 'discrepancyCount', headerName: 'Discrepancies', flex: 0.8, renderCell: (params: any) => (
      <Typography variant="body2" sx={{ fontWeight: 600, color: params.value > 0 ? '#b45309' : '#1e293b' }}>
        {params.value}
      </Typography>
    )},
    { field: 'missingCount', headerName: 'Missing', flex: 0.8, renderCell: (params: any) => (
      <Typography variant="body2" sx={{ fontWeight: 600, color: params.value > 0 ? '#dc2626' : '#1e293b' }}>
        {params.value}
      </Typography>
    )},
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: any) => <StatusChip status={params.value} type="audit" />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Asset Audit Cycles"
        onMenuToggle={onMenuToggle}
        actionLabel="New Audit Cycle"
        actionIcon={<AddIcon />}
        onActionClick={() => setFormOpen(true)}
      />
      <PageContainer>
        {/* Warning block matching Screen 6 */}
        <Alert
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              startIcon={<DescriptionIcon />}
              href="/reports"
            >
              Generate Report
            </Button>
          }
          sx={{ border: '1px solid #fef3c7', borderRadius: 1 }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>Action Required</AlertTitle>
          3 assets flagged as missing/damaged — discrepancy reports generated automatically.
        </Alert>

        <SearchToolbar
          searchPlaceholder="Search audit cycles…"
          searchValue={search}
          onSearchChange={setSearch}
        />

        <DataGrid
          rows={filtered}
          columns={columns}
          loading={isLoading}
        />

        {/* Create Cycle Dialog Form */}
        <FormDialog
          open={formOpen}
          title="Initiate Physical Asset Audit Cycle"
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={createAuditCycle.isPending}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormField name="name" label="Audit Cycle Name" control={control} required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField name="description" label="Objective Description" control={control} multiline rows={3} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateField name="startDate" label="Start Date" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name="departmentId"
                label="Department Scope (Optional)"
                control={control}
                options={[
                  { label: 'All Departments', value: '' },
                  ...departments.map((d) => ({ label: d.name, value: d.id })),
                ]}
              />
            </Grid>
          </Grid>
        </FormDialog>
      </PageContainer>
    </>
  );
}
