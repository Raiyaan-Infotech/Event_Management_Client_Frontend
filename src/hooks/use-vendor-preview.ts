import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface PortfolioItem {
  id: number;
  image_path: string | null;
  label: string | null;
  value: string | null;
  sort_order: number;
  is_active: 1 | 0;
}

export interface SocialLink {
  id: number;
  vendor_id: number;
  icon: string;
  icon_color: string;
  label: string;
  url: string;
  is_active: 1 | 0;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface VendorPreviewData {
  vendor: {
    id: number;
    company_name: string;
    company_logo: string | null;
    short_description: string | null;
    about_us: string | null;
    company_information: string | null;
    company_contact: string | null;
    company_email: string | null;
    company_address: string | null;
    copywrite: string | null;
    poweredby: string | null;
    locality: { id: number; name: string } | null;
    district: { id: number; name: string } | null;
  };
  theme_id: number | null;
  home_blocks: { block_type: string; is_visible: boolean }[];
  colors: {
    primary_color: string | null;
    secondary_color: string | null;
    header_color: string | null;
    footer_color: string | null;
    text_color: string | null;
    hover_color: string | null;
  } | null;
  gallery: {
    id: number;
    images: string[];
    event_name?: string;
    city?: string;
    is_active: 1 | 0;
  }[];
  testimonials: {
    id: number;
    customer_name: string;
    customer_portrait: string | null;
    client_feedback: string;
    event_name?: string;
    is_active: 1 | 0;
  }[];
  socialLinks: SocialLink[];
  pages: Array<{ id: number; name: string; description?: string | null; content?: string | null; is_active?: number }>;
  terms_content?: string | null;
  privacy_content?: string | null;
  portfolio: {
    clients: PortfolioItem[];
    sponsors: PortfolioItem[];
    events: PortfolioItem[];
  };
}

export const useVendorPreviewData = (vendorId?: number | null) =>
  useQuery({
    queryKey: ['vendor-preview-data', vendorId ?? 'me'],
    queryFn: async () => {
      const url = vendorId
        ? `/vendors/${vendorId}/preview-data`
        : '/vendors/auth/preview-data';
      const res = await apiClient.get(url, {
        params: { _t: Date.now() },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      return res.data.data as VendorPreviewData;
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
