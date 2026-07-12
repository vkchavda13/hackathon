import type { MaintenanceRecord, MaintenanceFormData } from '@/types';
import { fetchJsonData, saveJsonData } from './base';
import { generateId, simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/maintenance.json';

export const MaintenanceRepository = {
  async getAll(): Promise<MaintenanceRecord[]> {
    return fetchJsonData<MaintenanceRecord>(JSON_PATH);
  },
  async getById(id: string): Promise<MaintenanceRecord | null> {
    const items = await this.getAll();
    return items.find((m) => m.id === id) ?? null;
  },
  async getByAsset(assetId: string): Promise<MaintenanceRecord[]> {
    const items = await this.getAll();
    return items.filter((m) => m.assetId === assetId);
  },
  async create(data: MaintenanceFormData): Promise<MaintenanceRecord> {
    await simulateDelay(300);
    const items = await this.getAll();
    const now = new Date().toISOString();
    const newRecord: MaintenanceRecord = {
      id: generateId(), ...data, assetTag: 'AF-001', assetName: 'MacBook Pro 16" M3 Pro',
      status: 'scheduled', assignedToName: 'Sanjay Mishra', completedDate: null, cost: 0,
      createdAt: now, updatedAt: now,
    };
    items.push(newRecord);
    saveJsonData(JSON_PATH, items);
    return newRecord;
  },
  async update(id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    await simulateDelay(300);
    const items = await this.getAll();
    const idx = items.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Maintenance record not found');
    const updated = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    items[idx] = updated;
    saveJsonData(JSON_PATH, items);
    return updated;
  },
  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    const items = await this.getAll();
    const filtered = items.filter((m) => m.id !== id);
    saveJsonData(JSON_PATH, filtered);
  },
};
