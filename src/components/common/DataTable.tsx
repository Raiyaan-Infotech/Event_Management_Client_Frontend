import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DashboardTableSkeleton } from "@/components/boneyard/dashboard-table-skeleton";
import { designConfig } from "@/lib/design-config";

export interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  visibleColumns: string[];
  selectedIds?: (string | number)[];
  onSelectAll?: () => void;
  onSelect?: (id: string | number) => void;
  onSort?: (key: string) => void;
  sortConfig?: { key: string; order: "asc" | "desc" | null };
  actionContent?: (item: T) => React.ReactNode;
  loading?: boolean;
  emptyContent?: React.ReactNode;
  rowIdKey: keyof T;
  noCard?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  visibleColumns,
  selectedIds = [],
  onSelectAll = () => {},
  onSelect = () => {},
  onSort,
  sortConfig,
  actionContent,
  loading = false,
  emptyContent,
  rowIdKey,
  noCard = false,
}: DataTableProps<T>) {
  const filteredColumns = columns.filter((col) => visibleColumns.includes(col.key));

  if (loading) return <DashboardTableSkeleton />;

  return (
    <div className={cn("flex-1 min-h-0 flex flex-col", !noCard && designConfig.data.tableWrapper, !noCard && "mb-4")}>
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className={designConfig.data.table}>
          <thead className={designConfig.data.tableHead}>
            <tr className={designConfig.data.tableHeadRow}>
              <th className={cn(designConfig.data.tableHeadCell, "w-10")}> 
                <div className="flex items-center justify-center">
                  <Checkbox checked={selectedIds.length === data.length && data.length > 0} onCheckedChange={onSelectAll} />
                </div>
              </th>
              {filteredColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={cn(
                    designConfig.data.tableHeadCell,
                    "cursor-pointer group active:opacity-70 select-none",
                    col.align === "center" && "text-center",
                    !col.sortable && "cursor-default",
                  )}
                >
                  <div className={cn("flex items-center gap-2 transition-colors group-hover:text-foreground", col.align === "center" && "justify-center")}>
                    {col.label}
                    {col.sortable && (
                      <ArrowUpDown size={12} className={cn("transition-all", sortConfig?.key === col.key ? "text-foreground opacity-100" : "opacity-30 group-hover:opacity-60")} />
                    )}
                  </div>
                </th>
              ))}
              {actionContent && <th className={cn(designConfig.data.tableHeadCell, "text-center")}>Action</th>}
            </tr>
          </thead>
          <tbody className={designConfig.data.tableBody}>
            {data.length > 0 ? (
              data.map((item, index) => {
                const id = item[rowIdKey] as string | number;
                return (
                  <tr key={id} className={cn(designConfig.data.tableRow, selectedIds.includes(id) && designConfig.data.tableRowSelected)}>
                    <td className={cn(designConfig.data.tableCell, "w-10")}>
                      <div className="flex items-center justify-center">
                        <Checkbox checked={selectedIds.includes(id)} onCheckedChange={() => onSelect(id)} />
                      </div>
                    </td>
                    {filteredColumns.map((col) => (
                      <td key={col.key} className={cn(designConfig.data.tableCell, col.align === "center" && "text-center")}>
                        {col.render ? col.render(item, index) : (item[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                    {actionContent && (
                      <td className={cn(designConfig.data.tableCell, "text-center")}>
                        <div className="flex items-center justify-center gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className={designConfig.control.iconButton}>
                                <MoreVertical size={16} className="text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={cn("w-40 p-1.5", designConfig.surface.panel)}>
                              {actionContent(item)}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={filteredColumns.length + (actionContent ? 2 : 1)} className={designConfig.data.empty}>
                  {emptyContent}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
