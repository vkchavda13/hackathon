// ─── Notification Repository ───────────────────────────────────────────────────
// Data access layer for system notifications. Calls /api/notifications (Prisma-backed).

import type { Notification } from '@/types';

const BASE = '/api/notifications';

export const NotificationRepository = {
  async getAll(): Promise<Notification[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async getUnread(): Promise<Notification[]> {
    const all = await this.getAll();
    return all.filter((n) => !n.isRead);
  },

  async markAsRead(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
  },

  async markAllAsRead(): Promise<void> {
    const res = await fetch(BASE, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to mark all notifications as read');
  },
};
