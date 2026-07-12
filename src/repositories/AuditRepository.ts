import type { AuditCycle, AuditCycleFormData } from '@/types';
import { fetchJsonData, clearCache } from './base';
import { generateId, simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/audit.json';

export const AuditRepository = {
  async getAll(): Promise<AuditCycle[]> {
    return fetchJsonData<AuditCycle>(JSON_PATH);
  },
  async getById(id: string): Promise<AuditCycle | null> {
    const items = await this.getAll();
    return items.find((a) => a.id === id) ?? null;
  },
  async create(data: AuditCycleFormData): Promise<AuditCycle> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const now = new Date().toISOString();
    return {
      id: generateId(), ...data, status: 'planned', endDate: null,
      departmentName: null, totalAssets: 0, verifiedCount: 0,
      discrepancyCount: 0, missingCount: 0, conductedById: null,
      conductedByName: null, createdAt: now, updatedAt: now,
    };
  },
  async update(id: string, data: Partial<AuditCycle>): Promise<AuditCycle> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const cycle = await this.getById(id);
    if (!cycle) throw new Error('Audit cycle not found');
    return { ...cycle, ...data, updatedAt: new Date().toISOString() };
  },
  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
};
