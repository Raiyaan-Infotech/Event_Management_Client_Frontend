import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorStaff {
  id: number;
  emp_id: string;
  vendor_id: number;
  role_id: number | null;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  doj: string; // Date of joining
  dob: string; // Date of birth
  profile_pic: string | null;
  login_access: boolean;
  is_active: 0 | 1 | 2; // 0=inactive, 1=active, 2=blocked
  work_status: 'active' | 'inactive' | 'resigned' | 'relieved';
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

export interface VendorStaffResponse {
  data: VendorStaff[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const STAFF_KEY = ['vendor-staff'] as const;

export const useVendorStaff = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  designation?: string;
  work_status?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}) => {
  return useQuery({
    queryKey: [...STAFF_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/staff', { params });
      return res.data.data as VendorStaffResponse;
    },
  });
};

export const useVendorStaffMember = (id: string | number | undefined) => {
  return useQuery({
    queryKey: [...STAFF_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get(`/vendors/staff/${id}`);
      return res.data.data as VendorStaff;
    },
    enabled: !!id,
  });
};

export const useCreateVendorStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<VendorStaff>) => {
      const res = await apiClient.post('/vendors/staff', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      toast.success('Staff added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add staff member');
    },
  });
};

export const useUpdateVendorStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<VendorStaff> }) => {
      const res = await apiClient.put(`/vendors/staff/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      queryClient.invalidateQueries({ queryKey: [...STAFF_KEY, variables.id] });
      toast.success('Staff updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update staff member');
    },
  });
};

export const useDeleteVendorStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      await apiClient.delete(`/vendors/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      toast.success('Staff member deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete staff member');
    },
  });
};

export const useReassignVendorStaffRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role_id }: { id: number | string; role_id: number | string }) => {
      const res = await apiClient.put(`/vendors/staff/${id}/role`, { role_id });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      queryClient.invalidateQueries({ queryKey: [...STAFF_KEY, variables.id] });
      toast.success('Staff role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update staff role');
    },
  });
};

export const useUpdateVendorStaffStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number | string; is_active: number }) => {
      const res = await apiClient.patch(`/vendors/staff/${id}/status`, { is_active });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      queryClient.invalidateQueries({ queryKey: [...STAFF_KEY, variables.id] });
      toast.success('Status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};
