"use client";

import { useState, useCallback, useEffect, useRef, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail, Send, Trash2, Star, CheckSquare, RotateCw,
  MailOpen, PenSquare, X, ChevronDown, Inbox,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api-client";
import { useClientMe } from "@/hooks/use-client-auth";

const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface InboxMail {
  id: number;
  sender_type: "admin" | "vendor" | "client";
  subject: string;
  body: string;
  sent_at: string | null;
  created_at: string;
}
interface RecipientRow { id: number; is_read: number; role: string; }
interface InboxRow extends RecipientRow { mail: InboxMail; recipientRow?: RecipientRow; }
interface SentMail { id: number; subject: string; body: string; sent_at: string | null; createdAt: string; }

// ─── Helpers ─────────────────────────────────────────────────────────────────

const stripHtml = (v: string) => {
  if (typeof window === "undefined") return v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const doc = new DOMParser().parseFromString(v, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};
const getRecipient = (row: InboxRow) => row.recipientRow ?? row;
const SENDER_LABEL: Record<string, string> = { admin: "Admin", vendor: "Vendor", client: "Client" };
const fmt = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

// ─── Hooks ────────────────────────────────────────────────────────────────────

const INBOX_KEY = ["client-mail-inbox"] as const;
const SENT_KEY  = ["client-mail-sent"]  as const;

const useClientInbox = () =>
  useQuery({
    queryKey: INBOX_KEY,
    queryFn: async () => (await apiClient.get("/mail")).data.data as { total: number; rows: InboxRow[] },
    staleTime: 30_000,
  });

const useClientSent = () =>
  useQuery({
    queryKey: SENT_KEY,
    queryFn: async () => (await apiClient.get("/mail/sent")).data.data as { count: number; rows: SentMail[] },
    staleTime: 30_000,
  });

const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => apiClient.patch(`/mail/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: INBOX_KEY }),
  });
};

const useDeleteMail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => apiClient.delete(`/mail/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: INBOX_KEY }),
  });
};

const useSendMail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { vendor_id: number; subject: string; body: string }) =>
      apiClient.post("/mail/send", {
        subject: p.subject, body: p.body,
        recipients: [{ id: p.vendor_id, type: "vendor", role: "to" }],
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INBOX_KEY });
      qc.invalidateQueries({ queryKey: SENT_KEY });
    },
  });
};

// ─── Compose Panel ────────────────────────────────────────────────────────────

