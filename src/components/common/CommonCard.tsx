"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CommonCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  children: React.ReactNode;
  className?: string;
  isView?: boolean;
}

export const CommonCard = ({
  title,
  subtitle,
  icon: Icon,
  iconColorClass = "text-blue-600",
  iconBgClass = "bg-blue-50 dark:bg-blue-500/10",
  children,
  className,
  isView = false
}: CommonCardProps) => {
  return (
    <div className={cn(
      "bg-white dark:bg-[#1f2937]",
      isView ? "border-none shadow-none p-0" : "rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]",
      className
    )}>
      {title && (
        <div className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-800/50 pb-4 mb-6">
          {Icon && (
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBgClass, iconColorClass)}>
              <Icon size={20} />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest">{title}</h3>
            {subtitle && <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
