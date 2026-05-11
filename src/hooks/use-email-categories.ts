import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface EmailCategory {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: number;
}

export interface EmailTemplate {
  id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  is_active: number;
}

export const useEmailCategories = () =>
  useQuery({
    queryKey: ['email-categories'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/email-categories?limit=100&sort_by=sort_order&sort_order=ASC');
      return res.data.data as EmailCategory[];
    },
    staleTime: 30000,
  });

export const useEmailTemplatesByCategory = (categoryId: number | null) =>
  useQuery({
    queryKey: ['email-templates', categoryId],
    queryFn: async () => {
      const url = categoryId
        ? `/vendors/email-templates?category_id=${categoryId}&limit=100`
        : `/vendors/email-templates?limit=100`;
      const res = await apiClient.get(url);
      return res.data.data as EmailTemplate[];
    },
    enabled: categoryId !== null,
    staleTime: 30000,
  });