function ComposePanel({ vendorName, vendorId, onClose }: { vendorName: string; vendorId: number; onClose: () => void }) {
  const send = useSendMail();
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [error, setError]     = useState("");
  const handleBody = useCallback(({ html }: { html: string; delta: unknown }) => setBody(html), []);
  const handleSend = async () => {
    if (!subject.trim()) { setError("Subject is required"); return; }
    if (!body.trim() || body === "<p><br></p>") { setError("Message body is required"); return; }
    setError("");
    await send.mutateAsync({ vendor_id: vendorId, subject, body });
    onClose();
  };
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-end p-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[560px] bg-card border border-border rounded-[5px] shadow-2xl flex flex-col" style={{ maxHeight: "80vh" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30 shrink-0">
          <div>
            <p className="text-[13px] font-bold text-foreground">New Message</p>
            <p className="text-[11px] text-muted-foreground">To: <span className="font-semibold text-foreground">{vendorName}</span></p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3 flex-1 overflow-y-auto">
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject"
            className="w-full px-3 h-10 bg-muted border border-border rounded-[3px] text-[14px] focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors" />
          <QuillEditor value={body} onChange={handleBody} placeholder="Write your message..." height="200px" />
          {error && <p className="text-destructive text-[13px] font-bold">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border shrink-0">
          <button onClick={onClose} disabled={send.isPending}
            className="px-4 h-8 border border-border rounded-[3px] text-[13px] font-bold text-foreground hover:bg-muted transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSend} disabled={send.isPending}
            className="px-4 h-8 bg-primary text-white rounded-[3px] text-[13px] font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {send.isPending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Mail Sidebar ─────────────────────────────────────────────────────────────

type Folder = "inbox" | "sent" | "all";

function MailSidebar({ folder, onFolder, inboxCount, sentCount, totalCount, onCompose }:
  { folder: Folder; onFolder: (f: Folder) => void; inboxCount: number; sentCount: number; totalCount: number; onCompose: () => void }) {
  const btn = (f: Folder, label: string, Icon: React.ElementType, count?: number) => (
    <button onClick={() => onFolder(f)} className={`w-full flex items-center gap-3 px-4 h-[36px] rounded-[3px] text-[13px] font-semibold transition-all ${folder === f ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
      <Icon size={15} className="shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${folder === f ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>{count}</span>
      )}
    </button>
  );
  return (
    <div className="w-[220px] shrink-0 flex flex-col gap-2">
      <button onClick={onCompose}
        className="w-full h-10 bg-primary text-white rounded-[3px] text-[13px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
        <PenSquare size={14} /> Compose
      </button>
      <div className="bg-card rounded-[5px] border border-border shadow-sm overflow-hidden py-2 space-y-0.5 px-2">
        {btn("inbox", "Inbox", Inbox, inboxCount)}
        {btn("sent",  "Send Mail", Send, sentCount)}
        {btn("all",   "All Mails", Mail, totalCount)}
      </div>
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

const cardClass = "bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none";

function SupportMailContent() {
  const searchParams  = useSearchParams();
  const mailIdParam   = searchParams.get("mailId");

  const { data: client } = useClientMe();
  const { data: inboxData, isLoading: inboxLoading, refetch: refetchInbox, isFetching: inboxFetching } = useClientInbox();
  const { data: sentData,  isLoading: sentLoading,  refetch: refetchSent,  isFetching: sentFetching  } = useClientSent();
  const markRead  = useMarkRead();
  const deleteMail = useDeleteMail();

  const [folder, setFolder]           = useState<Folder>(mailIdParam ? "inbox" : "inbox");
  const [selectedInboxId, setSelectedInboxId] = useState<number | null>(mailIdParam ? Number(mailIdParam) : null);
  const [selectedSentId,  setSelectedSentId]  = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [starredIds,  setStarredIds]  = useState<Set<number>>(new Set());
  const [showCompose, setShowCompose] = useState(false);
  const autoOpenRef = useRef(false);

  const inboxRows = inboxData?.rows ?? [];
  const sentRows  = sentData?.rows  ?? [];

  // Auto-open specific mail from ?mailId= param
  useEffect(() => {
    if (!mailIdParam || autoOpenRef.current || inboxRows.length === 0) return;
    const id  = Number(mailIdParam);
    const row = inboxRows.find(r => r.mail.id === id);
    if (row) {
      autoOpenRef.current = true;
      setSelectedInboxId(id);
      if (!getRecipient(row).is_read) markRead.mutate(id);
    }
  }, [inboxRows, mailIdParam]);

  const selectedInboxRow = useMemo(() =>
    inboxRows.find(r => r.mail.id === selectedInboxId) ?? null,
    [inboxRows, selectedInboxId]);

  const selectedSentMail = useMemo(() =>
    sentRows.find(m => m.id === selectedSentId) ?? null,
    [sentRows, selectedSentId]);

  // Derived counts
  const unreadCount = inboxRows.filter(r => !getRecipient(r).is_read).length;
  const totalCount  = inboxRows.length + sentRows.length;

  const handleSelectInbox = (row: InboxRow) => {
    setSelectedInboxId(row.mail.id);
    // Clear sent selection so the detail panel in "all" mode shows the inbox item.
    setSelectedSentId(null);
    if (!getRecipient(row).is_read) markRead.mutate(row.mail.id);
  };

  const handleSelectSent = (mailId: number) => {
    setSelectedSentId(mailId);
    setSelectedInboxId(null);
  };

  const toggleSelect = (id: number) => setSelectedIds(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const toggleStar = (id: number) => setStarredIds(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const currentRows = folder === "sent" ? [] : folder === "all" ? inboxRows : inboxRows;
  const isLoading   = folder === "sent" ? sentLoading : folder === "all" ? (inboxLoading || sentLoading) : inboxLoading;
  const isFetching  = folder === "sent" ? sentFetching : folder === "all" ? (inboxFetching || sentFetching) : inboxFetching;

  const vendorId   = client?.vendor_id;
  const vendorName = client?.vendor?.company_name ?? "Your Vendor";

  // For "All Mails": merge inbox + sent into one chronological list.
  // Each item carries a `kind` so the row renderer knows which side it's on.
  type AllItem =
    | { kind: "inbox"; row: InboxRow; dateValue: number }
    | { kind: "sent"; mail: SentMail; dateValue: number };
  const allRows: AllItem[] = useMemo(() => {
    if (folder !== "all") return [];
    const inbox: AllItem[] = inboxRows.map((row) => ({
      kind: "inbox" as const,
      row,
      dateValue: new Date(row.mail.sent_at || row.mail.created_at).getTime(),
    }));
    const sent: AllItem[] = sentRows.map((mail) => ({
      kind: "sent" as const,
      mail,
      dateValue: new Date(mail.sent_at || mail.createdAt).getTime(),
    }));
    return [...inbox, ...sent].sort((a, b) => b.dateValue - a.dateValue);
  }, [folder, inboxRows, sentRows]);

  return (
    <div className="h-[calc(100vh-86px)] overflow-hidden px-6 pt-4 pb-4 flex flex-col gap-4">
      <h1 className="text-[22px] font-black text-foreground uppercase tracking-tight shrink-0">Mail</h1>

      <div className="flex gap-5 flex-1 min-h-0 relative">
        {/* Sidebar */}
        <MailSidebar
          folder={folder}
          onFolder={(f) => { setFolder(f); setSelectedInboxId(null); setSelectedSentId(null); setSelectedIds(new Set()); }}
          inboxCount={unreadCount}
          sentCount={sentRows.length}
          totalCount={totalCount}
          onCompose={() => setShowCompose(true)}
        />

        {/* Main panel */}
        <div className={`${cardClass} flex-1 flex flex-col overflow-hidden min-w-0`}>
          {/* Folder header */}
          <div className="px-6 py-4 border-b border-border shrink-0">
            <h2 className="text-[18px] font-black text-foreground uppercase tracking-tight">
              {folder === "inbox" ? "Inbox" : folder === "sent" ? "Send Mail" : "All Mails"}
            </h2>
          </div>

          {/* Toolbar */}
          <div className="px-5 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className={`flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${selectedIds.size > 0 ? "bg-primary border-primary" : "bg-transparent border-[#c4c9d7] hover:border-primary"} transition-all`}>
                {selectedIds.size > 0 && <CheckSquare size={12} className="text-white" />}
              </div>
              <span className="text-[13px] text-muted-foreground">Select All</span>
              <input type="checkbox" className="hidden"
                checked={selectedIds.size === currentRows.length && currentRows.length > 0}
                onChange={() => setSelectedIds(selectedIds.size === currentRows.length ? new Set() : new Set(currentRows.map(r => r.mail.id)))}
              />
            </label>
            <div className="flex items-center gap-1">
              <button onClick={() => folder === "sent" ? refetchSent() : refetchInbox()} disabled={isFetching}
                className="w-[34px] h-[34px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all">
                <RotateCw size={14} className={isFetching ? "animate-spin" : ""} />
              </button>
              {folder === "inbox" && (
                <>
                  <button disabled={selectedIds.size === 0}
                    onClick={() => { selectedIds.forEach(id => markRead.mutate(id)); setSelectedIds(new Set()); }}
                    className="w-[34px] h-[34px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all disabled:opacity-40">
                    <MailOpen size={14} />
                  </button>
                  <button disabled={selectedIds.size === 0}
                    onClick={() => { selectedIds.forEach(id => deleteMail.mutate(id)); setSelectedIds(new Set()); }}
                    className="w-[34px] h-[34px] flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted rounded-full transition-all disabled:opacity-40">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mail list + detail */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* List */}
            <div className={`flex flex-col border-r border-border overflow-y-auto transition-all ${(selectedInboxRow || selectedSentMail) ? "w-[42%] shrink-0" : "flex-1"}`}>
              {isLoading ? (
                <div className="p-10 text-center text-sm text-muted-foreground font-bold">Loading…</div>
              ) : folder === "all" ? (
                allRows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-16">
                    <Mail className="w-10 h-10 opacity-20" />
                    <p className="text-sm font-semibold">No mail yet</p>
                  </div>
                ) : allRows.map((item) => {
                  if (item.kind === "inbox") {
                    const row = item.row;
                    const isSelected = selectedIds.has(row.mail.id);
                    const isStarred  = starredIds.has(row.mail.id);
                    const isRead     = getRecipient(row).is_read === 1;
                    const isActive   = selectedInboxId === row.mail.id;
                    return (
                      <div key={`in-${row.mail.id}`}
                        onClick={() => handleSelectInbox(row)}
                        className={`group relative flex items-start gap-3 pt-[18px] pb-[16px] pr-5 border-b border-border transition-all cursor-pointer
                          ${isActive ? "bg-primary/10 border-l-[3px] border-l-primary pl-[17px]"
                            : isRead ? "bg-card hover:bg-muted/20 border-l-[3px] border-l-transparent pl-[17px]"
                            : "bg-muted/10 hover:bg-muted/30 border-l-[3px] border-l-indigo-500 pl-[17px]"}`}>
                        <div className="flex items-center gap-3 shrink-0 mt-0.5">
                          <label className="cursor-pointer" onClick={e => e.stopPropagation()}>
                            <div className={`flex items-center justify-center w-[15px] h-[15px] rounded-[3px] border ${isSelected ? "bg-primary border-primary" : "bg-transparent border-[#c4c9d7] hover:border-primary"} transition-all`}>
                              {isSelected && <CheckSquare size={11} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleSelect(row.mail.id)} />
                          </label>
                          <button onClick={e => { e.stopPropagation(); toggleStar(row.mail.id); }}
                            className={`hover:scale-110 transition-transform ${isStarred ? "text-yellow-500" : "text-muted-foreground"}`}>
                            <Star size={14} className={isStarred ? "fill-current" : ""} />
                          </button>
                        </div>
                        <div className="relative shrink-0">
                          <Avatar className="w-[30px] h-[30px]">
                            <AvatarFallback className="bg-primary text-white font-bold text-[11px] rounded-full">
                              {SENDER_LABEL[row.mail.sender_type]?.[0] ?? "S"}
                            </AvatarFallback>
                          </Avatar>
                          {!isRead && <span className="absolute -top-0.5 -right-0.5 w-[8px] h-[8px] bg-indigo-500 rounded-full border-2 border-background" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-0.5">
                            <p className={`text-[13px] truncate group-hover:text-primary transition-colors ${isRead ? "font-semibold text-muted-foreground" : "font-black text-foreground"}`}>
                              From: {SENDER_LABEL[row.mail.sender_type] ?? row.mail.sender_type}
                            </p>
                            <span className={`text-[11px] whitespace-nowrap ml-3 ${isRead ? "text-muted-foreground" : "text-foreground font-semibold"}`}>{fmt(row.mail.sent_at || row.mail.created_at)}</span>
                          </div>
                          <p className={`text-[13px] truncate ${isRead ? "font-medium text-foreground/70" : "font-bold text-foreground"}`}>{row.mail.subject}</p>
                          <p className="text-[12px] text-muted-foreground truncate mt-0.5">{stripHtml(row.mail.body)}</p>
                        </div>
                      </div>
                    );
                  }
                  // sent row in merged view
                  const mail = item.mail;
                  const isActive = selectedSentId === mail.id;
                  return (
                    <div key={`out-${mail.id}`} onClick={() => handleSelectSent(mail.id)}
                      className={`group flex items-start gap-3 pt-[18px] pb-[16px] px-5 border-b border-border transition-all cursor-pointer border-l-[3px] border-l-transparent ${isActive ? "bg-primary/10 !border-l-primary" : "bg-card hover:bg-muted/20"}`}>
                      <Avatar className="w-[30px] h-[30px] shrink-0 mt-0.5">
                        <AvatarFallback className="bg-emerald-500 text-white font-bold text-[11px] rounded-full">S</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-0.5">
                          <p className="text-[13px] font-semibold text-muted-foreground truncate group-hover:text-primary transition-colors">To: {vendorName}</p>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-3">{fmt(mail.sent_at || mail.createdAt)}</span>
                        </div>
                        <p className="text-[13px] font-bold text-foreground truncate">{mail.subject}</p>
                        <p className="text-[12px] text-muted-foreground truncate mt-0.5">{stripHtml(mail.body)}</p>
                      </div>
                    </div>
                  );
                })
              ) : folder === "inbox" ? (
                inboxRows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-16">
                    <MailOpen className="w-10 h-10 opacity-20" />
                    <p className="text-sm font-semibold">No mail received yet</p>
                  </div>
                ) : inboxRows.map(row => {
                  const isSelected = selectedIds.has(row.mail.id);
                  const isStarred  = starredIds.has(row.mail.id);
                  const isRead     = getRecipient(row).is_read === 1;
                  const isActive   = selectedInboxId === row.mail.id;
                  return (
                    <div key={row.mail.id}
                      onClick={() => handleSelectInbox(row)}
                      className={`group relative flex items-start gap-3 pt-[18px] pb-[16px] pr-5 border-b border-border transition-all cursor-pointer
                        ${isActive ? "bg-primary/10 border-l-[3px] border-l-primary pl-[17px]"
                          : isRead ? "bg-card hover:bg-muted/20 border-l-[3px] border-l-transparent pl-[17px]"
                          : "bg-muted/10 hover:bg-muted/30 border-l-[3px] border-l-indigo-500 pl-[17px]"}`}>
                      <div className="flex items-center gap-3 shrink-0 mt-0.5">
                        <label className="cursor-pointer" onClick={e => e.stopPropagation()}>
                          <div className={`flex items-center justify-center w-[15px] h-[15px] rounded-[3px] border ${isSelected ? "bg-primary border-primary" : "bg-transparent border-[#c4c9d7] hover:border-primary"} transition-all`}>
                            {isSelected && <CheckSquare size={11} className="text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleSelect(row.mail.id)} />
                        </label>
                        <button onClick={e => { e.stopPropagation(); toggleStar(row.mail.id); }}
                          className={`hover:scale-110 transition-transform ${isStarred ? "text-yellow-500" : "text-muted-foreground"}`}>
                          <Star size={14} className={isStarred ? "fill-current" : ""} />
                        </button>
                      </div>
                      <div className="relative shrink-0">
                        <Avatar className="w-[30px] h-[30px]">
                          <AvatarFallback className="bg-primary text-white font-bold text-[11px] rounded-full">
                            {SENDER_LABEL[row.mail.sender_type]?.[0] ?? "S"}
                          </AvatarFallback>
                        </Avatar>
                        {!isRead && <span className="absolute -top-0.5 -right-0.5 w-[8px] h-[8px] bg-indigo-500 rounded-full border-2 border-background" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-0.5">
                          <p className={`text-[13px] truncate group-hover:text-primary transition-colors ${isRead ? "font-semibold text-muted-foreground" : "font-black text-foreground"}`}>
                            From: {SENDER_LABEL[row.mail.sender_type] ?? row.mail.sender_type}
                          </p>
                          <span className={`text-[11px] whitespace-nowrap ml-3 ${isRead ? "text-muted-foreground" : "text-foreground font-semibold"}`}>{fmt(row.mail.sent_at || row.mail.created_at)}</span>
                        </div>
                        <p className={`text-[13px] truncate ${isRead ? "font-medium text-foreground/70" : "font-bold text-foreground"}`}>{row.mail.subject}</p>
                        <p className="text-[12px] text-muted-foreground truncate mt-0.5">{stripHtml(row.mail.body)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Sent tab
                sentRows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-16">
                    <Send className="w-10 h-10 opacity-20" />
                    <p className="text-sm font-semibold">No sent mail yet</p>
                  </div>
                ) : sentRows.map(mail => {
                  const isActive = selectedSentId === mail.id;
                  return (
                    <div key={mail.id} onClick={() => handleSelectSent(mail.id)}
                      className={`group flex items-start gap-3 pt-[18px] pb-[16px] px-5 border-b border-border transition-all cursor-pointer border-l-[3px] border-l-transparent ${isActive ? "bg-primary/10 !border-l-primary" : "bg-card hover:bg-muted/20"}`}>
                      <Avatar className="w-[30px] h-[30px] shrink-0 mt-0.5">
                        <AvatarFallback className="bg-emerald-500 text-white font-bold text-[11px] rounded-full">S</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-0.5">
                          <p className="text-[13px] font-semibold text-muted-foreground truncate group-hover:text-primary transition-colors">To: {vendorName}</p>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-3">{fmt(mail.sent_at || mail.createdAt)}</span>
                        </div>
                        <p className="text-[13px] font-bold text-foreground truncate">{mail.subject}</p>
                        <p className="text-[12px] text-muted-foreground truncate mt-0.5">{stripHtml(mail.body)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Detail panel — drives off whichever selection is active.
                Works across inbox / sent / all because handleSelectInbox and
                handleSelectSent are mutually exclusive. */}
            {(selectedInboxRow || selectedSentMail) && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-border flex items-start justify-between gap-4 shrink-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      {selectedInboxRow
                        ? `From: ${SENDER_LABEL[selectedInboxRow.mail.sender_type] ?? selectedInboxRow.mail.sender_type}`
                        : `To: ${vendorName}`}
                    </p>
                    <h3 className="text-[16px] font-black text-foreground leading-snug break-words">
                      {selectedInboxRow ? selectedInboxRow.mail.subject : selectedSentMail?.subject}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {selectedInboxRow
                        ? fmt(selectedInboxRow.mail.sent_at || selectedInboxRow.mail.created_at)
                        : fmt(selectedSentMail?.sent_at || selectedSentMail?.createdAt)}
                    </p>
                  </div>
                  <button onClick={() => { setSelectedInboxId(null); setSelectedSentId(null); }}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0">
                    <X size={15} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-[14px] text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedInboxRow ? selectedInboxRow.mail.body : (selectedSentMail?.body ?? "") }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compose overlay */}
        {showCompose && vendorId && (
          <ComposePanel vendorName={vendorName} vendorId={vendorId} onClose={() => setShowCompose(false)} />
        )}
      </div>
    </div>
  );
}

export default function SupportMailPage() {
  return (
    <Suspense>
      <SupportMailContent />
    </Suspense>
  );
}
