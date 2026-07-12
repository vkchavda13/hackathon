import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DepartmentRepository } from '@/repositories/DepartmentRepository';
import { queryKeys } from './queryKeys';
import type { Department, DepartmentFormData } from '@/types';
import { toast } from 'sonner';

export function useDepartments() {
  return useQuery({ queryKey: queryKeys.departments.all, queryFn: () => DepartmentRepository.getAll() });
}

export function useDepartment(id: string) {
  return useQuery({ queryKey: queryKeys.departments.detail(id), queryFn: () => DepartmentRepository.getById(id), enabled: !!id });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentFormData) => DepartmentRepository.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.departments.all }); toast.success('Department created'); },
    onError: () => { toast.error('Failed to create department'); },
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) => DepartmentRepository.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.departments.all }); toast.success('Department updated'); },
    onError: () => { toast.error('Failed to update department'); },
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DepartmentRepository.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.departments.all }); toast.success('Department deleted'); },
    onError: () => { toast.error('Failed to delete department'); },
  });
}
