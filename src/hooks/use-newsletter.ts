import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface NewsletterClient {
  id: number;
  name: string;
  email: string;
  plan: string | null;
  client_type: 'subscribed' | 'unsubscribed';
  registration_type: 'guest' | 'client';
  is_active: number;
  [key: string]: unknown;
}

export const getPlanLabel = (plan: string | null, registrationType: string): string => {
  if (registrationType === 'guest') return 'Guest';
  if (!plan) return '—';
  return plan;
};

export const useBulkUpdateByIds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, client_type }: { ids: number[]; client_type: 'subscribed' | 'unsubscribed' }) => {
      const res = await apiClient.patch('/vendors/newsletter/bulk-ids', { ids, client_type });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-unsubscribers'] });
    },
  });
};

export const useToggleClientType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.patch(`/vendors/newsletter/${id}/client-type`);
      return res.data.data as NewsletterClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-unsubscribers'] });
    },
  });
};

export const useBulkUpdateClientType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ from, to }: { from: 'subscribed' | 'unsubscribed'; to: 'subscribed' | 'unsubscribed' }) => {
      const res = await apiClient.patch('/vendors/newsletter/bulk', { from, to });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-unsubscribers'] });
    },
  });
};

export const useNewsletterSubscribers = () =>
  useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/newsletter/subscribers');
      return res.data.data as NewsletterClient[];
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useNewsletterUnsubscribers = () =>
  useQuery({
    queryKey: ['newsletter-unsubscribers'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/newsletter/unsubscribers');
      return res.data.data as NewsletterClient[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export interface MailStatus {
  id: number;
  name: string;
  email: string;
  membership: string;
  template: string;
  status: 'Success' | 'Failed';
  readStatus: 'Read' | 'Unread';
  subscriptionStatus: 'Subscribed' | 'Unsubscribed';
  date?: string;
}

export const useNewsletterSentLogs = (newsletterId?: number | null) =>
  useQuery({
    queryKey: ['newsletter-sent-logs', newsletterId],
    queryFn: async () => {
      const url = newsletterId
        ? `/vendors/newsletter/sent-logs?newsletter_id=${newsletterId}`
        : '/vendors/newsletter/sent-logs';
      const res = await apiClient.get(url);
      return (res.data.data || []).map((log: any) => ({
        id: log.id,
        name: log.name,
        email: log.email,
        membership: log.membership,
        template: log.template,
        status: log.status === 'sent' ? 'Success' : 'Failed',
        readStatus: log.opened_at ? 'Read' : 'Unread',
        subscriptionStatus: log.client_type === 'unsubscribed' ? 'Unsubscribed' : 'Subscribed',
        date: log.created_at || log.sent_at || log.updated_at,
      })) as MailStatus[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export interface NewsletterSend {
  id: number;
  template_id: number | null;
  template_name: string;
  user_type: 'Guest' | 'Registered';
  plans: string[] | null;
  total_sent: number;
  success_count: number;
  failed_count: number;
  read_count: number;
  unread_count: number;
  createdAt: string;
}

export const useNewsletterSends = () =>
  useQuery({
    queryKey: ['newsletter-sends'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/newsletter/sends');
      return res.data.data as NewsletterSend[];
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useSendNewsletter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { userType: string; plans: string[]; categoryId: number; templateId: number; sendTo: 'subscribers' | 'unsubscribers' }) => {
      const res = await apiClient.post('/vendors/newsletter/send', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-sends'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-sent-logs'] });
    },
  });
};
