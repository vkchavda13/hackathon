import type { Employee, EmployeeFormData } from '@/types';
import { fetchJsonData, clearCache } from './base';
import { generateId, simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/employees.json';

export const EmployeeRepository = {
  async getAll(): Promise<Employee[]> {
    return fetchJsonData<Employee>(JSON_PATH);
  },

  async getById(id: string): Promise<Employee | null> {
    const items = await this.getAll();
    return items.find((e) => e.id === id || e.employeeId === id) ?? null;
  },

  async getByDepartment(departmentId: string): Promise<Employee[]> {
    const items = await this.getAll();
    return items.filter((e) => e.departmentId === departmentId);
  },

  async create(data: EmployeeFormData): Promise<Employee> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const now = new Date().toISOString();
    return {
      id: generateId(),
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      ...data,
      departmentName: '',
      allocatedAssets: 0,
      avatarUrl: null,
      createdAt: now,
      updatedAt: now,
    };
  },

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const emp = await this.getById(id);
    if (!emp) throw new Error('Employee not found');
    return { ...emp, ...data, updatedAt: new Date().toISOString() };
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
};
