"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export interface ContentEditorSectionProps {
  value: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  onReset?: () => void;
  label?: string;
  description?: string;
  saveLabel?: string;
  resetLabel?: string;
  previewTitle?: string;
  previewDescription?: string;
}

export function ContentEditorSection({
  value,
  onChange,
  onSave,
  onReset,
  label = "Content Text",
  description = "Use the text editor below to format exactly what your visitors will see on the page.",
  saveLabel = "Save Changes",
  resetLabel = "Cancel",
  previewTitle,
  previewDescription
}: ContentEditorSectionProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  return (
    <div className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-transparent animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
      <div className="space-y-1 mb-6">
         <label className="text-base font-bold text-gray-900 dark:text-white font-poppins">{label}</label>
         <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left side: Editor */}
        <div className="lg:col-span-6 flex flex-col relative w-full z-0">
          <div className="flex items-center justify-between mb-3 shrink-0 h-8">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {isHtmlMode ? "Raw HTML Editor" : "Visual Editor"}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsHtmlMode(!isHtmlMode)}
              className="h-8 text-xs font-semibold rounded-lg"
            >
              {isHtmlMode ? "Switch to Visual" : "Switch to HTML"}
            </Button>
          </div>
          <div className={`editor-container overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative w-full ${!isHtmlMode ? "min-h-[450px]" : "h-[450px]"}`}>
            {isHtmlMode ? (
              <textarea 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full p-4 text-sm font-mono text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-[#1e1e1e] border-none focus:ring-0 resize-none outline-none"
                placeholder="<p>Write your raw HTML here...</p>"
              />
            ) : (
              <RichTextEditor value={value} onChange={onChange} />
            )}
          </div>
        </div>

        {/* Right side: Actions & Preview */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          {/* Top actions */}
          <div className="flex items-center gap-3">
             {onSave && (
               <Button onClick={onSave} className="flex-1 bg-primary hover:bg-primary/90 text-white h-11 text-sm font-semibold rounded-lg shadow-sm">
                 {saveLabel}
               </Button>
             )}
             {onReset && (
               <Button onClick={onReset} variant="outline" className="flex-1 h-11 text-sm font-semibold rounded-lg">
                 {resetLabel}
               </Button>
             )}
          </div>

          {/* Preview window */}
          <div className="flex-1 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-sm bg-white dark:bg-sidebar min-h-[400px]">
             <div className="bg-gray-50/80 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 px-4 py-3 shrink-0">
                <span className="text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200">Live Preview</span>
             </div>
             <div className="p-6 bg-white dark:bg-sidebar overflow-y-auto h-full pb-10 custom-scrollbar">
               {(previewTitle || previewDescription) && (
                 <div className="mb-6 pb-6 border-b border-gray-100 dark:border-white/10">
                   {previewTitle && <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-poppins">{previewTitle}</h3>}
                   {previewDescription && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{previewDescription}</p>}
                 </div>
               )}
               <div 
                 className="prose prose-sm dark:prose-invert max-w-none break-words" 
                 dangerouslySetInnerHTML={{ __html: value || "<p class='text-muted-foreground'><i>Start typing to preview...</i></p>" }} 
               />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

