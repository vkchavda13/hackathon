'use client';

import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import React from 'react';

interface SelectFieldOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  options: SelectFieldOption[];
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectField({
  name,
  label,
  control,
  options,
  defaultValue = '',
  required = false,
  disabled = false,
}: SelectFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth size="small">
          <InputLabel id={`label-${name}`} required={required}>
            {label}
          </InputLabel>
          <Select
            {...field}
            labelId={`label-${name}`}
            label={label}
            disabled={disabled}
            error={!!error}
          >
            <MenuItem value="">
              <em>Select Option</em>
            </MenuItem>
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.75rem' }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
