"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "@/components/website/ThemePreview";
import { VendorPreviewData } from "@/hooks/use-vendor-preview";

interface ThemeColors {
  header: string;
  footer: string;
  primary: string;
  secondary: string;
  hover: string;
  text: string;
}

interface ThemeFullPagePreviewProps {
  title: string;
  subtitle: string;
  themeId: number | string;
  colors?: ThemeColors;
  maxWidth?: string;
  vendorData?: VendorPreviewData;
}

export const ThemeFullPagePreview = ({
  title,
  subtitle,
  themeId,
  colors,
  maxWidth = "1400px",
  vendorData,
}: ThemeFullPagePreviewProps) => {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col bg-gray-50/30 dark:bg-[#0f172a] animate-in fade-in duration-500 overflow-hidden">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-50 px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-poppins leading-none">{title}</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{subtitle}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="rounded-xl flex items-center gap-2 font-black text-xs uppercase tracking-widest px-6 h-12 border-gray-200 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={16} strokeWidth={3} />
          Go Back
        </Button>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-12 bg-gray-100/20">
         <div className="mx-auto transition-all duration-700" style={{ maxWidth }}>
            <div className="w-full bg-white dark:bg-[#0a0a0a] rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col min-h-[1200px]">
               {/* Simulation Toolbar */}
               <div className="h-10 bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 flex items-center px-6 gap-3">
                  <div className="flex gap-2">
                    <div className="size-2.5 rounded-full bg-red-400/80" />
                    <div className="size-2.5 rounded-full bg-yellow-400/80" />
                    <div className="size-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 max-w-sm h-6 bg-white dark:bg-white/10 rounded-full mx-auto flex items-center px-4">
                    <div className="h-1.5 w-1/2 bg-gray-100 dark:bg-white/10 rounded-full" />
                  </div>
               </div>

               {/* The Actual Website Content */}
               <div className="flex-1">
                  <ThemePreview themeId={themeId} colors={colors} vendorData={vendorData} />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
