import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type ChatActorType = 'admin' | 'vendor' | 'client';

export interface ChatContact {
  id: number;
  type: ChatActorType;
  name: string;
  email?: string | null;
  avatar?: string | null;
  vendor_id?: number | null;
}

export interface ChatParticipant {
  id: number;
  conversation_id: number;
  actor_type: ChatActorType;
  actor_id: number;
  display_name: string | null;
  avatar: string | null;
}

export interface ChatAttachment {
  url?: string | null;
  data_url?: string;
  name: string;
  type: string;
  size: number;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_type: ChatActorType;
  sender_id: number;
  message: string;
  message_type: 'text' | 'system';
  metadata?: { attachment?: ChatAttachment | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatConversation {
  id: number;
  title: string;
  conversation_type: 'direct' | 'group';
  vendor_id: number | null;
  last_message_at: string | null;
  unread_count: number;
  other_participant?: ChatParticipant | null;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage | null;
}

export interface ChatContacts {
  admins: ChatContact[];
  vendors: ChatContact[];
  clients: ChatContact[];
}

export const chatKeys = {
  contacts: ['chat', 'contacts'] as const,
  conversations: ['chat', 'conversations'] as const,
  messages: (id: number | null) => ['chat', 'messages', id] as const,
};

export const useChatContacts = () =>
  useQuery({
    queryKey: chatKeys.contacts,
    queryFn: async () => (await apiClient.get('/chat/contacts')).data.data as ChatContacts,
  });

export const useChatConversations = () =>
  useQuery({
    queryKey: chatKeys.conversations,
    queryFn: async () => (await apiClient.get('/chat/conversations')).data.data.rows as ChatConversation[],
  });

export const useChatMessages = (conversationId: number | null) =>
  useQuery({
    queryKey: chatKeys.messages(conversationId),
    enabled: !!conversationId,
    queryFn: async () =>
      (await apiClient.get(`/chat/conversations/${conversationId}/messages`)).data.data.rows as ChatMessage[],
  });

export const useStartDirectChat = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (target: { type: ChatActorType; id: number }) =>
      (await apiClient.post('/chat/conversations/direct', target)).data.data as ChatConversation,
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKeys.conversations }),
  });
};

export const useSendChatMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { conversation_id: number; message: string; attachment?: ChatAttachment | null }) =>
      (await apiClient.post('/chat/messages', payload)).data.data as ChatMessage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatKeys.conversations });
      // messages are added via socket chat:message event — no refetch needed
    },
  });
};

export const useMarkChatRead = () => {
  return useMutation({
    mutationFn: async (payload: { conversation_id: number; message_id?: number }) =>
      (await apiClient.patch(`/chat/conversations/${payload.conversation_id}/read`, { message_id: payload.message_id })).data.data,
  });
};
