import type { Notification } from '@/types';
import { fetchJsonData, clearCache } from './base';
import { simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/notifications.json';

export const NotificationRepository = {
  async getAll(): Promise<Notification[]> {
    return fetchJsonData<Notification>(JSON_PATH);
  },
  async getUnread(): Promise<Notification[]> {
    const items = await this.getAll();
    return items.filter((n) => !n.isRead);
  },
  async markAsRead(id: string): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
  async markAllAsRead(): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
};
