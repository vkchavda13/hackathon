import type { Department, DepartmentFormData } from '@/types';
import { fetchJsonData, clearCache } from './base';
import { generateId, simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/departments.json';

export const DepartmentRepository = {
  async getAll(): Promise<Department[]> {
    return fetchJsonData<Department>(JSON_PATH);
  },

  async getById(id: string): Promise<Department | null> {
    const items = await this.getAll();
    return items.find((d) => d.id === id) ?? null;
  },

  async create(data: DepartmentFormData): Promise<Department> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const now = new Date().toISOString();
    return {
      id: generateId(),
      ...data,
      headName: null,
      employeeCount: 0,
      assetCount: 0,
      createdAt: now,
      updatedAt: now,
    };
  },

  async update(id: string, data: Partial<Department>): Promise<Department> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const dept = await this.getById(id);
    if (!dept) throw new Error('Department not found');
    return { ...dept, ...data, updatedAt: new Date().toISOString() };
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
};
