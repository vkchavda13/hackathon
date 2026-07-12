// ─── Department Repository ─────────────────────────────────────────────────────
// Data access layer for departments. Calls /api/departments (Prisma-backed).

import type { Department, DepartmentFormData } from '@/types';

const BASE = '/api/departments';

export const DepartmentRepository = {
  async getAll(): Promise<Department[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  },

  async getById(id: string): Promise<Department | null> {
    const res = await fetch(`${BASE}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch department');
    return res.json();
  },

  async create(data: DepartmentFormData): Promise<Department> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create department');
    return res.json();
  },

  async update(id: string, data: Partial<Department>): Promise<Department> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update department');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete department');
  },
};
