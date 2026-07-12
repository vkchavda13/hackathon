import type { Allocation, AllocationFormData } from '@/types';
import { fetchJsonData, saveJsonData } from './base';
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
    const items = await this.getAll();
    const now = new Date().toISOString();
    const newAlloc: Allocation = {
      id: generateId(), ...data, assetTag: 'AF-002', assetName: 'MacBook Pro 14"', employeeName: 'Neha Kapoor',
      departmentId: 'dept-001', departmentName: 'Information Technology', status: 'active',
      returnDate: null, previousEmployeeId: null, previousEmployeeName: null,
      createdAt: now, updatedAt: now,
    };
    items.push(newAlloc);
    saveJsonData(JSON_PATH, items);
    return newAlloc;
  },
  async update(id: string, data: Partial<Allocation>): Promise<Allocation> {
    await simulateDelay(300);
    const items = await this.getAll();
    const idx = items.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Allocation not found');
    const updated = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    items[idx] = updated;
    saveJsonData(JSON_PATH, items);
    return updated;
  },
  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    const items = await this.getAll();
    const filtered = items.filter((a) => a.id !== id);
    saveJsonData(JSON_PATH, filtered);
  },
};
