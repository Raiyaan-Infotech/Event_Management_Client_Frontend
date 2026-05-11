import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface PortfolioItem {
  id: number;
  type: 'client' | 'sponsor';
  image_path: string;
  is_active: number;
  vendor_id: number;
  createdAt: string;
}

const key = (type: 'client' | 'sponsor') => [`vendor-portfolio-${type}s`] as const;

export const usePortfolioItems = (type: 'client' | 'sponsor') =>
  useQuery({
    queryKey: key(type),
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/portfolio/${type}s`);
      return res.data.data as PortfolioItem[];
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export interface EventHighlight {
  id?: number;
  label: string;
  value: string;
  sort_order?: number;
}

export const useEventHighlights = () =>
  useQuery({
    queryKey: ['vendor-portfolio-events'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/portfolio/events');
      return res.data.data as EventHighlight[];
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useUpdateEventHighlights = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: { label: string; value: string }[]) => {
      const res = await apiClient.put('/vendors/portfolio/events', { items });
      return res.data.data as EventHighlight[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-portfolio-events'] });
      toast.success('Events saved successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to save events');
    },
  });
};

export const usePortfolioItem = (type: 'client' | 'sponsor', id: number | string | null) =>
  useQuery({
    queryKey: [`vendor-portfolio-${type}`, id],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/portfolio/${type}s/${id}`);
      return res.data.data as PortfolioItem;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useUpdatePortfolioItem = (type: 'client' | 'sponsor') => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, image_path }: { id: number; image_path: string }) => {
      const res = await apiClient.put(`/vendors/portfolio/${type}s/${id}`, { image_path });
      return res.data.data as PortfolioItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key(type) });
      toast.success(`${type === 'client' ? 'Client' : 'Sponsor'} updated successfully`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update item');
    },
  });
};

export const useAddPortfolioItem = (type: 'client' | 'sponsor') => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image_path: string) => {
      const res = await apiClient.post(`/vendors/portfolio/${type}s`, { image_path });
      return res.data.data as PortfolioItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key(type) });
      toast.success(`${type === 'client' ? 'Client' : 'Sponsor'} added successfully`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to add item');
    },
  });
};

export const useTogglePortfolioItemStatus = (type: 'client' | 'sponsor') => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.patch(`/vendors/portfolio/${type}s/${id}/status`);
      return res.data.data as PortfolioItem;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key(type) }),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useDeletePortfolioItem = (type: 'client' | 'sponsor') => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/portfolio/${type}s/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key(type) });
      toast.success(`${type === 'client' ? 'Client' : 'Sponsor'} removed`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete item');
    },
  });
};
