// ─── Allocation Repository ─────────────────────────────────────────────────────
// Data access layer for asset allocations. Calls /api/allocations (Prisma-backed).

import type { Allocation, AllocationFormData } from '@/types';

const BASE = '/api/allocations';

export const AllocationRepository = {
  async getAll(): Promise<Allocation[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch allocations');
    return res.json();
  },

  async getById(id: string): Promise<Allocation | null> {
    const res = await fetch(`${BASE}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch allocation');
    return res.json();
  },

  async getByAsset(assetId: string): Promise<Allocation[]> {
    const all = await this.getAll();
    return all.filter((a) => a.assetId === assetId);
  },

  async getByEmployee(employeeId: string): Promise<Allocation[]> {
    const all = await this.getAll();
    return all.filter((a) => a.employeeId === employeeId);
  },

  async create(data: AllocationFormData): Promise<Allocation> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to create allocation');
    }
    return res.json();
  },

  async update(id: string, data: Partial<Allocation>): Promise<Allocation> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update allocation');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete allocation');
  },
};
