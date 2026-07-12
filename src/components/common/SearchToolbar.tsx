'use client';

import { Box, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { Search, X } from 'lucide-react';
import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  // Filters configuration
  filters?: {
    key: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  // Clear filters callback
  onClearFilters?: () => void;
  // Right side buttons
  actions?: React.ReactNode;
}

export default function SearchToolbar({
  searchPlaceholder = 'Search…',
  searchValue,
  onSearchChange,
  filters = [],
  onClearFilters,
  actions,
}: SearchToolbarProps) {
  const hasActiveFilters = searchValue || filters.some((f) => f.value);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        backgroundColor: '#ffffff',
        p: 2,
        borderRadius: 1,
        border: '1px solid #e2e8f0',
      }}
    >
      {/* Search and Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
        <TextField
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ width: { xs: '100%', sm: 200 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#94a3b8" />
                </InputAdornment>
              ),
            },
          }}
        />

        {filters.map((filter) => (
          <FormControl key={filter.key} size="small" sx={{ minWidth: 140, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel id={`label-${filter.key}`} sx={{ fontSize: '0.75rem' }}>
              {filter.label}
            </InputLabel>
            <Select
              labelId={`label-${filter.key}`}
              value={filter.value}
              label={filter.label}
              onChange={(e) => filter.onChange(e.target.value as string)}
              sx={{ fontSize: '0.75rem' }}
            >
              <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                <em>All</em>
              </MenuItem>
              {filter.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.75rem' }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        {hasActiveFilters && onClearFilters && (
          <Button
            size="small"
            variant="outlined"
            onClick={onClearFilters}
            startIcon={<X size={14} />}
            sx={{ height: 32 }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Actions (buttons, etc.) */}
      {actions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
          {actions}
        </Box>
      )}
    </Box>
  );
}
