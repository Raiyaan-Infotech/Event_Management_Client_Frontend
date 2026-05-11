"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
          {title}
          {total !== undefined && (
            <Badge variant="outline" className="text-[11px] font-extrabold border-blue-200 text-blue-600 bg-blue-50/50 px-2.5 py-0.5 ml-1">
              {total} TOTAL
            </Badge>
          )}
        </h1>
        <p className="text-sm text-gray-400 mt-1 italic tracking-tight font-medium">
          {subtitle}
        </p>
      </div>
      {rightContent && (
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      )}
    </div>
  );
}
