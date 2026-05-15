import React from "react";
import { Search, Filter, Columns } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { designConfig } from "@/lib/design-config";

interface DataTableSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
  filterContent?: React.ReactNode;
  columnContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  isFiltered?: boolean;
}

export function DataTableSearch({
  searchQuery,
  onSearchChange,
  placeholder,
  filterContent,
  columnContent,
  rightContent,
  isFiltered = false,
}: DataTableSearchProps) {
  return (
    <div className={cn("shrink-0 flex flex-col md:flex-row gap-3 items-center", designConfig.surface.toolbar)}>
      <div className="relative flex-1 w-full md:w-auto group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
          <Search size={18} />
        </div>
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className={designConfig.control.search}
        />
      </div>
      <div className="flex items-center gap-2">
        {filterContent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(designConfig.control.actionButton, isFiltered && designConfig.feedback.info)}
              >
                <Filter size={16} /> Filters {isFiltered && "*"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn("w-56 p-3", designConfig.surface.panel)}>
              {filterContent}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {columnContent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={designConfig.control.actionButton}>
                <Columns size={16} /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn("w-64 p-3 overflow-hidden", designConfig.surface.panel)}>
              {columnContent}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {rightContent}
      </div>
    </div>
  );
}
