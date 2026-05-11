import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DashboardTableSkeleton } from "@/components/boneyard/dashboard-table-skeleton";

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
  noCard = false
}: DataTableProps<T>) {
  const filteredColumns = columns.filter(col => visibleColumns.includes(col.key));

  if (loading) {
    return <DashboardTableSkeleton />;
  }
  
  return (
    <div className={cn(
      "flex-1 min-h-0 flex flex-col",
      !noCard && "bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden mb-4"
    )}>
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left border-separate border-spacing-0 min-w-[1100px]">
          <thead className="sticky top-0 z-20 bg-white dark:bg-[#1f2937] shadow-sm">
            <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100/50 dark:border-gray-800">
              <th className="px-6 py-5 w-10">
                <div className="flex items-center justify-center">
                  <Checkbox 
                    checked={selectedIds.length === data.length && data.length > 0}
                    onCheckedChange={onSelectAll}
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </div>
              </th>
              {filteredColumns.map((col) => (
                <th 
                  key={col.key} 
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={cn(
                    "px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest cursor-pointer group active:opacity-70 select-none",
                    col.align === "center" ? "text-center" : "",
                    !col.sortable && "cursor-default"
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-2 transition-colors group-hover:text-gray-600",
                    col.align === "center" ? "justify-center" : ""
                  )}>
                    {col.label}
                    {col.sortable && (
                      <ArrowUpDown size={12} className={cn(
                        "transition-all",
                        sortConfig?.key === col.key ? "text-gray-600 opacity-100" : "opacity-30 group-hover:opacity-60"
                      )} />
                    )}
                  </div>
                </th>
              ))}
              {actionContent && (
                <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
            {data.length > 0 ? (
              data.map((item, index) => {
                const id = item[rowIdKey] as string | number;
                return (
                  <tr 
                    key={id} 
                    className={cn(
                      "group transition-all relative overflow-hidden transition-all duration-300",
                      selectedIds.includes(id) 
                        ? 'bg-blue-50/60 dark:bg-blue-500/10' 
                        : 'even:bg-[#F8FBFF] dark:even:bg-white/[0.03] odd:bg-white dark:odd:bg-transparent',
                      'hover:bg-blue-50/50 dark:hover:bg-blue-500/[0.03]'
                    )}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center">
                        <Checkbox 
                          checked={selectedIds.includes(id)}
                          onCheckedChange={() => onSelect(id)}
                          className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </div>
                    </td>
                    {filteredColumns.map((col) => (
                      <td 
                        key={col.key} 
                        className={cn(
                          "px-6 py-5",
                          col.align === "center" ? "text-center" : ""
                        )}
                      >
                        {col.render ? col.render(item, index) : (item[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                    {actionContent && (
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1 transition-all duration-300">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-blue-50 rounded-xl transition-all">
                                  <MoreVertical size={16} className="text-gray-400" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl border-gray-100 p-1.5 shadow-xl">
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
                <td colSpan={filteredColumns.length + (actionContent ? 2 : 1)} className="px-6 py-32 text-center bg-gray-50/20">
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
