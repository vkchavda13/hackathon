// ─── Category Repository ───────────────────────────────────────────────────────
// Data access layer for asset categories. Calls /api/categories (Prisma-backed).

import type { Category, CategoryFormData } from '@/types';

const BASE = '/api/categories';

export const CategoryRepository = {
  async getAll(): Promise<Category[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getById(id: string): Promise<Category | null> {
    const res = await fetch(`${BASE}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
  },

  async create(data: CategoryFormData): Promise<Category> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete category');
  },
};
