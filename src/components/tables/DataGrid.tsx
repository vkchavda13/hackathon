'use client';

import { DataGrid as MuiDataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import React from 'react';

interface DataGridProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  rowCount?: number;
  onPageChange?: (page: number) => void;
  checkboxSelection?: boolean;
  getRowId?: (row: any) => string | number;
  onRowClick?: (params: GridRowParams) => void;
}

export default function DataGrid({
  rows,
  columns,
  loading = false,
  pageSize = 10,
  checkboxSelection = false,
  getRowId,
  onRowClick,
}: DataGridProps) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Box sx={{ width: '100%', height: 450 }}>
        <MuiDataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={!onRowClick} // Only disable if no click handler is active
          getRowId={getRowId}
          onRowClick={onRowClick}
          slots={{
            noRowsOverlay: () => (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState description="No items found matching the current criteria." />
              </Box>
            ),
            loadingOverlay: () => (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingState message="Fetching data records..." />
              </Box>
            ),
          }}
          sx={{
            border: 'none',
            fontSize: '0.75rem',
            color: '#1e293b',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              textTransform: 'uppercase',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#64748b',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f5f9',
              py: 1,
              outline: 'none !important', // clean focus border
            },
            '& .MuiDataGrid-row': {
              cursor: onRowClick ? 'pointer' : 'default',
              transition: 'background-color 0.15s ease',
              '&:hover': {
                backgroundColor: 'rgba(113, 75, 103, 0.04) !important', // smooth Odoo tint on hover!
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            },
          }}
        />
      </Box>
    </Paper>
  );
}
