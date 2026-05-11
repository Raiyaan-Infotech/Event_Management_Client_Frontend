import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorSocialLink {
  id: number;
  vendor_id: number;
  icon: string | null;
  icon_color: string | null;
  label: string;
  url: string;
  is_active: number;
  sort_order: number;
  createdAt: string;
}

export interface SocialLinkFormData {
  icon?: string;
  icon_color?: string;
  label: string;
  url: string;
  is_active?: number;
  sort_order?: number;
}

const QUERY_KEY = ['vendor-social-links'] as const;

export const useVendorSocialLinks = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/vendors/social-links');
      return res.data.data as VendorSocialLink[];
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useVendorSocialLinkItem = (id: number | string | null) =>
  useQuery({
    queryKey: ['vendor-social-links', id],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/social-links/${id}`);
      return res.data.data as VendorSocialLink;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useAddSocialLink = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SocialLinkFormData) => {
      const res = await apiClient.post('/vendors/social-links', data);
      return res.data.data as VendorSocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Social link added');
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to add social link');
    },
  });
};

export const useUpdateSocialLink = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: SocialLinkFormData & { id: number }) => {
      const res = await apiClient.put(`/vendors/social-links/${id}`, data);
      return res.data.data as VendorSocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Social link updated');
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update social link');
    },
  });
};

export const useToggleSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.put(`/vendors/social-links/${id}/toggle`);
      return res.data.data as VendorSocialLink;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to toggle social link');
    },
  });
};

export const useDeleteSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/social-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Social link deleted');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete social link');
    },
  });
};
