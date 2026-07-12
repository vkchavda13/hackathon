'use client';

import { FormControl, FormControlLabel, Switch, FormHelperText } from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import React from 'react';

interface SwitchFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  defaultValue?: boolean;
  disabled?: boolean;
}

export default function SwitchField({
  name,
  label,
  control,
  defaultValue = false,
  disabled = false,
}: SwitchFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <FormControl error={!!error} component="fieldset">
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                {...field}
              />
            }
            label={label}
            slotProps={{
              typography: { fontSize: '0.8125rem', fontWeight: 500 }
            }}
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
