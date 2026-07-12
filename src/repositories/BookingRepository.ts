import type { Booking, BookingFormData } from '@/types';
import { fetchJsonData, clearCache } from './base';
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
    clearCache(JSON_PATH);
    const now = new Date().toISOString();
    return {
      id: generateId(), ...data, assetTag: '', assetName: '',
      requestedById: '', requestedByName: '', departmentName: '',
      status: 'pending', approvedById: null, approvedByName: null, approvedAt: null,
      createdAt: now, updatedAt: now,
    };
  },
  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const booking = await this.getById(id);
    if (!booking) throw new Error('Booking not found');
    return { ...booking, ...data, updatedAt: new Date().toISOString() };
  },
  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
};
