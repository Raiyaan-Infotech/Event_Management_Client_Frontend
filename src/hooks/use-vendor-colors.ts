import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorColors {
  primary_color:   string;
  secondary_color: string;
  header_color:    string;
  footer_color:    string;
  text_color:      string;
  hover_color:     string;
}

export interface ColorPalette extends VendorColors {
  id:   number;
  name: string;
}

export interface VendorColorsResponse {
  selected_palette: ColorPalette | null;   // which admin palette vendor chose
  palette_id:       number | null;
  theme_defaults:   VendorColors;          // palette colors + theme fallbacks merged
  custom_colors:    VendorColors | null;   // vendor's manual 6 colors (null if not active)
  merged:           VendorColors;          // what to actually apply on the site
  has_custom:       boolean;              // true = custom is active
}

// ─── GET all admin palettes (for the picker grid) ───────────────────────────
export const useVendorPalettes = () =>
  useQuery({
    queryKey: ['vendor-color-palettes'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/color-palettes');
      return res.data.data as ColorPalette[];
    },
    staleTime: 5 * 60 * 1000,
  });

// ─── GET current color state ─────────────────────────────────────────────────
export const useVendorColors = () =>
  useQuery({
    queryKey: ['vendor-colors'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/subscription/colors');
      return res.data.data as VendorColorsResponse;
    },
    staleTime: 5 * 60 * 1000,
  });

// ─── PUT select an admin palette ─────────────────────────────────────────────
export const useSelectVendorPalette = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (palette_id: number) =>
      apiClient.put('/vendors/subscription/palette', { palette_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-colors'] });
      toast.success('Color palette applied!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to apply palette');
    },
  });
};

// ─── PUT save vendor's custom 6 colors ───────────────────────────────────────
export const useSaveVendorColors = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<VendorColors>) =>
      apiClient.put('/vendors/subscription/colors', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-colors'] });
      if (onSuccess) onSuccess();
      toast.success('Custom colors saved!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save colors');
    },
  });
};

// ─── PUT reset custom → go back to palette ───────────────────────────────────
export const useResetVendorColors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.put('/vendors/subscription/colors/reset'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-colors'] });
      toast.success('Reset to palette colors');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset');
    },
  });
};
