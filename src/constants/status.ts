// ─── Status Constants ─────────────────────────────────────────────────────────
// Color maps for status chips across all modules.

import type { StatusVariant } from '@/types';

// Reusable color config for StatusChip component
export interface StatusColor {
  bg: string;
  color: string;
  variant: StatusVariant;
}

// Asset Status
export const assetStatusColors: Record<string, StatusColor> = {
  available:   { bg: '#dcfce7', color: '#15803d', variant: 'success' },
  allocated:   { bg: '#dbeafe', color: '#1d4ed8', variant: 'info' },
  maintenance: { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  retired:     { bg: '#f1f5f9', color: '#475569', variant: 'default' },
  disposed:    { bg: '#fecaca', color: '#dc2626', variant: 'error' },
  reserved:    { bg: '#e0e7ff', color: '#4338ca', variant: 'info' },
};

export const assetStatusLabels: Record<string, string> = {
  available: 'Available',
  allocated: 'Allocated',
  maintenance: 'Under Maintenance',
  retired: 'Retired',
  disposed: 'Disposed',
  reserved: 'Reserved',
};

// Asset Condition
export const assetConditionColors: Record<string, StatusColor> = {
  excellent: { bg: '#dcfce7', color: '#15803d', variant: 'success' },
  good:      { bg: '#dbeafe', color: '#1d4ed8', variant: 'info' },
  fair:      { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  poor:      { bg: '#fed7aa', color: '#c2410c', variant: 'warning' },
  damaged:   { bg: '#fecaca', color: '#dc2626', variant: 'error' },
};

// Maintenance Status
export const maintenanceStatusColors: Record<string, StatusColor> = {
  scheduled:   { bg: '#dbeafe', color: '#1d4ed8', variant: 'info' },
  in_progress: { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  completed:   { bg: '#dcfce7', color: '#15803d', variant: 'success' },
  cancelled:   { bg: '#f1f5f9', color: '#475569', variant: 'default' },
  overdue:     { bg: '#fecaca', color: '#dc2626', variant: 'error' },
};

export const maintenanceStatusLabels: Record<string, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  overdue: 'Overdue',
};

// Maintenance Priority
export const maintenancePriorityColors: Record<string, StatusColor> = {
  low:      { bg: '#f1f5f9', color: '#475569', variant: 'default' },
  medium:   { bg: '#dbeafe', color: '#1d4ed8', variant: 'info' },
  high:     { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  critical: { bg: '#fecaca', color: '#dc2626', variant: 'error' },
};

// Booking Status
export const bookingStatusColors: Record<string, StatusColor> = {
  pending:   { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  approved:  { bg: '#dcfce7', color: '#15803d', variant: 'success' },
  rejected:  { bg: '#fecaca', color: '#dc2626', variant: 'error' },
  active:    { bg: '#dbeafe', color: '#1d4ed8', variant: 'info' },
  completed: { bg: '#f1f5f9', color: '#475569', variant: 'default' },
  cancelled: { bg: '#f1f5f9', color: '#475569', variant: 'default' },
};

export const bookingStatusLabels: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// Allocation Status
export const allocationStatusColors: Record<string, StatusColor> = {
  active:      { bg: '#dcfce7', color: '#15803d', variant: 'success' },
  returned:    { bg: '#f1f5f9', color: '#475569', variant: 'default' },
  transferred: { bg: '#dbeafe', color: '#1d4ed8', variant: 'info' },
};

// Audit Status
export const auditStatusColors: Record<string, StatusColor> = {
  planned:     { bg: '#dbeafe', color: '#1d4ed8', variant: 'info' },
  in_progress: { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  completed:   { bg: '#dcfce7', color: '#15803d', variant: 'success' },
  cancelled:   { bg: '#f1f5f9', color: '#475569', variant: 'default' },
};

// Audit Result
export const auditResultColors: Record<string, StatusColor> = {
  verified:    { bg: '#dcfce7', color: '#15803d', variant: 'success' },
  discrepancy: { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  missing:     { bg: '#fecaca', color: '#dc2626', variant: 'error' },
  damaged:     { bg: '#fed7aa', color: '#c2410c', variant: 'warning' },
  pending:     { bg: '#f1f5f9', color: '#475569', variant: 'default' },
};

// Employee Status
export const employeeStatusColors: Record<string, StatusColor> = {
  active:     { bg: '#dcfce7', color: '#15803d', variant: 'success' },
  inactive:   { bg: '#f1f5f9', color: '#475569', variant: 'default' },
  on_leave:   { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  terminated: { bg: '#fecaca', color: '#dc2626', variant: 'error' },
};

// Notification Priority
export const notificationPriorityColors: Record<string, StatusColor> = {
  low:    { bg: '#f1f5f9', color: '#475569', variant: 'default' },
  medium: { bg: '#fef3c7', color: '#b45309', variant: 'warning' },
  high:   { bg: '#fecaca', color: '#dc2626', variant: 'error' },
};
