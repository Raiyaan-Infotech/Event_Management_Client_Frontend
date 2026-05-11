import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorEmailTemplate {
  id: number;
  name: string;
  category_id: number | null;
  description: string | null;
  is_active: number;
  vendor_id: number;
  createdAt: string;
  category: { id: number; name: string } | null;
  [key: string]: unknown;
}

export interface VendorEmailTemplateFormData {
  name: string;
  category_id: number | string | null;
  description: string;
  is_active?: number;
}

const QUERY_KEY = ['vendor-email-templates'] as const;

export const useVendorEmailTemplates = (params?: { page?: number; limit?: number; search?: string; category_id?: string | number }) =>
  useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/email-templates', { params });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useVendorEmailTemplate = (id: number | string | null) =>
  useQuery({
    queryKey: ['vendor-email-templates', id],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/email-templates/${id}`);
      return res.data.data.template as VendorEmailTemplate;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useCreateVendorEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: VendorEmailTemplateFormData) => {
      const res = await apiClient.post('/vendors/email-templates', data);
      return res.data.data.template as VendorEmailTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Email template created successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to create template');
    },
  });
};

export const useUpdateVendorEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: VendorEmailTemplateFormData & { id: number }) => {
      const res = await apiClient.put(`/vendors/email-templates/${id}`, data);
      return res.data.data.template as VendorEmailTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Email template updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update template');
    },
  });
};

export const useDeleteVendorEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/email-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Email template deleted');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete template');
    },
  });
};
