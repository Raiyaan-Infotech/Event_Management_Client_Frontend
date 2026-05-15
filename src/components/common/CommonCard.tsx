"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { designConfig } from "@/lib/design-config";

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
  iconColorClass = "text-primary",
  iconBgClass = "bg-primary/10",
  children,
  className,
  isView = false,
}: CommonCardProps) => {
  return (
    <div className={cn(isView ? "bg-transparent p-0" : cn(designConfig.surface.panel, designConfig.surface.panelPadded), className)}>
      {title && (
        <div className={cn("flex items-center gap-4", designConfig.surface.panelHeader)}>
          {Icon && (
            <div className={cn("w-10 h-10 flex items-center justify-center", designConfig.control.iconButton, iconBgClass, iconColorClass)}>
              <Icon size={20} />
            </div>
          )}
          <div>
            <h3 className={designConfig.type.cardTitle}>{title}</h3>
            {subtitle && <p className={designConfig.type.sectionSubtitle}>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
