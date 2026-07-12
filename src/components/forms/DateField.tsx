'use client';

import { FormControl, TextField } from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import React from 'react';

interface DateFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function DateField({
  name,
  label,
  control,
  defaultValue = '',
  required = false,
  disabled = false,
}: DateFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth>
          <TextField
            {...field}
            label={label}
            type="date"
            required={required}
            disabled={disabled}
            error={!!error}
            helperText={error ? error.message : null}
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            fullWidth
          />
        </FormControl>
      )}
    />
  );
}
