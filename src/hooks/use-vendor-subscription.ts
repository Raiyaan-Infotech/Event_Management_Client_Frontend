import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string | null;
  price: string;
  discounted_price: string | null;
  validity: number | null;
  features: string | null;
  sort_order: number;
  is_active: number;
  is_custom: number;
  vendor_id: number | null;
  label_color: string | null;
}

export interface SubscriptionResponse {
  type: 'custom' | 'common';
  plans: SubscriptionPlan[];
}

export const useVendorSubscription = () =>
  useQuery({
    queryKey: ['vendor-subscription'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/subscription');
      return res.data.data as SubscriptionResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
