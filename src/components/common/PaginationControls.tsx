import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  onItemsPerPageChange 
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  
  return (
    <div className="shrink-0 px-8 py-5 bg-white dark:bg-gray-800/10 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
            Records per page:
          </p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              onItemsPerPageChange(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-[70px] rounded-xl text-[11px] font-bold border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 focus:ring-0 focus:ring-offset-0 transition-all hover:bg-gray-100 uppercase tracking-tighter">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 min-w-[70px] shadow-xl">
              {[5, 10, 15, 20, 25, 50].map((value) => (
                <SelectItem 
                  key={value} 
                  value={value.toString()}
                  className="text-[11px] font-bold rounded-lg cursor-pointer focus:bg-blue-50 focus:text-blue-600 transition-colors"
                >
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider hidden sm:block">
          Showing <span className="text-blue-600">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalResults)}</span> of <span className="text-gray-600 dark:text-gray-200">{totalResults}</span> results
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)}
          variant="outline" 
          className="h-9 w-9 p-0 rounded-xl border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-50 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </Button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button 
            key={page}
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? "default" : "outline"} 
            className={`h-9 w-9 p-0 rounded-xl text-[12px] font-bold transition-all duration-300 ${
              currentPage === page 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-none scale-105" 
                : "border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50"
            }`}
          >
            {page}
          </Button>
        ))}
        
        <Button 
          disabled={currentPage === totalPages || totalPages === 0} 
          onClick={() => onPageChange(currentPage + 1)}
          variant="outline" 
          className="h-9 w-9 p-0 rounded-xl border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-50 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
