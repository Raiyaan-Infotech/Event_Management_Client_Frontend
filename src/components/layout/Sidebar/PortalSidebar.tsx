"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useClientMe } from "@/hooks/use-client-auth";
import { clientNavItems, type PortalNavItem } from "@/config/client-nav";
import { resolveMediaUrl } from "@/lib/utils";

function isItemActive(item: PortalNavItem, pathname: string): boolean {
  if (item.href && (pathname === item.href || pathname.startsWith(item.href + "/"))) return true;
  return item.children?.some((child) => pathname === child.href || pathname.startsWith(child.href + "/")) ?? false;
}

export function PortalSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [mounted, setMounted] = React.useState(false);
  const { data: client } = useClientMe();

  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    const initial = new Set<string>();
    clientNavItems.forEach((item) => {
      if (item.children && isItemActive(item, pathname)) initial.add(item.label);
    });
    return initial;
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleOpen = (label: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const vendor = client?.vendor;
  const activeClass = "text-primary-foreground dark:text-white font-bold bg-primary dark:bg-primary drop-shadow-sm";
  const inactiveClass = "bg-transparent text-sidebar-foreground/70 dark:text-gray-400 hover:bg-sidebar-accent dark:hover:bg-white/10 hover:text-sidebar-accent-foreground dark:hover:text-white";
  const btnBase = "h-[34px] rounded-sm transition-all duration-200 !outline-none !ring-0 focus-visible:ring-0 active:bg-transparent";

  return (
    <Sidebar collapsible="icon" className="border-none bg-sidebar" {...props}>
      <SidebarHeader className={`sticky top-0 z-50 min-h-[56px] border-none flex flex-col justify-center bg-sidebar/95 backdrop-blur-sm transition-all duration-300 ${isCollapsed ? "px-1.5 py-3" : "pl-3 pr-4 py-3"}`}>
        <Link href="/dashboard" className={`flex items-center no-underline relative w-full overflow-hidden ${isCollapsed ? "justify-center" : "justify-start"}`}>
          <div className={`h-9 w-9 shrink-0 rounded-sm shadow-[0_4px_12px_rgba(52,84,209,0.3)] transition-all duration-300 flex items-center justify-center bg-primary overflow-hidden relative ${isCollapsed ? "opacity-100 scale-100 translate-x-0 rotate-0" : "opacity-0 scale-50 -translate-x-10 -rotate-12 absolute"}`}>
            {vendor?.company_logo ? (
              <Image src={resolveMediaUrl(vendor.company_logo)} alt="Company Logo" fill priority className="object-contain" />
            ) : (
              <span className="text-[15px] font-extrabold text-primary-foreground leading-none">
                {vendor?.company_name ? vendor.company_name.charAt(0).toUpperCase() : "C"}
              </span>
            )}
          </div>
          <div className={`flex flex-col transition-all duration-300 justify-center items-center ${!isCollapsed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 absolute pointer-events-none"}`}>
            {vendor?.company_logo ? (
              <div className="relative h-9 w-32">
                <Image src={resolveMediaUrl(vendor.company_logo)} alt="Company Logo" fill priority className="object-contain" />
              </div>
            ) : (
              <span className="text-[19px] font-extrabold tracking-tight text-sidebar-foreground dark:text-gray-100 leading-none">
                Client Portal
              </span>
            )}
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-muted-foreground dark:text-gray-400 m-0 p-0 mt-1 truncate max-w-[140px]">
              {vendor?.company_name ?? "Client Portal"}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className={`py-4 bg-sidebar transition-all duration-300 ${isCollapsed ? "px-1" : "px-4"}`}>
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-1">
            {clientNavItems.map((item) => {
              const active = isItemActive(item, pathname);
              const hasChildren = !!item.children?.length;
              const isOpen = openItems.has(item.label);
              const Icon = item.icon;

              if (!hasChildren) {
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label} className={`${btnBase} ${active ? activeClass : inactiveClass} ${isCollapsed ? "px-0 justify-center" : "px-3.5"}`}>
                      <Link href={item.href!} className="flex items-center gap-2.5 w-full">
                        <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                          <Icon className={`size-3.5 transition-colors ${active ? "text-primary-foreground dark:text-white" : "text-sidebar-foreground/70 dark:text-gray-400"}`} />
                        </div>
                        <span className="text-[12px] font-semibold group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <Collapsible key={item.label} open={isOpen} onOpenChange={() => toggleOpen(item.label)}>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={item.label} onClick={() => { if (item.href) router.push(item.href); toggleOpen(item.label); }} className={`${btnBase} ${active ? activeClass : inactiveClass} ${isCollapsed ? "px-0 justify-center" : "px-3.5"}`}>
                      <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                        <Icon className={`size-3.5 transition-colors ${active ? "text-primary-foreground dark:text-white" : "text-sidebar-foreground/70 dark:text-gray-400"}`} />
                      </div>
                      <span className="text-[12px] font-semibold group-data-[collapsible=icon]:hidden flex-1 text-left">{item.label}</span>
                      <ChevronRight className={`w-3 h-3 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${isOpen ? "rotate-90" : ""} ${active ? "text-primary-foreground/70 dark:text-white/70" : "text-sidebar-foreground/30"}`} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <CollapsibleContent>
                    <div className="mt-0.5 flex flex-col gap-1">
                      {item.children!.map((child) => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        const ChildIcon = child.icon;
                        return (
                          <SidebarMenuItem key={child.label}>
                            <SidebarMenuButton asChild tooltip={child.label} className={`${btnBase} ${childActive ? activeClass : inactiveClass} ${isCollapsed ? "px-0 justify-center" : "px-3.5 pl-8"}`}>
                              <Link href={child.href} className="flex items-center gap-2.5 w-full">
                                <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                                  <ChildIcon className={`size-3.5 transition-colors ${childActive ? "text-primary-foreground dark:text-white" : "text-sidebar-foreground/70 dark:text-gray-400"}`} />
                                </div>
                                <span className="text-[12px] font-semibold group-data-[collapsible=icon]:hidden">{child.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
