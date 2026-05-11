import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { BlockCatalogEntry } from '@/types/home-blocks';

export function useUiBlocks() {
  return useQuery({
    queryKey: ['ui-blocks'],
    queryFn: async (): Promise<BlockCatalogEntry[]> => {
      const { data } = await apiClient.get('/vendors/ui-blocks');
      // Map variants array of strings to objects with id and label
      return data.data.map((block: any) => ({
        ...block,
        variants: Array.isArray(block.variants) 
          ? block.variants.map((variantStr: string, index: number) => ({
              id: `variant_${index + 1}`,
              label: variantStr
            }))
          : []
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
