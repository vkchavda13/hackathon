'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SearchToolbar from '@/components/common/SearchToolbar';
import DataGrid from '@/components/tables/DataGrid';
import StatusChip from '@/components/common/StatusChip';
import { useAssets } from '@/hooks/useAssets';
import { useCategories } from '@/hooks/useCategories';
import { useDepartments } from '@/hooks/useDepartments';
import Link from 'next/link';
import React from 'react';

export default function AssetsPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const router = useRouter();
  const { data: assets = [], isLoading } = useAssets();
  const { data: categories = [] } = useCategories();
  const { data: departments = [] } = useDepartments();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(search.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      asset.model.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !catFilter || asset.categoryId === catFilter;
    const matchesDepartment = !deptFilter || asset.departmentId === deptFilter;
    const matchesStatus = !statusFilter || asset.status === statusFilter;

    return matchesSearch && matchesCategory && matchesDepartment && matchesStatus;
  });

  const columns = [
    {
      field: 'assetTag',
      headerName: 'Tag ID',
      flex: 0.8,
      renderCell: (params: any) => (
        <MuiLink
          component={Link}
          href={`/assets/${params.row.id}`}
          sx={{ fontWeight: 600, color: '#2563eb', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          {params.value}
        </MuiLink>
      ),
    },
    { field: 'name', headerName: 'Asset Name', flex: 1.5, renderCell: (params: any) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
          {params.row.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', lineHeight: 1.2, mt: 0.25 }}>
          {params.row.manufacturer} — {params.row.model}
        </Typography>
      </Box>
    )},
    { field: 'categoryName', headerName: 'Category', flex: 1 },
    { field: 'departmentName', headerName: 'Department', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1.2 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: any) => <StatusChip status={params.value} type="asset" />,
    },
    {
      field: 'condition',
      headerName: 'Condition',
      flex: 0.8,
      renderCell: (params: any) => <StatusChip status={params.value} type="condition" />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Asset Directory"
        onMenuToggle={onMenuToggle}
        actionLabel="Register Asset"
        actionIcon={<AddIcon />}
        actionHref="/assets/register"
      />
      <PageContainer>
        <SearchToolbar
          searchPlaceholder="Search assets tag, serial or model…"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              key: 'categoryId',
              label: 'Category',
              value: catFilter,
              onChange: setCatFilter,
              options: categories.map((c) => ({ label: c.name, value: c.id })),
            },
            {
              key: 'departmentId',
              label: 'Department',
              value: deptFilter,
              onChange: setDeptFilter,
              options: departments.map((d) => ({ label: d.name, value: d.id })),
            },
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: 'Available', value: 'available' },
                { label: 'Allocated', value: 'allocated' },
                { label: 'Under Maintenance', value: 'maintenance' },
                { label: 'Reserved', value: 'reserved' },
                { label: 'Retired', value: 'retired' },
                { label: 'Disposed', value: 'disposed' },
              ],
            },
          ]}
          onClearFilters={() => {
            setSearch('');
            setCatFilter('');
            setDeptFilter('');
            setStatusFilter('');
          }}
        />

        <DataGrid
          rows={filtered}
          columns={columns}
          loading={isLoading}
          onRowClick={(params) => router.push(`/assets/${params.row.id}`)}
        />
      </PageContainer>
    </>
  );
}
