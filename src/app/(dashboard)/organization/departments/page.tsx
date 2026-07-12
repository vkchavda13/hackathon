'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, Button, IconButton, TextField, Checkbox, FormControlLabel, Grid, InputAdornment, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SearchToolbar from '@/components/common/SearchToolbar';
import DataGrid from '@/components/tables/DataGrid';
import StatusChip from '@/components/common/StatusChip';
import FormDialog from '@/components/dialogs/FormDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import FormField from '@/components/forms/FormField';
import SwitchField from '@/components/forms/SwitchField';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '@/hooks/useDepartments';
import { useEmployees } from '@/hooks/useEmployees';
import type { Department, DepartmentFormData } from '@/types';
import React from 'react';

// Validation Schema
const schema = zod.object({
  name: zod.string().min(2, 'Name is required (min 2 chars)'),
  code: zod.string().min(2, 'Code is required (min 2 chars)'),
  description: zod.string().optional(),
  headId: zod.string().nullable().optional(),
  location: zod.string().min(2, 'Location is required'),
  budget: zod.coerce.number().min(0, 'Budget must be positive'),
  isActive: zod.boolean().default(true),
});

export default function DepartmentsPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: departments = [], isLoading } = useDepartments();
  const { data: employees = [] } = useEmployees();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  const { control, handleSubmit, reset } = useForm<DepartmentFormData>({
    resolver: zodResolver(schema),
  });

  const handleOpenForm = (dept?: Department) => {
    if (dept) {
      setSelectedDept(dept);
      reset({
        name: dept.name,
        code: dept.code,
        description: dept.description,
        headId: dept.headId,
        location: dept.location,
        budget: dept.budget,
        isActive: dept.isActive,
      });
    } else {
      setSelectedDept(null);
      reset({
        name: '',
        code: '',
        description: '',
        headId: '',
        location: '',
        budget: 0,
        isActive: true,
      });
    }
    setFormOpen(true);
  };

  const handleFormSubmit = (data: DepartmentFormData) => {
    if (selectedDept) {
      updateMutation.mutate(
        { id: selectedDept.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleOpenDelete = (dept: Department) => {
    setDeptToDelete(dept);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deptToDelete) {
      deleteMutation.mutate(deptToDelete.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeptToDelete(null);
        },
      });
    }
  };

  // Filter columns
  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'name', headerName: 'Department', flex: 1.5, renderCell: (params: any) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
          {params.row.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', lineHeight: 1.2, mt: 0.25 }}>
          {params.row.code}
        </Typography>
      </Box>
    )},
    { field: 'headName', headerName: 'Head / Lead', flex: 1.2, valueGetter: (value: any, row: any) => row.headName || 'Not Assigned' },
    { field: 'location', headerName: 'Location', flex: 1.2 },
    { field: 'budget', headerName: 'Annual Budget', flex: 1, valueGetter: (value: any, row: any) => `₹${row.budget.toLocaleString('en-IN')}` },
    { field: 'isActive', headerName: 'Status', flex: 0.8, renderCell: (params: any) => (
      <StatusChip status={params.value ? 'active' : 'inactive'} type="employee" />
    )},
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      flex: 0.8,
      align: 'right' as const,
      headerAlign: 'right' as const,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', width: '100%' }}>
          <IconButton onClick={() => handleOpenForm(params.row)} size="small" title="Edit">
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton onClick={() => handleOpenDelete(params.row)} size="small" title="Delete" color="error">
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Departments"
        onMenuToggle={onMenuToggle}
        actionLabel="Add Department"
        actionIcon={<AddIcon />}
        onActionClick={() => handleOpenForm()}
      />
      <PageContainer>
        <SearchToolbar
          searchPlaceholder="Search departments…"
          searchValue={search}
          onSearchChange={setSearch}
        />

        <DataGrid
          rows={filtered}
          columns={columns}
          loading={isLoading}
        />

        {/* Create/Edit Form Dialog */}
        <FormDialog
          open={formOpen}
          title={selectedDept ? 'Edit Department' : 'Create Department'}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit(handleFormSubmit)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="name" label="Department Name" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="code" label="Department Code" control={control} required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField name="description" label="Description" control={control} multiline rows={3} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="location" label="Location" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="budget" label="Annual Budget (INR)" control={control} type="number" required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <SwitchField name="isActive" label="Department is Active" control={control} />
            </Grid>
          </Grid>
        </FormDialog>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteOpen}
          title="Delete Department"
          message={`Are you sure you want to permanently delete department "${deptToDelete?.name}"? All assigned asset relationship structures will need reassignment.`}
          confirmLabel="Delete"
          isDestructive
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteOpen(false)}
        />
      </PageContainer>
    </>
  );
}
