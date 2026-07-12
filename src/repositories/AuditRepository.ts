// ─── Audit Repository ─────────────────────────────────────────────────────────
// Data access layer for physical audits. Calls /api/audit (Prisma-backed).

import type { AuditCycle, AuditCycleFormData } from '@/types';

const BASE = '/api/audit';

export const AuditRepository = {
  async getAll(): Promise<AuditCycle[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch audit cycles');
    return res.json();
  },

  async getById(id: string): Promise<AuditCycle | null> {
    const res = await fetch(`${BASE}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch audit cycle');
    return res.json();
  },

  async create(data: AuditCycleFormData): Promise<AuditCycle> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create audit cycle');
    return res.json();
  },

  async update(id: string, data: Partial<AuditCycle>): Promise<AuditCycle> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update audit cycle');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete audit cycle');
  },
};
