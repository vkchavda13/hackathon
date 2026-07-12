'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, IconButton, Grid, Typography, Avatar } from '@mui/material';
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
import SelectField from '@/components/forms/SelectField';
import DateField from '@/components/forms/DateField';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { getInitials } from '@/utils/format';
import type { Employee, EmployeeFormData } from '@/types';
import React from 'react';

const schema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  email: zod.string().email('Invalid email address'),
  phone: zod.string().min(5, 'Phone number is required'),
  departmentId: zod.string().min(1, 'Department is required'),
  designation: zod.string().min(1, 'Designation is required'),
  status: zod.enum(['active', 'inactive', 'on_leave', 'terminated']),
  role: zod.enum(['admin', 'manager', 'head', 'employee']),
  joinDate: zod.string().min(1, 'Join date is required'),
});

export default function EmployeesPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter();
  const { data: employees = [], isLoading } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [empToDelete, setEmpToDelete] = useState<Employee | null>(null);

  const { control, handleSubmit, reset } = useForm<EmployeeFormData>({
    resolver: zodResolver(schema),
  });

  const handleOpenForm = (emp?: Employee) => {
    if (emp) {
      setSelectedEmp(emp);
      reset({
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        departmentId: emp.departmentId,
        designation: emp.designation,
        status: emp.status,
        role: emp.role,
        joinDate: emp.joinDate,
      });
    } else {
      setSelectedEmp(null);
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        departmentId: '',
        designation: '',
        status: 'active',
        role: 'employee',
        joinDate: new Date().toISOString().split('T')[0],
      });
    }
    setFormOpen(true);
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    if (selectedEmp) {
      updateMutation.mutate({ id: selectedEmp.id, data }, { onSuccess: () => setFormOpen(false) });
    } else {
      createMutation.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  const handleOpenDelete = (emp: Employee) => {
    setEmpToDelete(emp);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (empToDelete) {
      deleteMutation.mutate(empToDelete.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setEmpToDelete(null);
        },
      });
    }
  };

  const filtered = employees.filter(
    (e) =>
      (e.firstName.toLowerCase().includes(search.toLowerCase()) ||
        e.lastName.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(search.toLowerCase())) &&
      (!deptFilter || e.departmentId === deptFilter)
  );

  const columns = [
    {
      field: 'name',
      headerName: 'Employee',
      flex: 1.5,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#2563eb' }}>
            {getInitials(`${params.row.firstName} ${params.row.lastName}`)}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
              {params.row.firstName} {params.row.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', lineHeight: 1.2, mt: 0.25 }}>
              {params.row.employeeId}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'departmentName', headerName: 'Department', flex: 1.2 },
    { field: 'designation', headerName: 'Designation', flex: 1.2 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params: any) => {
        const labels = { admin: 'Admin', manager: 'Asset Manager', head: 'Dept Head', employee: 'Employee' };
        const roleVal = params.value as 'admin' | 'manager' | 'head' | 'employee';
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              color: roleVal === 'admin' ? '#714B67' : roleVal === 'manager' ? '#00A09D' : roleVal === 'head' ? '#d97706' : '#64748b',
            }}
          >
            {labels[roleVal] || params.value}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params: any) => <StatusChip status={params.value} type="employee" />,
    },
    { field: 'allocatedAssets', headerName: 'Allocated', flex: 0.8, align: 'center' as const, headerAlign: 'center' as const },
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
        title="Employees"
        onMenuToggle={onMenuToggle}
        actionLabel="Add Employee"
        actionIcon={<AddIcon />}
        onActionClick={() => handleOpenForm()}
      />
      <PageContainer>
        <SearchToolbar
          searchPlaceholder="Search employees…"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              key: 'departmentId',
              label: 'Department',
              value: deptFilter,
              onChange: setDeptFilter,
              options: departments.map((d) => ({ label: d.name, value: d.id })),
            },
          ]}
          onClearFilters={() => {
            setSearch('');
            setDeptFilter('');
          }}
        />

        <DataGrid
          rows={filtered}
          columns={columns}
          loading={isLoading}
          onRowClick={(params) => router.push(`/organization/employees/${params.row.id}`)}
        />

        {/* Dialog Form */}
        <FormDialog
          open={formOpen}
          title={selectedEmp ? 'Edit Employee' : 'Create Employee'}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit(handleFormSubmit)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="firstName" label="First Name" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="lastName" label="Last Name" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="email" label="Email Address" control={control} type="email" required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="phone" label="Phone Number" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name="departmentId"
                label="Department"
                control={control}
                required
                options={departments.map((d) => ({ label: d.name, value: d.id }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField name="designation" label="Designation" control={control} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name="role"
                label="Simulated Role (Promotion)"
                control={control}
                required
                options={[
                  { label: 'System Administrator (Admin)', value: 'admin' },
                  { label: 'Asset Manager (Manager)', value: 'manager' },
                  { label: 'Department Head (Head)', value: 'head' },
                  { label: 'Staff Member (Employee)', value: 'employee' },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name="status"
                label="Status"
                control={control}
                required
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'On Leave', value: 'on_leave' },
                  { label: 'Terminated', value: 'terminated' },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateField name="joinDate" label="Join Date" control={control} required />
            </Grid>
          </Grid>
        </FormDialog>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteOpen}
          title="Delete Employee"
          message={`Are you sure you want to delete employee "${empToDelete?.firstName} ${empToDelete?.lastName}"? Make sure they returned all allocated assets before proceeding.`}
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
