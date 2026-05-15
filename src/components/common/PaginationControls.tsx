import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { designConfig } from "@/lib/design-config";

interface PaginationControlsProps {
  currentPage: number;
  itemsPerPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function PaginationControls({
  currentPage,
  itemsPerPage,
  totalResults,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const start = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <div className={designConfig.data.pagination}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <p className={cn(designConfig.type.caption, "uppercase tracking-wide whitespace-nowrap")}>Records per page:</p>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
            <SelectTrigger className={cn("h-8 w-[64px]", designConfig.control.select)}>
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent className="min-w-[70px]">
              {[5, 10, 15, 20, 25, 50].map((value) => (
                <SelectItem key={value} value={value.toString()} className={cn(designConfig.type.caption, "font-semibold cursor-pointer")}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className={cn(designConfig.type.caption, "font-semibold uppercase tracking-wide hidden sm:block")}>
          Showing <span className="text-primary">{start}-{end}</span> of <span className="text-foreground">{totalResults}</span> results
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} variant="outline" className="h-8 w-8 p-0 disabled:opacity-30">
          <ChevronLeft size={16} />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button key={page} onClick={() => onPageChange(page)} variant={currentPage === page ? "default" : "outline"} className={cn("h-8 w-8 p-0", designConfig.type.caption, "font-semibold")}>
            {page}
          </Button>
        ))}

        <Button disabled={currentPage === totalPages || totalPages === 0} onClick={() => onPageChange(currentPage + 1)} variant="outline" className="h-8 w-8 p-0 disabled:opacity-30">
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
