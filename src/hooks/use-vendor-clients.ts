import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorClient {
  id: number;
  client_id: string;
  vendor_id: number;
  name: string;
  mobile: string;
  email: string;
  profile_pic: string | null;
  registration_type: 'guest' | 'client';
  subscription_id: number | null;
  plan: string | null;
  is_active: 0 | 1 | 2; // 0=inactive, 1=active, 2=blocked
  login_access: 0 | 1;
  address: string | null;
  country: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
  locality: string | null;
  pincode: string | null;
  created_at: string;
  updated_at?: string;
  company_id?: number;
}

export interface VendorClientResponse {
  data: VendorClient[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const CLIENTS_KEY = ['vendor-clients'] as const;

export const useVendorClients = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  plan?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}) => {
  return useQuery({
    queryKey: [...CLIENTS_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/clients', { params });
      return res.data.data as VendorClientResponse;
    },
  });
};

export const useVendorClient = (id: string | number | undefined) => {
  return useQuery({
    queryKey: [...CLIENTS_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get(`/vendors/clients/${id}`);
      return res.data.data as VendorClient;
    },
    enabled: !!id,
  });
};

export const useCreateVendorClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<VendorClient>) => {
      const res = await apiClient.post('/vendors/clients', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Client added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add client');
    },
  });
};

export const useUpdateVendorClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<VendorClient> }) => {
      const res = await apiClient.put(`/vendors/clients/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_KEY, variables.id] });
      toast.success('Client updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update client');
    },
  });
};

export const useDeleteVendorClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      await apiClient.delete(`/vendors/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Client deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete client');
    },
  });
};

export const useToggleVendorClientLoginAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, login_access }: { id: number | string; login_access: 0 | 1 }) => {
      const res = await apiClient.put(`/vendors/clients/${id}`, { login_access });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_KEY, variables.id] });
      toast.success(`Login access ${variables.login_access ? 'granted' : 'revoked'}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update login access');
    },
  });
};

export const useUpdateVendorClientStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number | string; is_active: number }) => {
      const res = await apiClient.patch(`/vendors/clients/${id}`, { is_active });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...CLIENTS_KEY, variables.id] });
      toast.success('Status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};
