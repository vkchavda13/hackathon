// ─── Employee Types ───────────────────────────────────────────────────────────

import type { AuditFields } from './common';

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';

export interface Employee extends AuditFields {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  status: EmployeeStatus;
  joinDate: string;
  allocatedAssets: number;
  avatarUrl: string | null;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: string;
  status: EmployeeStatus;
  joinDate: string;
}
