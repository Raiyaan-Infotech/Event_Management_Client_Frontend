import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorSlider {
  id: number;
  type: 'basic' | 'advanced';
  title: string;
  image_path: string;
  button_label: string;
  button_color: string | null;
  status: 'published' | 'draft';
  is_active: number;
  // Advanced-only
  description: string | null;
  title_color: string | null;
  description_color: string | null;
  overlay_opacity: number | null;
  image_blur: number | null;
  image_brightness: number | null;
  content_alignment: 'left' | 'center' | 'right' | null;
  // Relations
  page_id: number | null;
  page?: { id: number; name: string } | null;
  vendor_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorSlidersResponse {
  data: VendorSlider[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type SliderFormData = {
  type: 'basic' | 'advanced';
  title: string;
  image_path: string;
  button_label: string;
  button_color?: string;
  page_id?: number | null;
  status?: 'published' | 'draft';
  // Advanced-only
  description?: string;
  title_color?: string;
  description_color?: string;
  overlay_opacity?: number;
  image_blur?: number;
  image_brightness?: number;
  content_alignment?: 'left' | 'center' | 'right';
};

const VENDOR_SLIDERS_KEY = ['vendor-sliders'] as const;

export const useVendorSliders = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  type?: 'basic' | 'advanced';
  status?: 'published' | 'draft';
}) => {
  return useQuery({
    queryKey: [...VENDOR_SLIDERS_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/sliders', { params });
      // Support both { data: { data: [], pagination: {} } } and { data: [] }
      const responseData = res.data.data;
      if (Array.isArray(responseData)) {
        return {
          data: responseData,
          pagination: { total: responseData.length, page: 1, limit: responseData.length, totalPages: 1 }
        } as VendorSlidersResponse;
      }
      return responseData as VendorSlidersResponse;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useVendorSlider = (id: number | null) => {
  return useQuery({
    queryKey: [...VENDOR_SLIDERS_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/sliders/${id}`);
      return res.data.data as VendorSlider;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateVendorSlider = (onSuccess?: (slider: VendorSlider) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SliderFormData) => {
      const res = await apiClient.post('/vendors/sliders', data);
      return res.data.data as VendorSlider;
    },
    onSuccess: (slider) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_SLIDERS_KEY });
      toast.success(`Slider "${slider.title}" created successfully`);
      onSuccess?.(slider);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to create slider');
    },
  });
};

export const useUpdateVendorSlider = (id: number, onSuccess?: (slider: VendorSlider) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<SliderFormData>) => {
      const res = await apiClient.put(`/vendors/sliders/${id}`, data);
      return res.data.data as VendorSlider;
    },
    onSuccess: (slider) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_SLIDERS_KEY });
      toast.success(`Slider "${slider.title}" updated successfully`);
      onSuccess?.(slider);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update slider');
    },
  });
};

export const useUpdateVendorSliderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.patch(`/vendors/sliders/${id}/status`);
      return res.data.data as VendorSlider;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_SLIDERS_KEY });
      toast.success('Slider status updated');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useDeleteVendorSlider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/sliders/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_SLIDERS_KEY });
      toast.success('Slider deleted successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete slider');
    },
  });
};
