// ─── Maintenance Repository ───────────────────────────────────────────────────
// Data access layer for maintenance tickets. Calls /api/maintenance (Prisma-backed).

import type { MaintenanceRecord, MaintenanceFormData } from '@/types';

const BASE = '/api/maintenance';

export const MaintenanceRepository = {
  async getAll(): Promise<MaintenanceRecord[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch maintenance tickets');
    return res.json();
  },

  async getById(id: string): Promise<MaintenanceRecord | null> {
    const res = await fetch(`${BASE}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch maintenance ticket');
    return res.json();
  },

  async getByAsset(assetId: string): Promise<MaintenanceRecord[]> {
    const all = await this.getAll();
    return all.filter((m) => m.assetId === assetId);
  },

  async create(data: MaintenanceFormData): Promise<MaintenanceRecord> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create maintenance ticket');
    return res.json();
  },

  async update(id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update maintenance ticket');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete maintenance ticket');
  },
};
