// ─── Category Types ───────────────────────────────────────────────────────────

import type { AuditFields } from './common';

export interface Category extends AuditFields {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId: string | null;
  assetCount: number;
  depreciationRate: number;
  usefulLifeYears: number;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  code: string;
  description: string;
  parentId: string | null;
  depreciationRate: number;
  usefulLifeYears: number;
  isActive: boolean;
}
