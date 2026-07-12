import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetRepository } from '@/repositories/AssetRepository';
import { queryKeys } from './queryKeys';
import type { Asset, AssetFormData } from '@/types';
import { toast } from 'sonner';

export function useAssets() {
  return useQuery({ queryKey: queryKeys.assets.all, queryFn: () => AssetRepository.getAll() });
}

export function useAsset(id: string) {
  return useQuery({ queryKey: queryKeys.assets.detail(id), queryFn: () => AssetRepository.getById(id), enabled: !!id });
}

export function useAssetStats() {
  return useQuery({ queryKey: queryKeys.assets.stats, queryFn: () => AssetRepository.getStats() });
}

export function useCreateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssetFormData) => AssetRepository.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.assets.all }); toast.success('Asset registered successfully'); },
    onError: () => { toast.error('Failed to register asset'); },
  });
}

export function useUpdateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Asset> }) => AssetRepository.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.assets.all }); toast.success('Asset updated'); },
    onError: () => { toast.error('Failed to update asset'); },
  });
}

export function useDeleteAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AssetRepository.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.assets.all }); toast.success('Asset deleted'); },
    onError: () => { toast.error('Failed to delete asset'); },
  });
}
