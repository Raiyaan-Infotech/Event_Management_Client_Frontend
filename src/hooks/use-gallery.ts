import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface GalleryItem {
  id: number;
  event_name: string;
  city: string;
  images: string[];
  img_view: 'public' | 'private';
  is_active: number;
  vendor_id: number;
  createdAt: string;
}

export interface GalleryFormData {
  event_name: string;
  city: string;
  images: string[];
  img_view: 'public' | 'private';
  is_active: number;
}

const QUERY_KEY = ['vendor-gallery'] as const;

export const useGallery = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/vendors/gallery');
      return res.data.data as GalleryItem[];
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useGalleryItem = (id: number | string | null) =>
  useQuery({
    queryKey: ['vendor-gallery', id],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/gallery/${id}`);
      return res.data.data as GalleryItem;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useAddGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GalleryFormData) => {
      const res = await apiClient.post('/vendors/gallery', data);
      return res.data.data as GalleryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Gallery item added successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to add gallery item');
    },
  });
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: GalleryFormData & { id: number }) => {
      const res = await apiClient.put(`/vendors/gallery/${id}`, data);
      return res.data.data as GalleryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Gallery item updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update gallery item');
    },
  });
};

export const useToggleGalleryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.patch(`/vendors/gallery/${id}/status`);
      return res.data.data as GalleryItem;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Gallery item deleted');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete gallery item');
    },
  });
};
