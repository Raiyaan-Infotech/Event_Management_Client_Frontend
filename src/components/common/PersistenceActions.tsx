"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw, ExternalLink, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersistenceActionsProps {
  onSave?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  onReset?: () => void;
  onPreview?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  previewLabel?: string;
  saveIcon?: LucideIcon;
  cancelIcon?: LucideIcon;
  resetIcon?: LucideIcon;
  previewIcon?: LucideIcon;
  isSubmitting?: boolean;
  className?: string;
}

export const PersistenceActions = ({
  onSave,
  onCancel,
  onReset,
  onPreview,
  saveLabel = "SAVE",
  cancelLabel = "CANCEL",
  resetLabel = "RESET",
  previewLabel = "PREVIEW",
  saveIcon: SaveIcon = Check,
  cancelIcon: CancelIcon = X,
  resetIcon: ResetIcon = RotateCcw,
  previewIcon: PreviewIcon = ExternalLink,
  isSubmitting = false,
  className
}: PersistenceActionsProps) => {
  return (
    <div className={cn("space-y-3 w-full", className)}>
      <Button 
        type="button"
        onClick={onPreview}
        variant="outline"
        className="w-full h-12 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-bold text-[13px] tracking-[0.1em] uppercase rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 shadow-sm"
      >
        <PreviewIcon size={16} /> {previewLabel}
      </Button>

      <Button 
        type="submit"
        disabled={isSubmitting}
        onClick={onSave}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[13px] font-bold gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-xl hover:-translate-y-0.5 hover:shadow-blue-500/40 active:scale-[0.98] flex items-center justify-center uppercase tracking-widest disabled:opacity-50 border-none"
      >
        <SaveIcon size={18} strokeWidth={2.5} /> 
        {isSubmitting ? "SAVING..." : saveLabel}
      </Button>

      {onReset && (
        <Button 
          type="button"
          variant="outline"
          onClick={onReset}
          className="w-full h-12 font-bold text-[12px] tracking-wide uppercase rounded-xl border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 bg-gray-50/50"
        >
          <ResetIcon size={16} className="mr-2" />
          {resetLabel}
        </Button>
      )}

      <Button 
        type="button"
        onClick={onCancel}
        className="w-full h-12 bg-white hover:bg-rose-600 border-2 border-red-500 text-red-500 hover:text-white transition-all duration-300 rounded-xl text-[13px] font-bold gap-2 shadow-sm hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center"
      >
        <CancelIcon size={18} strokeWidth={2.5} /> {cancelLabel}
      </Button>
    </div>
  );
};
