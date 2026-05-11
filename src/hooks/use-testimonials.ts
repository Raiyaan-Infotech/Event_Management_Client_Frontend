import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Testimonial {
  id: number;
  customer_name: string;
  customer_portrait: string | null;
  event_name: string;
  client_feedback: string | null;
  is_active: number;
  vendor_id: number;
  createdAt: string;
  [key: string]: unknown;
}

export interface TestimonialFormData {
  customer_name: string;
  customer_portrait: string;
  event_name: string;
  client_feedback: string;
  is_active?: boolean | number;
}

const QUERY_KEY = ['vendor-testimonials'] as const;

// ─── Get All ──────────────────────────────────────────────────────────────────
export const useTestimonials = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/vendors/testimonials');
      return res.data.data as Testimonial[];
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

// ─── Get By Id ────────────────────────────────────────────────────────────────
export const useTestimonialItem = (id: number | string | null) =>
  useQuery({
    queryKey: ['vendor-testimonials', id],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/testimonials/${id}`);
      return res.data.data as Testimonial;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

// ─── Create ───────────────────────────────────────────────────────────────────
export const useAddTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TestimonialFormData) => {
      const res = await apiClient.post('/vendors/testimonials', data);
      return res.data.data as Testimonial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Testimonial added successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to add testimonial');
    },
  });
};

// ─── Update ───────────────────────────────────────────────────────────────────
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: TestimonialFormData & { id: number }) => {
      const res = await apiClient.put(`/vendors/testimonials/${id}`, data);
      return res.data.data as Testimonial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Testimonial updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update testimonial');
    },
  });
};

// ─── Toggle Status ────────────────────────────────────────────────────────────
export const useToggleTestimonialStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.patch(`/vendors/testimonials/${id}/status`);
      return res.data.data as Testimonial;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────
export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Testimonial deleted');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete testimonial');
    },
  });
};
