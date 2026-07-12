// ─── Base Repository Helper ───────────────────────────────────────────────────
// Shared utility for fetching JSON data in repositories.
// When switching to Prisma, only these functions need to change.

import { simulateDelay } from '@/utils/format';

const dataCache = new Map<string, unknown>();

export async function fetchJsonData<T>(path: string): Promise<T[]> {
  if (dataCache.has(path)) {
    await simulateDelay(100);
    return dataCache.get(path) as T[];
  }

  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const data = await res.json();
  dataCache.set(path, data);
  await simulateDelay(200);
  return data as T[];
}

export function saveJsonData<T>(path: string, items: T[]): void {
  dataCache.set(path, items);
}

export function clearCache(path?: string): void {
  if (path) {
    dataCache.delete(path);
  } else {
    dataCache.clear();
  }
}

export async function fetchJsonSingle<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const data = await res.json();
  await simulateDelay(150);
  return data as T;
}
