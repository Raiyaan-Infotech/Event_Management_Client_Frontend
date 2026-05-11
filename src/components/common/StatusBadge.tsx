import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  
  let styles = "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20";
  let icon = <CheckCircle2 size={12} className="mr-1.5" />;

  if (normalizedStatus === "inactive" || normalizedStatus === "offline") {
    styles = "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20";
    icon = <Clock size={12} className="mr-1.5" />;
  } else if (normalizedStatus === "blocked" || normalizedStatus === "failed" || normalizedStatus === "unpaid") {
    styles = "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20";
    icon = <XCircle size={12} className="mr-1.5" />;
  } else if (normalizedStatus === "pending") {
    styles = "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20";
    icon = <AlertCircle size={12} className="mr-1.5" />;
  }

  return (
    <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border transition-all", styles, className)}>
      {icon}
      {status}
    </div>
  );
}
