"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionFooterProps {
  onSave?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saveIcon?: LucideIcon;
  cancelIcon?: LucideIcon;
  isSubmitting?: boolean;
  className?: string;
}

export const ActionFooter = ({
  onSave,
  onCancel,
  saveLabel = "SAVE RECORD",
  cancelLabel = "CANCEL PROCESS",
  saveIcon: SaveIcon = Check,
  cancelIcon: CancelIcon = X,
  isSubmitting = false,
  className
}: ActionFooterProps) => {
  return (
    <div className={cn("space-y-4 pt-4 w-full", className)}>
      <Button 
        type="submit"
        disabled={isSubmitting}
        onClick={onSave}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[13px] font-bold gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-xl hover:-translate-y-0.5 hover:shadow-blue-500/40 active:scale-[0.98] flex items-center justify-center uppercase tracking-widest disabled:opacity-50"
      >
        <SaveIcon size={18} strokeWidth={2.5} /> 
        {isSubmitting ? "Processing..." : saveLabel}
      </Button>

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
