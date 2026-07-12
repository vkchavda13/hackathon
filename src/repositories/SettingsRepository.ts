// ─── Settings Repository ───────────────────────────────────────────────────────
// Data access layer for app configurations. Calls /api/settings (Prisma-backed).

import type { AppSettings } from '@/types';

const BASE = '/api/settings';

export const SettingsRepository = {
  async get(): Promise<AppSettings> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch settings configurations');
    return res.json();
  },

  async update(data: Partial<AppSettings>): Promise<AppSettings> {
    const res = await fetch(BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save settings configurations');
    return res.json();
  },
};
