import React from "react";
import { Search, Filter, Columns } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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
  isFiltered = false
}: DataTableSearchProps) {
  return (
    <div className="shrink-0 bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full md:w-auto group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500">
          <Search size={18} />
        </div>
        <Input 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder} 
          className="h-12 w-full pl-12 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
        />
      </div>
      <div className="flex items-center gap-2">
        {filterContent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`h-12 px-6 border-gray-100 dark:border-gray-800 transition-all rounded-2xl gap-2 font-bold text-[11px] uppercase tracking-widest ${isFiltered ? "text-blue-500 border-blue-500/20 bg-blue-50/50" : "text-gray-400 hover:bg-gray-100"}`}>
                <Filter size={16} /> Filters {isFiltered && "•"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-3 border-gray-100 shadow-2xl">
              {filterContent}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {columnContent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-6 border-gray-100 dark:border-gray-800 transition-all rounded-2xl gap-2 font-bold text-[11px] uppercase tracking-widest text-gray-400 hover:bg-gray-100">
                <Columns size={16} /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-3 border-gray-100 shadow-2xl overflow-hidden">
              {columnContent}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {rightContent}
      </div>
    </div>
  );
}
