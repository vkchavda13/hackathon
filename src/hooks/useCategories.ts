import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { queryKeys } from './queryKeys';
import type { Category, CategoryFormData } from '@/types';
import { toast } from 'sonner';

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories.all, queryFn: () => CategoryRepository.getAll() });
}
export function useCategory(id: string) {
  return useQuery({ queryKey: queryKeys.categories.detail(id), queryFn: () => CategoryRepository.getById(id), enabled: !!id });
}
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryFormData) => CategoryRepository.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.categories.all }); toast.success('Category created'); },
    onError: () => { toast.error('Failed to create category'); },
  });
}
export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => CategoryRepository.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.categories.all }); toast.success('Category updated'); },
    onError: () => { toast.error('Failed to update category'); },
  });
}
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CategoryRepository.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.categories.all }); toast.success('Category deleted'); },
    onError: () => { toast.error('Failed to delete category'); },
  });
}
