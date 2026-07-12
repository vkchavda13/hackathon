'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, Button, Grid, Card, CardContent, Typography, IconButton, Paper } from '@mui/material';
import BuildIcon from '@mui/icons-material/BuildOutlined';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import DateField from '@/components/forms/DateField';
import SectionHeader from '@/components/common/SectionHeader';
import { useAssets, useUpdateAsset } from '@/hooks/useAssets';
import { useEmployees } from '@/hooks/useEmployees';
import { useMaintenance, useCreateMaintenance, useUpdateMaintenance } from '@/hooks/useModules';
import { formatDate, formatCurrency } from '@/utils/format';
import type { MaintenanceFormData, MaintenanceRecord } from '@/types';
import React from 'react';

const schema = zod.object({
  assetId: zod.string().min(1, 'Please select an asset'),
  type: zod.enum(['preventive', 'corrective', 'emergency', 'inspection']),
  priority: zod.enum(['low', 'medium', 'high', 'critical']),
  title: zod.string().min(3, 'Request title is required'),
  description: zod.string().min(5, 'Detailed description is required'),
  scheduledDate: zod.string().min(1, 'Scheduled date is required'),
  assignedToId: zod.string().nullable().optional(),
  vendor: zod.string().optional(),
  notes: zod.string().optional(),
});

export default function MaintenancePage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: assets = [] } = useAssets();
  const { data: employees = [] } = useEmployees();
  const { data: maintenanceList = [], isLoading } = useMaintenance();
  const createMaintenance = useCreateMaintenance();
  const updateMaintenance = useUpdateMaintenance();
  const updateAsset = useUpdateAsset();

  const [formOpen, setFormOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<MaintenanceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'corrective',
      priority: 'medium',
      title: '',
      description: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      assignedToId: '',
      vendor: '',
      notes: '',
    },
  });

  const onSubmit = (data: MaintenanceFormData) => {
    createMaintenance.mutate(data, {
      onSuccess: (newRecord) => {
        // Automatically transition asset status to 'maintenance'
        updateAsset.mutate({
          id: data.assetId,
          data: { status: 'maintenance' },
        });
        setFormOpen(false);
        reset();
      },
    });
  };

  const handleStateTransition = (record: MaintenanceRecord, nextStatus: 'in_progress' | 'completed') => {
    const patch: Partial<MaintenanceRecord> = { status: nextStatus };
    if (nextStatus === 'completed') {
      patch.completedDate = new Date().toISOString().split('T')[0];
    }
    
    updateMaintenance.mutate(
      { id: record.id, data: patch },
      {
        onSuccess: () => {
          if (nextStatus === 'completed') {
            // Revert asset back to available status
            updateAsset.mutate({
              id: record.assetId,
              data: { status: 'available' },
            });
          }
        },
      }
    );
  };

  // Group maintenance list by status columns for the Screen 7 Kanban board simulation
  const pending = maintenanceList.filter((m) => m.status === 'scheduled');
  const inProgress = maintenanceList.filter((m) => m.status === 'in_progress');
  const completed = maintenanceList.filter((m) => m.status === 'completed' || m.status === 'cancelled');

  const renderKanbanCard = (record: MaintenanceRecord) => (
    <Paper
      key={record.id}
      sx={{
        p: 2,
        mb: 2,
        border: '1px solid #e2e8f0',
        borderRadius: 1,
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
          {record.title}
        </Typography>
        <StatusChip status={record.priority} type="priority" />
      </Box>
      <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mb: 1.5 }}>
        Asset: {record.assetTag} — {record.assetName}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          Sched: {formatDate(record.scheduledDate)}
        </Typography>

        {/* Transition triggers */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {record.status === 'scheduled' && (
            <IconButton
              size="small"
              onClick={() => handleStateTransition(record, 'in_progress')}
              color="primary"
              title="Start Maintenance Work"
            >
              <PlayArrowIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
          {record.status === 'in_progress' && (
            <IconButton
              size="small"
              onClick={() => handleStateTransition(record, 'completed')}
              color="success"
              title="Resolve Maintenance"
            >
              <CheckCircleIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <>
      <PageHeader
        title="Maintenance Management"
        onMenuToggle={onMenuToggle}
        actionLabel="Schedule Maintenance"
        actionIcon={<AddIcon />}
        onActionClick={() => setFormOpen(true)}
      />
      <PageContainer>
        {/* Kanban boards */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ backgroundColor: '#f8fafc', p: 2, borderRadius: 1, border: '1px solid #e2e8f0', minHeight: 400 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Pending / Scheduled ({pending.length})
              </Typography>
              {pending.map(renderKanbanCard)}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ backgroundColor: '#f8fafc', p: 2, borderRadius: 1, border: '1px solid #e2e8f0', minHeight: 400 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                In Progress ({inProgress.length})
              </Typography>
              {inProgress.map(renderKanbanCard)}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ backgroundColor: '#f8fafc', p: 2, borderRadius: 1, border: '1px solid #e2e8f0', minHeight: 400 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 2, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Completed / Resolved ({completed.length})
              </Typography>
              {completed.map(renderKanbanCard)}
            </Box>
          </Grid>
        </Grid>

        {/* Schedule Dialog Form */}
        <FormDialog
          open={formOpen}
          title="Schedule Maintenance Session"
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={createMaintenance.isPending}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name="assetId"
                label="Asset to Service"
                control={control}
                required
                options={assets.map((a) => ({ label: `${a.assetTag} — ${a.name}`, value: a.id }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="title" label="Request Title" control={control} required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField name="description" label="Problem Description" control={control} multiline rows={2} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name="type"
                label="Maintenance Type"
                control={control}
                required
                options={[
                  { label: 'Preventive', value: 'preventive' },
                  { label: 'Corrective Repair', value: 'corrective' },
                  { label: 'Emergency Resolve', value: 'emergency' },
                  { label: 'Safety Inspection', value: 'inspection' },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name="priority"
                label="Priority Alert Level"
                control={control}
                required
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                  { label: 'Critical', value: 'critical' },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateField name="scheduledDate" label="Scheduled Service Date" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name="assignedToId"
                label="Technician assigned"
                control={control}
                options={employees.map((e) => ({ label: `${e.firstName} ${e.lastName}`, value: e.id }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField name="vendor" label="External Vendor / Service Center" control={control} />
            </Grid>
          </Grid>
        </FormDialog>
      </PageContainer>
    </>
  );
}
