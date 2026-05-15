"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { designConfig } from "@/lib/design-config";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  total?: number;
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, subtitle, total, rightContent }: PageHeaderProps) {
  return (
    <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className={cn(designConfig.type.pageTitle, "flex items-center gap-2")}>
          {title}
          {total !== undefined && (
            <Badge variant="outline" className={cn("px-2.5 py-0.5 ml-1", designConfig.feedback.info)}>
              {total} TOTAL
            </Badge>
          )}
        </h1>
        <p className={cn(designConfig.type.pageSubtitle, "mt-1")}>{subtitle}</p>
      </div>
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </div>
  );
}
