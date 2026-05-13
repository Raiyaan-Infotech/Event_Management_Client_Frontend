import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface PublicBranding {
  name: string | null;
  logo: string | null;
  favicon: string | null;
}

export const usePublicBranding = () =>
  useQuery<PublicBranding | null>({
    queryKey: ['public-branding'],
    queryFn: async () => {
      const res = await apiClient.get('/settings/public');
      return res.data.data?.company ?? null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
