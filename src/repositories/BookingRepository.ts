import type { Booking, BookingFormData } from '@/types';
import { fetchJsonData, saveJsonData } from './base';
import { generateId, simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/bookings.json';

export const BookingRepository = {
  async getAll(): Promise<Booking[]> {
    return fetchJsonData<Booking>(JSON_PATH);
  },
  async getById(id: string): Promise<Booking | null> {
    const items = await this.getAll();
    return items.find((b) => b.id === id) ?? null;
  },
  async getByAsset(assetId: string): Promise<Booking[]> {
    const items = await this.getAll();
    return items.filter((b) => b.assetId === assetId);
  },
  async create(data: BookingFormData): Promise<Booking> {
    await simulateDelay(300);
    const items = await this.getAll();
    const now = new Date().toISOString();
    const newBooking: Booking = {
      id: generateId(), ...data, assetTag: 'AF-007', assetName: 'Logitech Rally Bar',
      requestedById: 'emp-003', requestedByName: 'Arjun Reddy', departmentName: 'Information Technology',
      status: 'pending', approvedById: null, approvedByName: null, approvedAt: null,
      createdAt: now, updatedAt: now,
    };
    items.push(newBooking);
    saveJsonData(JSON_PATH, items);
    return newBooking;
  },
  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    await simulateDelay(300);
    const items = await this.getAll();
    const idx = items.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    const updated = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    items[idx] = updated;
    saveJsonData(JSON_PATH, items);
    return updated;
  },
  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    const items = await this.getAll();
    const filtered = items.filter((b) => b.id !== id);
    saveJsonData(JSON_PATH, filtered);
  },
};
