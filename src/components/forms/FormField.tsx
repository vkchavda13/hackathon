'use client';

import { TextField, FormControl, FormHelperText } from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import React from 'react';

interface FormFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  defaultValue?: any;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
}

export default function FormField({
  name,
  label,
  control,
  defaultValue = '',
  placeholder,
  type = 'text',
  multiline = false,
  rows = 1,
  required = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth variant="outlined">
          <TextField
            {...field}
            label={label}
            placeholder={placeholder}
            type={type}
            multiline={multiline}
            rows={rows}
            disabled={disabled}
            required={required}
            error={!!error}
            helperText={error ? error.message : null}
            fullWidth
            size="small"
          />
        </FormControl>
      )}
    />
  );
}
