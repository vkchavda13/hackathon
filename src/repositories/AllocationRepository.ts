import type { Allocation, AllocationFormData } from '@/types';
import { fetchJsonData, clearCache } from './base';
import { generateId, simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/allocations.json';

export const AllocationRepository = {
  async getAll(): Promise<Allocation[]> {
    return fetchJsonData<Allocation>(JSON_PATH);
  },
  async getById(id: string): Promise<Allocation | null> {
    const items = await this.getAll();
    return items.find((a) => a.id === id) ?? null;
  },
  async getByAsset(assetId: string): Promise<Allocation[]> {
    const items = await this.getAll();
    return items.filter((a) => a.assetId === assetId);
  },
  async getByEmployee(employeeId: string): Promise<Allocation[]> {
    const items = await this.getAll();
    return items.filter((a) => a.employeeId === employeeId);
  },
  async create(data: AllocationFormData): Promise<Allocation> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const now = new Date().toISOString();
    return {
      id: generateId(), ...data, assetTag: '', assetName: '', employeeName: '',
      departmentId: '', departmentName: '', status: 'active',
      returnDate: null, previousEmployeeId: null, previousEmployeeName: null,
      createdAt: now, updatedAt: now,
    };
  },
  async update(id: string, data: Partial<Allocation>): Promise<Allocation> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const alloc = await this.getById(id);
    if (!alloc) throw new Error('Allocation not found');
    return { ...alloc, ...data, updatedAt: new Date().toISOString() };
  },
  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
};
