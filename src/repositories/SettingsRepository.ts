import type { AppSettings } from '@/types';
import { fetchJsonSingle } from './base';
import { simulateDelay } from '@/utils/format';

const JSON_PATH = '/json/settings.json';

export const SettingsRepository = {
  async get(): Promise<AppSettings> {
    return fetchJsonSingle<AppSettings>(JSON_PATH);
  },
  async update(data: Partial<AppSettings>): Promise<AppSettings> {
    await simulateDelay(300);
    const current = await this.get();
    return { ...current, ...data };
  },
};
