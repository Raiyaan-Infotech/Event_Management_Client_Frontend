import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Plus } from "lucide-react";

interface ActionButtonProps extends ButtonProps {
  label: string;
  icon?: LucideIcon;
  variant_type?: "Client" | "Staff" | "Payment" | "Event";
}

export function ActionButton({ label, icon: Icon = Plus, variant_type = "Client", className, ...props }: ActionButtonProps) {
  let styles = "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20";
  
  if (variant_type === "Staff") {
    styles = "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20";
  } else if (variant_type === "Payment" || variant_type === "Event") {
    styles = "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20";
  }

  return (
    <Button 
      className={cn(
        "h-10 text-white text-[12px] font-bold gap-2 transition-all shadow-lg rounded-xl hover:-translate-y-0.5 active:scale-[0.98] uppercase tracking-wider",
        styles,
        className
      )}
      {...props}
    >
      <Icon size={16} strokeWidth={3} /> {label}
    </Button>
  );
}
