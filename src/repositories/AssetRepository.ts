// ─── Asset Repository ─────────────────────────────────────────────────────────
// Data access layer for assets. Calls /api/assets route handlers (Prisma-backed).

import type { Asset, AssetFormData, AssetStatus } from '@/types';

const BASE = '/api/assets';

export const AssetRepository = {
  async getAll(): Promise<Asset[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch assets');
    return res.json();
  },

  async getById(id: string): Promise<Asset | null> {
    const res = await fetch(`${BASE}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch asset');
    return res.json();
  },

  async getByDepartment(departmentId: string): Promise<Asset[]> {
    const all = await this.getAll();
    return all.filter((a) => a.departmentId === departmentId);
  },

  async getByCategory(categoryId: string): Promise<Asset[]> {
    const all = await this.getAll();
    return all.filter((a) => a.categoryId === categoryId);
  },

  async getByStatus(status: AssetStatus): Promise<Asset[]> {
    const all = await this.getAll();
    return all.filter((a) => a.status === status);
  },

  async create(data: AssetFormData): Promise<Asset> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create asset');
    return res.json();
  },

  async update(id: string, data: Partial<Asset>): Promise<Asset> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update asset');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete asset');
  },

  async getStats(): Promise<{
    total: number;
    available: number;
    allocated: number;
    maintenance: number;
    retired: number;
  }> {
    const res = await fetch(`${BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch asset stats');
    return res.json();
  },
};
