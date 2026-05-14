import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

const CLIENT_ME_KEY = ['client-me'] as const;

export interface ClientProfile {
  id: number;
  client_id: string | null;
  vendor_id: number;
  company_id: number | null;
  name: string;
  email: string;
  mobile: string;
  profile_pic: string | null;
  registration_type: 'guest' | 'client';
  plan: string | null;
  subscription_id: number | null;
  client_type: 'subscribed' | 'unsubscribed';
  login_access: 0 | 1;
  is_active: 0 | 1 | 2;
  address: string | null;
  country: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
  locality: string | null;
  pincode: string | null;
  created_at: string;
  updated_at?: string;
  vendor?: { id: number; company_name: string; company_logo: string | null; status?: string };
}

export const useClientMe = () => {
  return useQuery({
    queryKey: CLIENT_ME_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/vendors/client/auth/me');
      return res.data.data?.client as ClientProfile;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useClientLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post('/vendors/client/auth/logout');
      } finally {
        await fetch('/api/logout', { method: 'GET' });
      }
    },
    onSuccess: () => {
      queryClient.clear();
      if (typeof window !== 'undefined') {
        document.cookie = 'client_auth_pending=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      }
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: () => {
      queryClient.clear();
      router.push('/login');
    },
  });
};

export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<ClientProfile>) => {
      const res = await apiClient.put('/vendors/client/auth/profile', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_ME_KEY });
      toast.success('Profile updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update profile');
    },
  });
};

export const useChangeClientPassword = () => {
  return useMutation({
    mutationFn: async (data: { current_password: string; new_password: string }) => {
      const res = await apiClient.put('/vendors/client/auth/change-password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to change password');
    },
  });
};

export const useForgotClientPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await apiClient.post('/vendors/client/auth/forgot-password', data);
      return res.data as { success: boolean; message: string; data?: { reset_code: string } };
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to send reset code');
    },
  });
};

export const useResetClientPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string; reset_code: string; new_password: string }) => {
      const res = await apiClient.post('/vendors/client/auth/reset-password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully. You can now log in.');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to reset password');
    },
  });
};
