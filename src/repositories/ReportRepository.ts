// ─── Report Repository ─────────────────────────────────────────────────────────
// Data access layer for analytics reports. Calls /api/reports (Prisma-backed).

import type { Report } from '@/types';

const BASE = '/api/reports';

export const ReportRepository = {
  async getAll(): Promise<Report[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch reports list');
    return res.json();
  },

  async getById(id: string): Promise<Report | null> {
    const all = await this.getAll();
    return all.find((r) => r.id === id) ?? null;
  },

  async generate(type: string, format: string, name?: string): Promise<Report> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, format, name }),
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  },
};
