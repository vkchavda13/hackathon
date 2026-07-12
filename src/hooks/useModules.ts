import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AllocationRepository } from '@/repositories/AllocationRepository';
import { BookingRepository } from '@/repositories/BookingRepository';
import { MaintenanceRepository } from '@/repositories/MaintenanceRepository';
import { AuditRepository } from '@/repositories/AuditRepository';
import { NotificationRepository } from '@/repositories/NotificationRepository';
import { ReportRepository } from '@/repositories/ReportRepository';
import { SettingsRepository } from '@/repositories/SettingsRepository';
import { queryKeys } from './queryKeys';
import type { AllocationFormData, BookingFormData, MaintenanceFormData, AuditCycleFormData, Allocation, Booking, MaintenanceRecord, AuditCycle, AppSettings } from '@/types';
import { toast } from 'sonner';

// ─── Allocations ──────────────────────────────────────────────────────────────
export function useAllocations() {
  return useQuery({ queryKey: queryKeys.allocations.all, queryFn: () => AllocationRepository.getAll() });
}
export function useCreateAllocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AllocationFormData) => AllocationRepository.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.allocations.all }); toast.success('Asset allocated'); },
    onError: () => { toast.error('Failed to allocate asset'); },
  });
}
export function useUpdateAllocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Allocation> }) => AllocationRepository.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.allocations.all }); toast.success('Allocation updated'); },
  });
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export function useBookings() {
  return useQuery({ queryKey: queryKeys.bookings.all, queryFn: () => BookingRepository.getAll() });
}
export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BookingFormData) => BookingRepository.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.bookings.all }); toast.success('Booking created'); },
    onError: () => { toast.error('Failed to create booking'); },
  });
}
export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Booking> }) => BookingRepository.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.bookings.all }); toast.success('Booking updated'); },
  });
}

// ─── Maintenance ──────────────────────────────────────────────────────────────
export function useMaintenance() {
  return useQuery({ queryKey: queryKeys.maintenance.all, queryFn: () => MaintenanceRepository.getAll() });
}
export function useCreateMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MaintenanceFormData) => MaintenanceRepository.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.maintenance.all }); toast.success('Maintenance scheduled'); },
    onError: () => { toast.error('Failed to schedule maintenance'); },
  });
}
export function useUpdateMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceRecord> }) => MaintenanceRepository.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.maintenance.all }); toast.success('Maintenance record updated'); },
  });
}

// ─── Audit ────────────────────────────────────────────────────────────────────
export function useAuditCycles() {
  return useQuery({ queryKey: queryKeys.audit.all, queryFn: () => AuditRepository.getAll() });
}
export function useCreateAuditCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AuditCycleFormData) => AuditRepository.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.audit.all }); toast.success('Audit cycle created'); },
    onError: () => { toast.error('Failed to create audit cycle'); },
  });
}
export function useUpdateAuditCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AuditCycle> }) => AuditRepository.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.audit.all }); toast.success('Audit cycle updated'); },
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────
export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications.all, queryFn: () => NotificationRepository.getAll() });
}
export function useUnreadNotifications() {
  return useQuery({ queryKey: queryKeys.notifications.unread, queryFn: () => NotificationRepository.getUnread() });
}
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotificationRepository.markAsRead(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.notifications.all }); },
  });
}
export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationRepository.markAllAsRead(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.notifications.all }); toast.success('All notifications marked as read'); },
  });
}

// ─── Reports ──────────────────────────────────────────────────────────────────
export function useReports() {
  return useQuery({ queryKey: queryKeys.reports.all, queryFn: () => ReportRepository.getAll() });
}
export function useCreateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, format, name }: { type: string; format: string; name?: string }) => ReportRepository.generate(type, format, name),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.reports.all }); },
  });
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export function useSettings() {
  return useQuery({ queryKey: queryKeys.settings.all, queryFn: () => SettingsRepository.get() });
}
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AppSettings>) => SettingsRepository.update(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.settings.all }); toast.success('Settings saved'); },
    onError: () => { toast.error('Failed to save settings'); },
  });
}
