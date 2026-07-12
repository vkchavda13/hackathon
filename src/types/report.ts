// ─── Report Types ─────────────────────────────────────────────────────────────

export type ReportType =
  | 'asset_summary'
  | 'allocation_history'
  | 'maintenance_log'
  | 'depreciation'
  | 'audit_report'
  | 'department_assets'
  | 'category_breakdown'
  | 'cost_analysis';

export type ReportFormat = 'pdf' | 'csv' | 'xlsx';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  format: ReportFormat;
  generatedAt: string;
  generatedByName: string;
  fileSize: string;
  parameters: Record<string, string>;
}

export interface ReportGenerateParams {
  type: ReportType;
  format: ReportFormat;
  dateFrom?: string;
  dateTo?: string;
  departmentId?: string;
  categoryId?: string;
}
