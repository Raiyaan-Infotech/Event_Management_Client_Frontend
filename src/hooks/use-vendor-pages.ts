import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorPage {
  id: number;
  name: string;
  description: string | null;
  content: string | null;
  is_active: number;
  vendor_id: number;
  company_id: number | null;
  created_by: number | null;
  updated_by: number | null;
  createdAt: string;
  updated_at: string;
}

export interface VendorPagesResponse {
  data: VendorPage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const VENDOR_PAGES_KEY = ['vendor-pages'] as const;

export const useVendorPages = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: [...VENDOR_PAGES_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/pages', { params });
      return res.data.data as VendorPagesResponse;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useVendorPage = (id: number | null) => {
  return useQuery({
    queryKey: [...VENDOR_PAGES_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/pages/${id}`);
      return res.data.data as VendorPage;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateVendorPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; content?: string }) => {
      const res = await apiClient.post('/vendors/pages', data);
      return res.data.data as VendorPage;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_PAGES_KEY });
      toast.success(`Page "${page.name}" created successfully`);
      router.push('/website/pages');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to create page');
    },
  });
};

export const useUpdateVendorPage = (id: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { name?: string; description?: string; content?: string }) => {
      const res = await apiClient.put(`/vendors/pages/${id}`, data);
      return res.data.data as VendorPage;
    },
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_PAGES_KEY });
      toast.success(`Page "${page.name}" updated successfully`);
      router.push('/website/pages');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update page');
    },
  });
};

export const useDeleteVendorPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/pages/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_PAGES_KEY });
      toast.success('Page deleted successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete page');
    },
  });
};

// ─── Terms & Conditions ───────────────────────────────────────────────────────

export const useVendorTerms = (enabled = true) =>
  useQuery({
    queryKey: ['vendor-terms'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/pages/terms-conditions');
      return res.data.data as { content: string } | null;
    },
    enabled,
    staleTime: 30 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

export const useUpdateVendorTerms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const res = await apiClient.put('/vendors/pages/terms-conditions', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-terms'] });
      toast.success('Terms & Conditions updated');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update terms');
    },
  });
};

// ─── Privacy Policy ───────────────────────────────────────────────────────────

export const useVendorPrivacy = (enabled = true) =>
  useQuery({
    queryKey: ['vendor-privacy'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/pages/privacy-policy');
      return res.data.data as { content: string } | null;
    },
    enabled,
    staleTime: 30 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

export const useUpdateVendorPrivacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const res = await apiClient.put('/vendors/pages/privacy-policy', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-privacy'] });
      toast.success('Privacy Policy updated');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update privacy policy');
    },
  });
};

export const useUpdateVendorPageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: number }) => {
      const res = await apiClient.patch(`/vendors/pages/${id}/status`, { status });
      return res.data.data as VendorPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_PAGES_KEY });
      toast.success('Page status updated');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });
};
