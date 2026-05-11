import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorPermission {
  id: number;
  name: string;
  slug: string;
  module: string;
  module_id: number;
  description: string | null;
  is_active: number;
  RolePermission?: {
    requires_approval: boolean;
  };
}

export interface VendorRole {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  level: number;
  vendor_id: number;
  is_active: number;
  permissions?: VendorPermission[];
  created_at: string;
  updated_at?: string;
}

export interface VendorModule {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: number;
  permissions: VendorPermission[];
}

export interface VendorRolesResponse {
  data: VendorRole[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ROLES_KEY = ['vendor-roles'] as const;
const MODULES_KEY = ['vendor-modules'] as const;
const PERMISSIONS_KEY = ['vendor-permissions'] as const;

// ─── Roles ───────────────────────────────────────────────────────────────────

export const useVendorRoles = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...ROLES_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/roles', { params });
      return res.data as VendorRolesResponse;
    },
  });
};

export const useVendorRole = (id: string | number | undefined) => {
  return useQuery({
    queryKey: [...ROLES_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get(`/vendors/roles/${id}`);
      return res.data.data.role as VendorRole;
    },
    enabled: !!id,
  });
};

export const useCreateVendorRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await apiClient.post('/vendors/roles', data);
      return res.data.data.role as VendorRole;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success('Role created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create role');
    },
  });
};

export const useUpdateVendorRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<VendorRole> }) => {
      const res = await apiClient.put(`/vendors/roles/${id}`, data);
      return res.data.data.role as VendorRole;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ROLES_KEY, variables.id] });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update role');
    },
  });
};

export const useDeleteVendorRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      await apiClient.delete(`/vendors/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success('Role deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete role');
    },
  });
};

export const useAssignPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, permissions }: {
      roleId: number | string;
      permissions: Array<{ permission_id: number; requires_approval?: boolean }>;
    }) => {
      const res = await apiClient.put(`/vendors/roles/${roleId}/permissions`, { permissions });
      return res.data.data.role as VendorRole;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ROLES_KEY, variables.roleId] });
      toast.success('Permissions assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign permissions');
    },
  });
};

// ─── Modules & Permissions (view only) ───────────────────────────────────────

export const useVendorModules = () => {
  return useQuery({
    queryKey: [...MODULES_KEY],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/modules');
      return res.data.data.modules as VendorModule[];
    },
  });
};

export const useVendorPermissions = () => {
  return useQuery({
    queryKey: [...PERMISSIONS_KEY],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/permissions');
      return res.data.data.permissions as VendorPermission[];
    },
  });
};
