// ─── Asset Repository ─────────────────────────────────────────────────────────

import type { Asset, AssetFormData, AssetStatus } from '@/types';
import { fetchJsonData, saveJsonData } from './base';
import { generateId, simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/assets.json';

export const AssetRepository = {
  async getAll(): Promise<Asset[]> {
    return fetchJsonData<Asset>(JSON_PATH);
  },

  async getById(id: string): Promise<Asset | null> {
    const assets = await this.getAll();
    return assets.find((a) => a.id === id || a.assetTag === id) ?? null;
  },

  async getByDepartment(departmentId: string): Promise<Asset[]> {
    const assets = await this.getAll();
    return assets.filter((a) => a.departmentId === departmentId);
  },

  async getByCategory(categoryId: string): Promise<Asset[]> {
    const assets = await this.getAll();
    return assets.filter((a) => a.categoryId === categoryId);
  },

  async getByStatus(status: AssetStatus): Promise<Asset[]> {
    const assets = await this.getAll();
    return assets.filter((a) => a.status === status);
  },

  async create(data: AssetFormData): Promise<Asset> {
    await simulateDelay(300);
    const assets = await this.getAll();
    const now = new Date().toISOString();
    const newAsset: Asset = {
      id: generateId(),
      assetTag: `AF-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      ...data,
      status: 'available',
      currentValue: data.purchasePrice,
      categoryName: 'Laptops',
      departmentName: 'Information Technology',
      assignedToId: null,
      assignedToName: null,
      imageUrl: null,
      createdAt: now,
      updatedAt: now,
    };
    assets.push(newAsset);
    saveJsonData(JSON_PATH, assets);
    return newAsset;
  },

  async update(id: string, data: Partial<Asset>): Promise<Asset> {
    await simulateDelay(300);
    const assets = await this.getAll();
    const idx = assets.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Asset not found');
    const updated = { ...assets[idx], ...data, updatedAt: new Date().toISOString() };
    assets[idx] = updated;
    saveJsonData(JSON_PATH, assets);
    return updated;
  },

  async delete(id: string): Promise<void> {
    await simulateDelay(200);
    const assets = await this.getAll();
    const filtered = assets.filter((a) => a.id !== id);
    saveJsonData(JSON_PATH, filtered);
  },

  async getStats(): Promise<{
    total: number;
    available: number;
    allocated: number;
    maintenance: number;
    retired: number;
  }> {
    const assets = await this.getAll();
    return {
      total: assets.length,
      available: assets.filter((a) => a.status === 'available').length,
      allocated: assets.filter((a) => a.status === 'allocated').length,
      maintenance: assets.filter((a) => a.status === 'maintenance').length,
      retired: assets.filter((a) => a.status === 'retired' || a.status === 'disposed').length,
    };
  },
};
