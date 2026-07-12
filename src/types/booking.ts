// ─── Booking Types ────────────────────────────────────────────────────────────

import type { AuditFields } from './common';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled';

export interface Booking extends AuditFields {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  requestedById: string;
  requestedByName: string;
  departmentName: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  purpose: string;
  notes: string;
  approvedById: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
}

export interface BookingFormData {
  assetId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  notes: string;
}
