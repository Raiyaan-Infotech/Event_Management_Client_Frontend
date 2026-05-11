import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Direct backend call — NO proxy, NO auth cookies needed
export interface PublicVendorData {
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
    locality?: { id: number; name: string } | null;
    district?: { id: number; name: string } | null;
    city?: string | null;
    website: string | null;
    nav_menu: any;
    footer_links: any;
    copywrite: string | null;
    poweredby: string | null;
    theme_id: number | null;
    palette_id: number | null;
  };
  theme_id: number | null;
  home_blocks: Array<{
    block_type: string;
    variant: string;
    is_visible: boolean;
  }>;
  colors: {
    primary_color: string | null;
    secondary_color: string | null;
    header_color: string | null;
    footer_color: string | null;
    text_color: string | null;
    hover_color: string | null;
  } | null;
  sliders: any[];
  portfolio: { clients: any[]; sponsors: any[]; events: any[] };
  gallery: any[];
  testimonials: any[];
  plans: any[];
  socialLinks: any[];
  pages: Array<{ id: number; name: string; description?: string | null; content?: string | null; is_active?: number }>;
  terms_content: string;
  privacy_content: string;
}

export const usePublicVendorData = (slug: string) =>
  useQuery<PublicVendorData>({
    queryKey: ['public-vendor', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/public/vendors/${encodeURIComponent(slug)}/website-data`);
      return res.data?.data as PublicVendorData;
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
