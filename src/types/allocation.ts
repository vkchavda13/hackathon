// ─── Allocation Types ─────────────────────────────────────────────────────────

import type { AuditFields } from './common';

export type AllocationType = 'assignment' | 'transfer' | 'return';
export type AllocationStatus = 'active' | 'returned' | 'transferred';

export interface Allocation extends AuditFields {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  type: AllocationType;
  status: AllocationStatus;
  allocatedDate: string;
  returnDate: string | null;
  expectedReturnDate: string | null;
  notes: string;
  previousEmployeeId: string | null;
  previousEmployeeName: string | null;
}

export interface AllocationFormData {
  assetId: string;
  employeeId: string;
  type: AllocationType;
  allocatedDate: string;
  expectedReturnDate: string | null;
  notes: string;
}
