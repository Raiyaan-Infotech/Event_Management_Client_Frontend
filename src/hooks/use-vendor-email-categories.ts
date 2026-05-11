import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface EmailCategory {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: number;
  vendor_id: number;
  createdAt: string;
  [key: string]: unknown;
}

export interface EmailCategoryFormData {
  name: string;
  description?: string;
  sort_order?: number;
  is_active?: number;
}

const QUERY_KEY = ['vendor-email-categories'] as const;

export const useEmailCategories = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/email-categories', { params });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useEmailCategory = (id: number | string | null) =>
  useQuery({
    queryKey: ['vendor-email-categories', id],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/email-categories/${id}`);
      return res.data.data.category as EmailCategory;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useCreateEmailCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailCategoryFormData) => {
      const res = await apiClient.post('/vendors/email-categories', data);
      return res.data.data.category as EmailCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Email category created successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to create category');
    },
  });
};

export const useUpdateEmailCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: EmailCategoryFormData & { id: number }) => {
      const res = await apiClient.put(`/vendors/email-categories/${id}`, data);
      return res.data.data.category as EmailCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Email category updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update category');
    },
  });
};

export const useDeleteEmailCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/email-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Email category deleted');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete category');
    },
  });
};
