"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw, ExternalLink, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { designConfig } from "@/lib/design-config";

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
  className,
}: PersistenceActionsProps) => {
  return (
    <div className={cn("space-y-3 w-full", className)}>
      {onPreview && (
        <Button type="button" onClick={onPreview} variant="outline" className={cn("w-full", designConfig.control.actionButton)}>
          <PreviewIcon size={16} /> {previewLabel}
        </Button>
      )}

      <Button type="submit" disabled={isSubmitting} onClick={onSave} className={cn("w-full", designConfig.control.actionButton, "shadow-sm disabled:opacity-50")}>
        <SaveIcon size={16} strokeWidth={2.5} />
        {isSubmitting ? "SAVING..." : saveLabel}
      </Button>

      {onReset && (
        <Button type="button" variant="secondary" onClick={onReset} className={cn("w-full", designConfig.control.actionButton)}>
          <ResetIcon size={16} />
          {resetLabel}
        </Button>
      )}

      <Button type="button" variant="outline" onClick={onCancel} className={cn("w-full border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white", designConfig.control.actionButton)}>
        <CancelIcon size={16} strokeWidth={2.5} /> {cancelLabel}
      </Button>
    </div>
  );
};
