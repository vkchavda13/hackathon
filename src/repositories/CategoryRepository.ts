import type { Category, CategoryFormData } from '@/types';
import { fetchJsonData, clearCache } from './base';
import { generateId, simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/categories.json';

export const CategoryRepository = {
  async getAll(): Promise<Category[]> {
    return fetchJsonData<Category>(JSON_PATH);
  },

  async getById(id: string): Promise<Category | null> {
    const items = await this.getAll();
    return items.find((c) => c.id === id) ?? null;
  },

  async create(data: CategoryFormData): Promise<Category> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const now = new Date().toISOString();
    return { id: generateId(), ...data, assetCount: 0, createdAt: now, updatedAt: now };
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    await simulateDelay(300);
    clearCache(JSON_PATH);
    const cat = await this.getById(id);
    if (!cat) throw new Error('Category not found');
    return { ...cat, ...data, updatedAt: new Date().toISOString() };
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    clearCache(JSON_PATH);
  },
};
