// ─── Asset Types ──────────────────────────────────────────────────────────────

import type { AuditFields } from './common';

export type AssetStatus = 'available' | 'allocated' | 'maintenance' | 'retired' | 'disposed' | 'reserved';
export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';

export interface Asset extends AuditFields {
  id: string;
  assetTag: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  status: AssetStatus;
  condition: AssetCondition;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  warrantyExpiry: string | null;
  location: string;
  assignedToId: string | null;
  assignedToName: string | null;
  notes: string;
  imageUrl: string | null;
}

export interface AssetFormData {
  name: string;
  description: string;
  categoryId: string;
  departmentId: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  purchasePrice: number;
  warrantyExpiry: string | null;
  location: string;
  condition: AssetCondition;
  notes: string;
}
