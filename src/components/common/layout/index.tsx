"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { designConfig } from "@/lib/design-config";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tight?: boolean;
}

export function PageShell({ children, className, innerClassName, tight = false }: PageShellProps) {
  return (
    <div className={cn(designConfig.layout.pageShell, className)}>
      <div className={cn(tight ? designConfig.layout.pageInnerTight : designConfig.layout.pageInner, innerClassName)}>
        {children}
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
  actions?: React.ReactNode;
  backHref?: string;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({ title, description, count, countLabel = "TOTAL", actions, backHref, onBack, className }: PageHeaderProps) {
  const backButton = backHref ? (
    <Button asChild type="button" variant="outline" className={designConfig.control.actionButton}>
      <Link href={backHref}><ArrowLeft className="h-4 w-4" /> Back</Link>
    </Button>
  ) : onBack ? (
    <Button type="button" variant="outline" onClick={onBack} className={designConfig.control.actionButton}>
      <ArrowLeft className="h-4 w-4" /> Back
    </Button>
  ) : null;

  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className={cn(designConfig.type.pageTitle, "truncate")}>{title}</h1>
          {typeof count === "number" && (
            <span className={cn("inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase", designConfig.feedback.info)}>
              {count} {countLabel}
            </span>
          )}
        </div>
        {description && <p className={designConfig.type.pageSubtitle}>{description}</p>}
      </div>
      {(backButton || actions) && (
        <div className="flex flex-wrap items-center gap-2">
          {backButton}
          {actions}
        </div>
      )}
    </div>
  );
}

interface SectionPanelProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionPanel({ children, title, description, actions, className, contentClassName }: SectionPanelProps) {
  return (
    <section className={cn(designConfig.surface.panel, className)}>
      {(title || description || actions) && (
        <div className={cn("flex flex-col gap-3 md:flex-row md:items-start md:justify-between", designConfig.surface.panelHeader)}>
          <div className="min-w-0">
            {title && <h2 className={designConfig.type.cardTitle}>{title}</h2>}
            {description && <p className={designConfig.type.sectionSubtitle}>{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!contentClassName && designConfig.surface.panelPadded, contentClassName)}>{children}</div>
    </section>
  );
}

interface ToolbarProps {
  left?: React.ReactNode;
  search?: React.ReactNode;
  filters?: React.ReactNode;
  columns?: React.ReactNode;
  bulkActions?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export function Toolbar({ left, search, filters, columns, bulkActions, right, className }: ToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-center md:justify-between", designConfig.surface.toolbar, className)}>
      <div className="flex min-w-0 flex-1 items-center gap-3">{left}{search}</div>
      <div className="flex flex-wrap items-center gap-2">{filters}{columns}{bulkActions}{right}</div>
    </div>
  );
}

interface DataSurfaceProps {
  children: React.ReactNode;
  pagination?: React.ReactNode;
  empty?: React.ReactNode;
  loading?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  className?: string;
}

export function DataSurface({ children, pagination, empty, loading, isLoading, isEmpty, className }: DataSurfaceProps) {
  return (
    <div className={cn(designConfig.data.tableWrapper, className)}>
      {isLoading ? <div className={designConfig.data.loading}>{loading ?? "Loading..."}</div> : isEmpty ? <div className={designConfig.data.empty}>{empty ?? "No records found."}</div> : children}
      {pagination}
    </div>
  );
}

interface FormSurfaceProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function FormSurface({ children, title, description, actions, className }: FormSurfaceProps) {
  return (
    <SectionPanel title={title} description={description} actions={actions} className={className} contentClassName={cn(designConfig.surface.panelPadded, designConfig.layout.sectionGap)}>
      {children}
    </SectionPanel>
  );
}

interface ActionBarProps {
  children: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

export function ActionBar({ children, sticky = false, className }: ActionBarProps) {
  return (
    <div className={cn(designConfig.surface.panel, designConfig.surface.panelPadded, "flex flex-wrap items-center justify-end gap-2", sticky && "sticky bottom-0 z-20", className)}>
      {children}
    </div>
  );
}

interface ListPageLayoutProps {
  title: string;
  description?: string;
  count?: number;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
}

export function ListPageLayout({ title, description, count, actions, toolbar, children, pagination, className }: ListPageLayoutProps) {
  return (
    <PageShell innerClassName={cn(designConfig.layout.sectionGap, className)}>
      <PageHeader title={title} description={description} count={count} actions={actions} />
      {toolbar}
      <DataSurface pagination={pagination}>{children}</DataSurface>
    </PageShell>
  );
}

interface FormPageLayoutProps {
  title: string;
  description?: string;
  backHref?: string;
  onBack?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  sidePanel?: React.ReactNode;
  className?: string;
}

export function FormPageLayout({ title, description, backHref, onBack, children, actions, sidePanel, className }: FormPageLayoutProps) {
  return (
    <PageShell innerClassName={cn(designConfig.layout.sectionGap, className)}>
      <PageHeader title={title} description={description} backHref={backHref} onBack={onBack} />
      <div className={sidePanel ? designConfig.layout.twoColumnForm : designConfig.layout.sectionGap}>
        <div className={sidePanel ? designConfig.layout.mainColumn : undefined}>{children}</div>
        {sidePanel && <aside className={designConfig.layout.sideColumn}>{sidePanel}</aside>}
      </div>
      {actions && <ActionBar>{actions}</ActionBar>}
    </PageShell>
  );
}
