import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface MailNotification {
  id: number;
  mail_id: number;
  is_read: number;
  created_at: string;
  mail?: { id: number; subject: string; sender_type: string; sent_at: string | null };
}

const NOTIF_KEY = ['client-mail-notifications'] as const;

export const useClientMailNotifications = () =>
  useQuery({
    queryKey: NOTIF_KEY,
    queryFn: async () =>
      (await apiClient.get('/mail/notifications')).data.data as {
        unread_count: number;
        notifications: MailNotification[];
      },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

export const useMarkClientNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => apiClient.patch('/mail/notifications/read'),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIF_KEY }),
  });
};
