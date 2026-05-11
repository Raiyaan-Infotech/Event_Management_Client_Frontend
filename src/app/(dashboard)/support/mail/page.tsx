"use client";

import { useMemo, useState, useCallback } from "react";
import { Mail, MailOpen, RefreshCw, PenSquare, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { useClientMe } from "@/hooks/use-client-auth";

const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), { ssr: false });

// ─── Types ───────────────────────────────────────────────────────────────────

interface InboxMail {
  id: number;
  sender_type: "admin" | "vendor" | "client";
  sender_id: number;
  subject: string;
  body: string;
  status: "draft" | "sent" | "failed";
  sent_at: string | null;
  created_at: string;
}

interface RecipientRow {
  id: number;
  is_read: number;
  role: "to" | "cc" | "bcc";
}

interface InboxRow extends RecipientRow {
  mail: InboxMail;
  recipientRow?: RecipientRow;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const stripHtml = (v: string) => {
  if (typeof window === "undefined") return v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const doc = new DOMParser().parseFromString(v, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};

const SENDER_LABEL: Record<string, string> = { admin: "Admin", vendor: "Vendor", client: "Client" };
const getRecipient = (row: InboxRow) => row.recipientRow ?? row;

// ─── Hooks ───────────────────────────────────────────────────────────────────

const KEY = ["client-mail"] as const;

const useClientInbox = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await apiClient.get("/mail")).data.data as { total: number; rows: InboxRow[] },
    staleTime: 60_000,
  });

const useMarkMailRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => apiClient.patch(`/mail/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

const useSendToVendor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { vendor_id: number; subject: string; body: string }) =>
      apiClient.post("/mail/send", {
        subject: p.subject,
        body: p.body,
        recipients: [{ id: p.vendor_id, type: "vendor", role: "to" }],
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); },
  });
};

// ─── Compose Panel ───────────────────────────────────────────────────────────

function ComposePanel({ vendorName, vendorId, onClose }: { vendorName: string; vendorId: number; onClose: () => void }) {
  const send = useSendToVendor();
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
    <Card className="rounded-sm mb-5">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div>
          <p className="text-sm font-bold text-foreground">New Message</p>
          <p className="text-xs text-muted-foreground">To: <span className="font-semibold text-foreground">{vendorName}</span></p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
      </div>
      <CardContent className="p-5 space-y-3">
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full px-3 h-10 bg-muted border border-border rounded-sm text-[14px] focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
        />
        <QuillEditor value={body} onChange={handleBody} placeholder="Write your message..." height="200px" />
        {error && <p className="text-destructive text-[13px] font-bold">{error}</p>}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onClose} disabled={send.isPending}>Cancel</Button>
          <Button size="sm" onClick={handleSend} disabled={send.isPending}>
            {send.isPending ? "Sending…" : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupportMailPage() {
  const { data: client } = useClientMe();
  const { data, isLoading, isError, refetch, isFetching } = useClientInbox();
  const markRead = useMarkMailRead();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  const rows = data?.rows ?? [];
  const selectedRow = useMemo(() => rows.find(r => r.mail.id === selectedId) ?? rows[0] ?? null, [rows, selectedId]);

  const handleSelect = (row: InboxRow) => {
    setSelectedId(row.mail.id);
    if (!getRecipient(row).is_read) markRead.mutate(row.mail.id);
  };

  const vendorId   = client?.vendor_id;
  const vendorName = client?.vendor?.company_name ?? "Your Vendor";

  return (
    <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
      <div className="client-page-shell flex w-full flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 space-y-2">
            <Badge variant="outline" className="w-fit rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.16em]">Support</Badge>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                <Mail className="size-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Mail</h1>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">Messages from your vendor appear here.</p>
          </div>

          <div className="flex items-center gap-2">
            {vendorId && (
              <Button variant="default" className="h-9 gap-2" onClick={() => setShowCompose(v => !v)}>
                <PenSquare className="size-4" />
                {showCompose ? "Cancel" : "Compose"}
              </Button>
            )}
            <Button variant="outline" className="h-9 gap-2" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Compose panel */}
        {showCompose && vendorId && (
          <ComposePanel vendorName={vendorName} vendorId={vendorId} onClose={() => setShowCompose(false)} />
        )}

        {/* Mail list */}
        {isLoading ? (
          <div className="grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
            <Skeleton className="h-[520px] rounded-sm" />
            <Skeleton className="h-[520px] rounded-sm" />
          </div>
        ) : isError ? (
          <Card className="rounded-sm">
            <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-center text-sm font-semibold text-muted-foreground">
              Failed to load mail.
            </CardContent>
          </Card>
        ) : rows.length === 0 ? (
          <Card className="rounded-sm">
            <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-center">
              <div className="space-y-2">
                <MailOpen className="mx-auto size-9 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">No mail received yet</p>
                <p className="text-xs text-muted-foreground">When your vendor sends you a message, it will appear here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid min-h-[640px] gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
            <Card className="overflow-hidden rounded-sm">
              <div className="border-b border-border px-4 py-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{data?.total ?? 0} Messages</p>
              </div>
              <div className="max-h-[760px] overflow-y-auto">
                {rows.map(row => {
                  const isActive  = selectedRow?.mail.id === row.mail.id;
                  const isUnread  = !getRecipient(row).is_read;
                  return (
                    <button key={row.mail.id} type="button" onClick={() => handleSelect(row)}
                      className={`block w-full border-b border-border px-4 py-4 text-left transition-colors last:border-b-0 ${isActive ? "bg-primary/5" : "hover:bg-muted/40"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <p className={`min-w-0 truncate text-sm ${isUnread ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                          {row.mail.subject}
                        </p>
                        {isUnread && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-muted-foreground capitalize">
                        From: {SENDER_LABEL[row.mail.sender_type] ?? row.mail.sender_type}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{stripHtml(row.mail.body)}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {new Date(row.mail.sent_at || row.mail.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="rounded-sm">
              <CardContent className="p-6">
                {selectedRow ? (
                  <div className="space-y-5">
                    <div className="border-b border-border pb-4">
                      <h2 className="text-xl font-bold text-foreground">{selectedRow.mail.subject}</h2>
                      <p className="mt-1 text-xs font-semibold text-muted-foreground capitalize">
                        From: {SENDER_LABEL[selectedRow.mail.sender_type] ?? selectedRow.mail.sender_type}
                        {" · "}
                        {new Date(selectedRow.mail.sent_at || selectedRow.mail.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: selectedRow.mail.body }} />
                  </div>
                ) : (
                  <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
                    Select a message to read
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
