import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface PublicClientRegisterPayload {
  name: string;
  email: string;
  mobile: string;
  address?: string | null;
  country?: string | null;
  state?: string | null;
  district?: string | null;
  city?: string | null;
  locality?: string | null;
  pincode?: string | null;
  subscribe_newsletter?: boolean;
}

export interface PublicClientLoginPayload {
  email: string;
  mobile: string;
}

export interface PublicNewsletterPayload {
  email: string;
  name?: string;
  mobile?: string;
}

const publicVendorPath = (slug: string, path: string) =>
  `/public/vendors/${encodeURIComponent(slug)}/${path}`;

export const usePublicClientRegister = (slug: string) =>
  useMutation({
    mutationFn: async (payload: PublicClientRegisterPayload) => {
      if (!slug) throw new Error('Vendor website is not ready for registration.');
      const res = await apiClient.post(publicVendorPath(slug, 'register-client'), payload);
      return res.data;
    },
  });

export const usePublicClientLogin = (slug: string) =>
  useMutation({
    mutationFn: async (payload: PublicClientLoginPayload) => {
      if (!slug) throw new Error('Vendor website is not ready for login.');
      const res = await apiClient.post(publicVendorPath(slug, 'login-client'), payload);
      return res.data;
    },
  });

export const usePublicNewsletterSubscribe = (slug: string) =>
  useMutation({
    mutationFn: async (payload: PublicNewsletterPayload) => {
      if (!slug) throw new Error('Newsletter subscription is available on the live vendor site.');
      const res = await apiClient.post(publicVendorPath(slug, 'newsletter-subscribe'), payload);
      return res.data;
    },
  });
