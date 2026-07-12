import type { Report } from '@/types';
import { fetchJsonData } from './base';
import { simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/reports.json';

export const ReportRepository = {
  async getAll(): Promise<Report[]> {
    return fetchJsonData<Report>(JSON_PATH);
  },
  async getById(id: string): Promise<Report | null> {
    const items = await this.getAll();
    return items.find((r) => r.id === id) ?? null;
  },
  async generate(): Promise<Report> {
    await simulateDelay(1000);
    return {} as Report;
  },
};
