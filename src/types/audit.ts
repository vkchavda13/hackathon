// ─── Audit Types ──────────────────────────────────────────────────────────────

import type { AuditFields } from './common';

export type AuditStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type AuditResult = 'verified' | 'discrepancy' | 'missing' | 'damaged' | 'pending';

export interface AuditCycle extends AuditFields {
  id: string;
  name: string;
  description: string;
  status: AuditStatus;
  startDate: string;
  endDate: string | null;
  departmentId: string | null;
  departmentName: string | null;
  totalAssets: number;
  verifiedCount: number;
  discrepancyCount: number;
  missingCount: number;
  conductedById: string | null;
  conductedByName: string | null;
}

export interface AuditRecord extends AuditFields {
  id: string;
  cycleId: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  result: AuditResult;
  condition: string;
  location: string;
  notes: string;
  verifiedById: string;
  verifiedByName: string;
  verifiedAt: string;
}

export interface AuditCycleFormData {
  name: string;
  description: string;
  startDate: string;
  departmentId: string | null;
}
