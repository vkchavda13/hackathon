import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployeeRepository } from '@/repositories/EmployeeRepository';
import { queryKeys } from './queryKeys';
import type { Employee, EmployeeFormData } from '@/types';
import { toast } from 'sonner';

export function useEmployees() {
  return useQuery({ queryKey: queryKeys.employees.all, queryFn: () => EmployeeRepository.getAll() });
}
export function useEmployee(id: string) {
  return useQuery({ queryKey: queryKeys.employees.detail(id), queryFn: () => EmployeeRepository.getById(id), enabled: !!id });
}
export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeFormData) => EmployeeRepository.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.employees.all }); toast.success('Employee created'); },
    onError: () => { toast.error('Failed to create employee'); },
  });
}
export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => EmployeeRepository.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.employees.all }); toast.success('Employee updated'); },
    onError: () => { toast.error('Failed to update employee'); },
  });
}
export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => EmployeeRepository.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.employees.all }); toast.success('Employee deleted'); },
    onError: () => { toast.error('Failed to delete employee'); },
  });
}
