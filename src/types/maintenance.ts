// ─── Maintenance Types ────────────────────────────────────────────────────────

import type { AuditFields } from './common';

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceType = 'preventive' | 'corrective' | 'emergency' | 'inspection';

export interface MaintenanceRecord extends AuditFields {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  title: string;
  description: string;
  scheduledDate: string;
  completedDate: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
  cost: number;
  vendor: string | null;
  notes: string;
}

export interface MaintenanceFormData {
  assetId: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  title: string;
  description: string;
  scheduledDate: string;
  assignedToId: string | null;
  vendor: string | null;
  notes: string;
}
