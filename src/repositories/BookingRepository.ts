// ─── Booking Repository ────────────────────────────────────────────────────────
// Data access layer for resource bookings. Calls /api/bookings (Prisma-backed).

import type { Booking, BookingFormData } from '@/types';

const BASE = '/api/bookings';

export const BookingRepository = {
  async getAll(): Promise<Booking[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async getById(id: string): Promise<Booking | null> {
    const res = await fetch(`${BASE}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch booking');
    return res.json();
  },

  async getByAsset(assetId: string): Promise<Booking[]> {
    const all = await this.getAll();
    return all.filter((b) => b.assetId === assetId);
  },

  async create(data: BookingFormData): Promise<Booking> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to create booking');
    }
    return res.json();
  },

  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update booking');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete booking');
  },
};
