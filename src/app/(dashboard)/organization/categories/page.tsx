'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, IconButton, Grid, Typography } from '@mui/material';
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
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import type { Category, CategoryFormData } from '@/types';
import React from 'react';

const schema = zod.object({
  name: zod.string().min(2, 'Name is required'),
  code: zod.string().min(2, 'Code is required'),
  description: zod.string().optional(),
  depreciationRate: zod.coerce.number().min(0).max(100, 'Rate must be between 0 and 100'),
  usefulLifeYears: zod.coerce.number().min(1, 'Must be at least 1 year'),
  isActive: zod.boolean().default(true),
});

export default function CategoriesPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);

  const { control, handleSubmit, reset } = useForm<CategoryFormData>({
    resolver: zodResolver(schema),
  });

  const handleOpenForm = (cat?: Category) => {
    if (cat) {
      setSelectedCat(cat);
      reset({
        name: cat.name,
        code: cat.code,
        description: cat.description,
        parentId: cat.parentId,
        depreciationRate: cat.depreciationRate,
        usefulLifeYears: cat.usefulLifeYears,
        isActive: cat.isActive,
      });
    } else {
      setSelectedCat(null);
      reset({
        name: '',
        code: '',
        description: '',
        parentId: null,
        depreciationRate: 15,
        usefulLifeYears: 5,
        isActive: true,
      });
    }
    setFormOpen(true);
  };

  const handleFormSubmit = (data: CategoryFormData) => {
    if (selectedCat) {
      updateMutation.mutate({ id: selectedCat.id, data }, { onSuccess: () => setFormOpen(false) });
    } else {
      createMutation.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  const handleOpenDelete = (cat: Category) => {
    setCatToDelete(cat);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (catToDelete) {
      deleteMutation.mutate(catToDelete.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setCatToDelete(null);
        },
      });
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'name', headerName: 'Category', flex: 1.5, renderCell: (params: any) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
          {params.row.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', lineHeight: 1.2, mt: 0.25 }}>
          {params.row.code}
        </Typography>
      </Box>
    )},
    { field: 'usefulLifeYears', headerName: 'Useful Life', flex: 1, valueGetter: (value: any, row: any) => `${row.usefulLifeYears} Years` },
    { field: 'depreciationRate', headerName: 'Depreciation Rate', flex: 1, valueGetter: (value: any, row: any) => `${row.depreciationRate}%` },
    { field: 'assetCount', headerName: 'Total Assets', flex: 1 },
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
        title="Asset Categories"
        onMenuToggle={onMenuToggle}
        actionLabel="Add Category"
        actionIcon={<AddIcon />}
        onActionClick={() => handleOpenForm()}
      />
      <PageContainer>
        <SearchToolbar
          searchPlaceholder="Search categories…"
          searchValue={search}
          onSearchChange={setSearch}
        />

        <DataGrid
          rows={filtered}
          columns={columns}
          loading={isLoading}
        />

        {/* Dialog Form */}
        <FormDialog
          open={formOpen}
          title={selectedCat ? 'Edit Category' : 'Create Category'}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit(handleFormSubmit)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="name" label="Category Name" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="code" label="Category Code" control={control} required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField name="description" label="Description" control={control} multiline rows={2} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="depreciationRate" label="Depreciation Rate (%)" control={control} type="number" required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="usefulLifeYears" label="Useful Life (Years)" control={control} type="number" required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <SwitchField name="isActive" label="Category is Active" control={control} />
            </Grid>
          </Grid>
        </FormDialog>

        {/* Confirm Delete */}
        <ConfirmDialog
          open={deleteOpen}
          title="Delete Category"
          message={`Are you sure you want to delete category "${catToDelete?.name}"? Make sure no active assets are mapped to this category.`}
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
