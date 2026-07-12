// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType =
  | 'asset_allocated'
  | 'asset_returned'
  | 'maintenance_due'
  | 'maintenance_completed'
  | 'booking_approved'
  | 'booking_rejected'
  | 'audit_started'
  | 'warranty_expiring'
  | 'asset_transferred'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
}
