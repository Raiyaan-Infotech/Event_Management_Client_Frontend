"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import {
  Bold,
  Italic,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Underline,
  UserPlus,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  chatKeys,
  type ChatActorType,
  type ChatContact,
  type ChatConversation,
  type ChatMessage,
  useChatContacts,
  useChatConversations,
  useChatMessages,
  useMarkChatRead,
  useSendChatMessage,
  useStartDirectChat,
} from "@/hooks/use-chat";

interface ChatWorkspaceProps {
  portalType: ChatActorType;
  title?: string;
  subtitle?: string;
}

const cardClass = "bg-card rounded-[5px] border border-border shadow-sm dark:shadow-none";

const socketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
  return api.replace(/\/api(\/v\d+)?\/?$/, "").replace(/\/$/, "") || "http://localhost:5001";
};

const initials = (name?: string | null) =>
  (name || "Chat").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const flattenContacts = (data?: ReturnType<typeof useChatContacts>["data"]) => [
  ...(data?.vendors ?? []),
  ...(data?.admins ?? []),
  ...(data?.clients ?? []),
];

export function ChatWorkspace({
  portalType,
  title = "Chat",
  subtitle = "Real-time conversations",
}: ChatWorkspaceProps) {
  const qc = useQueryClient();
  const { data: contactsData } = useChatContacts();
  const { data: conversations = [], isLoading: conversationsLoading } = useChatConversations();
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState<"recent" | "contacts">("recent");
  const [search, setSearch] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [connected, setConnected] = React.useState(false);
  const [onlineActors, setOnlineActors] = React.useState<Set<string>>(new Set());
  const socketRef = React.useRef<Socket | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const lastReadRef = React.useRef<string>("");
  const sendMessage = useSendChatMessage();
  const startDirect = useStartDirectChat();
  const markRead = useMarkChatRead();
  const { data: messages = [] } = useChatMessages(selectedId);

  const contacts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return flattenContacts(contactsData).filter((contact) =>
      !q || contact.name?.toLowerCase().includes(q) || contact.email?.toLowerCase().includes(q),
    );
  }, [contactsData, search]);

  const selected = conversations.find((item) => item.id === selectedId) ?? null;
  const selectedName = selected?.title || "Chat";
  const selectedActorKey = selected?.other_participant
    ? `${selected.other_participant.actor_type}:${selected.other_participant.actor_id}`
    : "";
  const selectedOnline = selectedActorKey ? onlineActors.has(selectedActorKey) : false;
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  React.useEffect(() => {
    if (!selectedId && conversations.length > 0) setSelectedId(conversations[0].id);
  }, [conversations, selectedId]);

  React.useEffect(() => {
    const socket = io(socketUrl(), {
      withCredentials: true,
      auth: { portalType },
      transports: ["polling", "websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("chat:presence:list", (items: { actor_type: ChatActorType; actor_id: number; online: boolean }[]) => {
      setOnlineActors(new Set(items.filter((item) => item.online).map((item) => `${item.actor_type}:${item.actor_id}`)));
    });
    socket.on("chat:presence", (item: { actor_type: ChatActorType; actor_id: number; online: boolean }) => {
      setOnlineActors((prev) => {
        const next = new Set(prev);
        const key = `${item.actor_type}:${item.actor_id}`;
        if (item.online) next.add(key);
        else next.delete(key);
        return next;
      });
    });
    socket.on("chat:message", (incoming: ChatMessage) => {
      qc.setQueryData<ChatMessage[]>(chatKeys.messages(incoming.conversation_id), (old = []) => {
        if (old.some((item) => item.id === incoming.id)) return old;
        return [...old, incoming];
      });
      qc.invalidateQueries({ queryKey: chatKeys.conversations });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [portalType, qc]);

  React.useEffect(() => {
    if (!selectedId || !socketRef.current) return;
    socketRef.current.emit("chat:join", { conversationId: selectedId });
  }, [selectedId]);

  const lastMessage = messages[messages.length - 1] ?? null;
  const lastMessageId = lastMessage?.id ?? null;
  const selectedUnreadCount = selected?.unread_count ?? 0;

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });

    if (!selectedId || !lastMessageId || !lastMessage) return;
    if (selectedUnreadCount <= 0) return;
    if (lastMessage.sender_type === portalType) return;

    const readKey = `${selectedId}:${lastMessageId}`;
    if (lastReadRef.current === readKey) return;
    lastReadRef.current = readKey;

    qc.setQueryData<ChatConversation[]>(chatKeys.conversations, (old = []) =>
      old.map((conversation) =>
        conversation.id === selectedId ? { ...conversation, unread_count: 0 } : conversation,
      ),
    );
    markRead.mutate({ conversation_id: selectedId, message_id: lastMessageId });
  }, [lastMessage, lastMessageId, selectedId, selectedUnreadCount, portalType, qc, markRead]);

  const openContact = async (contact: ChatContact) => {
    const conversation = await startDirect.mutateAsync({ type: contact.type, id: contact.id });
    setActiveTab("recent");
    setSelectedId(conversation.id);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = message.trim();
    if (!selectedId || !text) return;
    setMessage("");
    await sendMessage.mutateAsync({ conversation_id: selectedId, message: text });
  };

  const formatTime = (value?: string | null) => {
    if (!value) return "";
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
      <div className="space-y-6 max-w-[1700px] mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`h-9 px-3 rounded-sm border flex items-center gap-2 text-xs font-bold ${connected ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-muted-foreground bg-muted/40"}`}>
            {connected ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
            {connected ? "Live" : "Connecting"}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-[30px] items-stretch flex-1 min-h-0">
          <aside className={`w-full lg:w-[400px] xl:w-[420px] shrink-0 flex flex-col ${cardClass} overflow-hidden min-h-0`}>
            <div className="flex px-4 pt-2 border-b border-border shrink-0">
              <button onClick={() => setActiveTab("recent")} className={`px-5 py-3 text-[14px] font-bold transition-all duration-200 ${activeTab === "recent" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                Recent Chat
              </button>
              <button onClick={() => setActiveTab("contacts")} className={`px-5 py-3 text-[14px] font-bold transition-all duration-200 ${activeTab === "contacts" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                Contacts
              </button>
            </div>

            {activeTab === "contacts" && (
              <div className="px-4 py-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full h-9 rounded-sm bg-muted/50 border-0 pl-9 pr-3 text-[13px] outline-none focus:ring-1 focus:ring-primary/20" />
                </div>
              </div>
            )}

            {activeTab === "recent" && (
              <div className="px-6 py-3 border-b border-border shrink-0">
                <span className="text-foreground font-medium text-[14px]">Calls</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0">
              {activeTab === "recent" ? (
                conversationsLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No recent chats available.</div>
                ) : conversations.map((conversation: ChatConversation) => {
                  const active = conversation.id === selectedId;
                  const unread = conversation.unread_count > 0;
                  return (
                    <div key={conversation.id} onClick={() => setSelectedId(conversation.id)} className={`flex gap-3 p-[18px] border-b border-border transition-all duration-200 relative group/item cursor-pointer ${active ? "bg-primary/5" : unread ? "bg-primary/[0.03]" : "hover:bg-muted"}`}>
                      {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}
                      <div className="relative shrink-0">
                        <div className="w-[40px] h-[40px] rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black">{initials(conversation.title)}</div>
                        {conversation.other_participant && (
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                            onlineActors.has(`${conversation.other_participant.actor_type}:${conversation.other_participant.actor_id}`)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`} />
                        )}
                        {unread && <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">{conversation.unread_count}</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h6 className={`text-foreground text-[14px] truncate ${unread ? "font-black" : "font-bold"}`}>{conversation.title}{unread && <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2 animate-pulse" />}</h6>
                          <div className="flex flex-col items-end shrink-0 ml-2">
                            <span className="text-[12px] text-muted-foreground">{formatTime(conversation.last_message_at)}</span>
                            <button className="h-6 w-6 mt-1 text-muted-foreground hover:text-primary flex items-center justify-center" aria-label="Chat actions"><MoreVertical className="h-4 w-4" /></button>
                          </div>
                        </div>
                        <p className="text-[13px] text-muted-foreground leading-tight line-clamp-2">{conversation.lastMessage?.message || "No messages yet"}</p>
                      </div>
                    </div>
                  );
                })
              ) : contacts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-[13px]">No contacts found.</div>
              ) : contacts.map((contact) => (
                <div key={`${contact.type}-${contact.id}`} onClick={() => openContact(contact)} className="flex items-center gap-3 p-4 border-b border-border hover:bg-muted cursor-pointer transition-colors">
                  <div className="relative shrink-0">
                    <div className="w-[40px] h-[40px] rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black">{initials(contact.name)}</div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                      onlineActors.has(`${contact.type}:${contact.id}`) ? "bg-green-500" : "bg-red-500"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6 className="text-foreground text-[14px] font-bold truncate">{contact.name}</h6>
                    <span className="text-[12px] text-muted-foreground capitalize">{contact.type}</span>
                  </div>
                  <button className="text-primary text-[11px] font-bold hover:bg-primary/10 rounded-sm px-2 py-1" onClick={(e) => { e.stopPropagation(); openContact(contact); }}>CHAT</button>
                </div>
              ))}
            </div>
          </aside>

          <main className={`flex-1 flex flex-col ${cardClass} overflow-hidden min-w-0 min-h-0`}>
            {selected ? (
              <>
                <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black">{initials(selectedName)}</div>
                    <div>
                      <h5 className="text-foreground text-[15px] font-bold leading-tight">{selectedName}</h5>
                      <span className={`text-[12px] ${selectedOnline ? "text-green-600" : "text-red-500"}`}>
                        {selectedOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                  <button className="hover:text-primary transition-colors text-muted-foreground" aria-label="Conversation details"><UserPlus size={20} /></button>
                </div>

                <div ref={listRef} className="flex-1 bg-card p-6 overflow-y-auto space-y-4 flex flex-col min-h-0">
                  <div className="text-center font-bold text-[11px] text-muted-foreground uppercase tracking-[1px] mb-4">{currentDate}</div>
                  {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No messages yet. Start the conversation!</div>
                  ) : messages.map((item, index) => {
                    const mine = item.sender_type === portalType;
                    const previous = messages[index - 1];
                    const isFirstInGroup = !previous || previous.sender_type !== item.sender_type || previous.sender_id !== item.sender_id;
                    return (
                      <div key={item.id} className={`flex flex-col ${mine ? "items-end" : "items-start"} gap-1 max-w-full group`}>
                        <div className={`flex ${mine ? "justify-end" : "justify-start"} items-center gap-3 w-full`}>
                          {!mine && (isFirstInGroup ? <div className="w-[36px] h-[36px] rounded-full bg-muted text-foreground flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">{initials(selectedName)}</div> : <div className="w-[36px] shrink-0" />)}
                          <div className="flex flex-col gap-2 max-w-[70%]">
                            <div className={`p-[14px_18px] rounded-[5px] text-[13.5px] leading-relaxed whitespace-pre-wrap break-words ${mine ? "bg-primary text-white rounded-tr-none" : "bg-muted text-foreground rounded-tl-none font-medium"}`}>{item.message}</div>
                          </div>
                          {mine && (isFirstInGroup ? <div className="w-[36px] h-[36px] rounded-full bg-primary/10 text-primary flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">ME</div> : <div className="w-[36px] shrink-0" />)}
                        </div>
                        {isFirstInGroup && <span className={`text-muted-foreground text-[11px] ${mine ? "pr-[48px] text-right" : "pl-[48px] text-left"} pt-1 font-medium w-full tracking-wide`}>{formatTime(item.createdAt)}</span>}
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={submit} className="p-4 border-t border-border bg-card shrink-0 flex items-center gap-3">
                  <div className="flex items-center gap-1 mr-1">
                    <button type="button" className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-sm hover:bg-muted" title="Bold"><Bold size={16} /></button>
                    <button type="button" className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-sm hover:bg-muted" title="Italic"><Italic size={16} /></button>
                    <button type="button" className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-sm hover:bg-muted" title="Underline"><Underline size={16} /></button>
                  </div>
                  <input type="text" placeholder="Type your message here..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 bg-transparent text-[14px] text-foreground placeholder-[#a8b1c7] focus:outline-none" />
                  <button type="button" className="text-muted-foreground hover:text-primary transition-colors p-2" aria-label="Attach file"><Paperclip size={18} /></button>
                  <button type="submit" disabled={!message.trim() || sendMessage.isPending} className="text-primary hover:brightness-110 transition-colors p-2 disabled:opacity-50" aria-label="Send message"><Send size={20} className="fill-current -rotate-45 -mt-1 ml-1" /></button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-foreground text-[18px] font-bold mb-1 uppercase tracking-tight">Select a Chat</h3>
                <p className="text-muted-foreground text-[14px] max-w-[280px]">Choose a conversation from the list to start messaging.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
