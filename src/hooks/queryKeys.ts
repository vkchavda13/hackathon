// ─── React Query Key Factory ──────────────────────────────────────────────────
// Centralized query key management. Ensures consistent cache invalidation.

export const queryKeys = {
  assets: {
    all: ['assets'] as const,
    detail: (id: string) => ['assets', id] as const,
    byDepartment: (id: string) => ['assets', 'department', id] as const,
    byCategory: (id: string) => ['assets', 'category', id] as const,
    byStatus: (status: string) => ['assets', 'status', status] as const,
    stats: ['assets', 'stats'] as const,
  },
  departments: {
    all: ['departments'] as const,
    detail: (id: string) => ['departments', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    detail: (id: string) => ['categories', id] as const,
  },
  employees: {
    all: ['employees'] as const,
    detail: (id: string) => ['employees', id] as const,
    byDepartment: (id: string) => ['employees', 'department', id] as const,
  },
  allocations: {
    all: ['allocations'] as const,
    detail: (id: string) => ['allocations', id] as const,
    byAsset: (id: string) => ['allocations', 'asset', id] as const,
    byEmployee: (id: string) => ['allocations', 'employee', id] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    detail: (id: string) => ['bookings', id] as const,
    byAsset: (id: string) => ['bookings', 'asset', id] as const,
  },
  maintenance: {
    all: ['maintenance'] as const,
    detail: (id: string) => ['maintenance', id] as const,
    byAsset: (id: string) => ['maintenance', 'asset', id] as const,
  },
  audit: {
    all: ['audit'] as const,
    detail: (id: string) => ['audit', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unread: ['notifications', 'unread'] as const,
  },
  reports: {
    all: ['reports'] as const,
    detail: (id: string) => ['reports', id] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
};
