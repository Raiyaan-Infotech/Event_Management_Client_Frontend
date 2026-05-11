import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Theme {
  id: number;
  name: string;
  plans: string | number[];
  primary_color: string | null;
  secondary_color: string | null;
  text_color: string | null;
  header_color: string | null;
  footer_color: string | null;
  hover_color: string | null;
  home_blocks: any;
  is_active: number;
  company_id: number | null;
}

export const useSaveVendorTheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (themeId: number) =>
      apiClient.put('/vendors/subscription/theme', { theme_id: themeId }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['vendor-me'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-home-blocks'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-colors'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-preview-data'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-themes'] }),
      ]);
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['vendor-preview-data'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['vendor-themes'], type: 'active' }),
      ]);
      toast.success('Theme saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save theme');
    },
  });
};

export const useVendorTheme = (planId?: number) => {
  return useQuery({
    queryKey: ['vendor-themes', planId],
    queryFn: async () => {
      if (!planId) return null;
      const res = await apiClient.get(`/vendors/subscription/themes/${planId}`, {
        params: { _t: Date.now() },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      return res.data.data?.themes as Theme[] || [];
    },
    enabled: !!planId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
