'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Box, Button, Grid, Card, CardContent } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import SwitchField from '@/components/forms/SwitchField';
import SectionHeader from '@/components/common/SectionHeader';
import { useSettings, useUpdateSettings } from '@/hooks/useModules';
import type { AppSettings } from '@/types';
import React, { useEffect } from 'react';

const schema = zod.object({
  organizationName: zod.string().min(2, 'Organization name is required'),
  organizationAddress: zod.string().min(5, 'Address is required'),
  contactEmail: zod.string().email('Invalid contact email'),
  contactPhone: zod.string().min(5, 'Phone number is required'),
  assetIdPrefix: zod.string().min(1, 'Asset prefix is required'),
  currency: zod.string().min(1, 'Currency is required'),
  depreciationMethod: zod.enum(['straight_line', 'declining_balance']),
  maintenanceReminderDays: zod.coerce.number().min(1, 'Must be at least 1 day'),
  warrantyReminderDays: zod.coerce.number().min(1, 'Must be at least 1 day'),
  auditFrequency: zod.enum(['monthly', 'quarterly', 'semi_annual', 'annual']),
  enableEmailNotifications: zod.boolean().default(true),
  enableBookingApproval: zod.boolean().default(true),
  timezone: zod.string().min(1, 'Timezone is required'),
});

export default function SettingsPage({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const { control, handleSubmit, reset } = useForm<AppSettings>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = (data: AppSettings) => {
    updateSettings.mutate(data);
  };

  return (
    <>
      <PageHeader
        title="Settings & System Configurations"
        onMenuToggle={onMenuToggle}
      />
      <PageContainer>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardContent sx={{ p: '24px !important', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Profile settings */}
              <Box>
                <SectionHeader title="Organization Profile" />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField name="organizationName" label="Legal Entity Name" control={control} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField name="contactEmail" label="Administrative Email" control={control} type="email" required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField name="contactPhone" label="Phone Number" control={control} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField name="organizationAddress" label="Address" control={control} required />
                  </Grid>
                </Grid>
              </Box>

              {/* Asset setup */}
              <Box>
                <SectionHeader title="Asset & Financial Policies" />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="assetIdPrefix" label="Asset Tag Prefix" control={control} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectField
                      name="depreciationMethod"
                      label="Depreciation Formula"
                      control={control}
                      required
                      options={[
                        { label: 'Straight Line', value: 'straight_line' },
                        { label: 'Declining Balance', value: 'declining_balance' },
                      ]}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="currency" label="Base Currency Code" control={control} required />
                  </Grid>
                </Grid>
              </Box>

              {/* Maintenance policies */}
              <Box>
                <SectionHeader title="Operation & System Toggles" />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="maintenanceReminderDays" label="Maintenance Lead Reminder (Days)" control={control} type="number" required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormField name="warrantyReminderDays" label="Warranty Expiry Lead (Days)" control={control} type="number" required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectField
                      name="auditFrequency"
                      label="Mandatory Audit Schedule"
                      control={control}
                      required
                      options={[
                        { label: 'Monthly', value: 'monthly' },
                        { label: 'Quarterly', value: 'quarterly' },
                        { label: 'Semi Annual', value: 'semi_annual' },
                        { label: 'Annual', value: 'annual' },
                      ]}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField name="timezone" label="Default Timezone" control={control} required />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  <SwitchField name="enableEmailNotifications" label="Enable Outbound Email Notifications" control={control} />
                  <SwitchField name="enableBookingApproval" label="Require Admin Approval for Resource Bookings" control={control} />
                </Box>
              </Box>

              {/* CTA save */}
              <Box sx={{ display: 'flex', borderTop: '1px solid #f1f5f9', pt: 2.5, justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  sx={{ height: 36 }}
                  disabled={updateSettings.isPending}
                >
                  {updateSettings.isPending ? 'Saving Configurations…' : 'Save Configurations'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    </>
  );
}
