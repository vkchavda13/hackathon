// ─── Department Types ─────────────────────────────────────────────────────────

import type { AuditFields } from './common';

export interface Department extends AuditFields {
  id: string;
  name: string;
  code: string;
  description: string;
  headId: string | null;
  headName: string | null;
  location: string;
  employeeCount: number;
  assetCount: number;
  budget: number;
  isActive: boolean;
}

export interface DepartmentFormData {
  name: string;
  code: string;
  description: string;
  headId: string | null;
  location: string;
  budget: number;
  isActive: boolean;
}
