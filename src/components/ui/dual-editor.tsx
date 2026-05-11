"use client";

import React, { useState } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface DualEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function DualEditor({ value, onChange, placeholder = "Type here...", minHeight = "200px" }: DualEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {isHtmlMode ? "HTML Editor" : "Text Editor"}
         </span>
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setIsHtmlMode(false)}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
              !isHtmlMode ? "bg-white dark:bg-[#1e1e1e] shadow-sm text-primary" : "text-gray-400"
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => setIsHtmlMode(true)}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
              isHtmlMode ? "bg-white dark:bg-[#1e1e1e] shadow-sm text-primary" : "text-gray-400"
            }`}
          >
            HTML
          </button>
        </div>
      </div>
      <div 
        className={`rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 focus-within:bg-white dark:bg-[#1e1e1e] transition-all relative ${!isHtmlMode ? "min-h-fit" : ""}`}
        style={{ minHeight: isHtmlMode ? minHeight : 'auto' }}
      >
        {isHtmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 text-sm font-mono text-gray-800 dark:text-gray-200 bg-transparent border-none focus:ring-0 resize-none outline-none"
            style={{ minHeight }}
            placeholder={placeholder}
          />
        ) : (
          <div className="min-h-fit">
            <RichTextEditor value={value} onChange={onChange} height={minHeight} />
          </div>
        )}
      </div>
    </div>
  );
}
