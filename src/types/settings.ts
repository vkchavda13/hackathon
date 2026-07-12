// ─── Settings Types ───────────────────────────────────────────────────────────

export interface AppSettings {
  organizationName: string;
  organizationAddress: string;
  contactEmail: string;
  contactPhone: string;
  assetIdPrefix: string;
  assetIdNextNumber: number;
  financialYearStart: string;
  currency: string;
  depreciationMethod: 'straight_line' | 'declining_balance';
  maintenanceReminderDays: number;
  warrantyReminderDays: number;
  auditFrequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  lowStockThreshold: number;
  enableEmailNotifications: boolean;
  enableBookingApproval: boolean;
  timezone: string;
}
