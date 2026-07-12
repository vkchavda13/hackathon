// ─── Type Barrel Export ───────────────────────────────────────────────────────
// Central re-export of all types for convenient imports.

export type { PaginatedResponse, QueryParams, SelectOption, ApiResponse, AuditFields, StatusVariant } from './common';
export type { Department, DepartmentFormData } from './department';
export type { Category, CategoryFormData } from './category';
export type { Employee, EmployeeFormData, EmployeeStatus } from './employee';
export type { Asset, AssetFormData, AssetStatus, AssetCondition } from './asset';
export type { Allocation, AllocationFormData, AllocationType, AllocationStatus } from './allocation';
export type { Booking, BookingFormData, BookingStatus } from './booking';
export type { MaintenanceRecord, MaintenanceFormData, MaintenanceStatus, MaintenancePriority, MaintenanceType } from './maintenance';
export type { AuditCycle, AuditRecord, AuditCycleFormData, AuditStatus, AuditResult } from './audit';
export type { Notification, NotificationType, NotificationPriority } from './notification';
export type { Report, ReportGenerateParams, ReportType, ReportFormat } from './report';
export type { AppSettings } from './settings';
