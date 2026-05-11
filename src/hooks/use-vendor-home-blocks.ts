import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import type { HomeBlock } from '@/types/home-blocks';

const HOME_BLOCKS_KEY = ['vendor-home-blocks'] as const;

// ─── GET /vendors/home-blocks ───────────────────────────────────────────────

export const useVendorHomeBlocks = () => {
  return useQuery({
    queryKey: HOME_BLOCKS_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/vendors/home-blocks');
      // API returns { success, data: [...] }
      const raw: { block_type: string; is_visible: number }[] = res.data.data ?? [];
      return raw.map((b) => ({
        block_type: b.block_type,
        is_visible: Boolean(b.is_visible),
      })) as HomeBlock[];
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
};

// ─── PUT /vendors/home-blocks ───────────────────────────────────────────────

/**
 * Caller passes onSuccess callback — no router.push inside the hook (project rule).
 */
export const useSaveVendorHomeBlocks = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blocks: HomeBlock[]) => {
      const res = await apiClient.put('/vendors/home-blocks', { blocks });
      return res.data.data as HomeBlock[];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(HOME_BLOCKS_KEY, data);
      queryClient.invalidateQueries({ queryKey: ['vendor-preview-data'] });
      toast.success('Home layout saved');
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to save home layout');
    },
  });
};
