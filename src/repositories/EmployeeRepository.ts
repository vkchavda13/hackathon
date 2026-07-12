// ─── Employee Repository ───────────────────────────────────────────────────────
// Data access layer for employees. Calls /api/employees (Prisma-backed).

import type { Employee, EmployeeFormData } from '@/types';

const BASE = '/api/employees';

export const EmployeeRepository = {
  async getAll(): Promise<Employee[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  async getById(id: string): Promise<Employee | null> {
    const res = await fetch(`${BASE}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch employee');
    return res.json();
  },

  async getByDepartment(departmentId: string): Promise<Employee[]> {
    const all = await this.getAll();
    return all.filter((e) => e.departmentId === departmentId);
  },

  async create(data: EmployeeFormData): Promise<Employee> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create employee');
    return res.json();
  },

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update employee');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete employee');
  },
};
