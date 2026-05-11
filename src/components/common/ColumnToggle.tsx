import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ColumnToggleProps {
  columns: { key: string; label: string }[];
  tempColumns: string[];
  onToggleAll: () => void;
  onToggle: (key: string) => void;
  onSave: () => void;
}

export function ColumnToggle({ 
  columns, 
  tempColumns, 
  onToggleAll, 
  onToggle, 
  onSave 
}: ColumnToggleProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gray-50 pb-3">
        <span className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Select Columns</span>
        <Button 
          variant="ghost" 
          onClick={onToggleAll}
          className="h-7 px-2 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50"
        >
          {tempColumns.length === columns.length ? "Deselect All" : "Select All"}
        </Button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto px-1 space-y-1 py-1">
        {columns.map((col) => (
          <div 
            key={col.key} 
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${tempColumns.includes(col.key) ? 'bg-blue-50/50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}`}
            onClick={() => onToggle(col.key)}
          >
            <Checkbox 
              checked={tempColumns.includes(col.key)} 
              onCheckedChange={() => {}}
              className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 pointer-events-none"
            />
            <span className="text-[12px] font-black uppercase tracking-tight cursor-pointer flex-1">
              {col.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 p-1">
        <Button 
          onClick={onSave}
          className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
