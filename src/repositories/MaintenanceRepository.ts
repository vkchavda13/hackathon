import type { MaintenanceRecord, MaintenanceFormData } from '@/types';
import { fetchJsonData, clearCache } from './base';
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
    clearCache(JSON_PATH);
    const now = new Date().toISOString();
    return {
      id: generateId(), ...data, assetTag: '', assetName: '',
      status: 'scheduled', assignedToName: null, completedDate: null, cost: 0,
      createdAt: now, updatedAt: now,
    };
  },
  async update(id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const record = await this.getById(id);
    if (!record) throw new Error('Maintenance record not found');
    return { ...record, ...data, updatedAt: new Date().toISOString() };
  },
  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
};
