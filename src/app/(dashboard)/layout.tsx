"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PortalSidebar } from "@/components/layout/Sidebar/PortalSidebar";
import VendorHeader from "@/components/layout/Header/VendorHeader";
import VendorBreadcrumb from "@/components/layout/Breadcrumb/VendorBreadcrumb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PortalSidebar />
      <SidebarInset className="bg-background flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300">
        <VendorHeader />
        <VendorBreadcrumb />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
          <div className="flex-1 overflow-auto h-full [&_.client-page-shell]:mx-0 [&_.client-page-shell]:max-w-none">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
