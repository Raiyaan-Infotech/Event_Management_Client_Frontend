"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";

const navLabels: Record<string, string> = {
  dashboard:    "Dashboard",
  profile:      "Profile",
  clients:      "Clients",
  events:       "Events",
  payments:     "Payments",
  subscription: "Subscription",
  payment:      "Payment",
  support:      "Communication",
  mail:         "Mail",
  compose:      "Compose",
  contacts:     "Contacts",
  chat:         "Chat",
  notification: "Notification",
  settings:     "Settings",
  help:         "Help",
  // CRUD actions
  create:       "Create",
  edit:         "Edit",
  view:         "View",
  add:          "Add",
};

// Group segments that have no standalone page
const NON_LINKABLE = new Set(["support", "communication"]);

const MAIN_MODULES = new Set(["events", "payments", "mail"]);
const SUB_ACTIONS  = new Set(["add", "edit", "view", "create"]);

export default function VendorBreadcrumb() {
  const pathname = usePathname();

  const items = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const result: { label: string; url: string; isLast: boolean; isLink: boolean }[] = [];
    let accPath = "";
    let moduleLabel = "";

    segments.forEach((seg) => {
      accPath += `/${seg}`;
      if (!isNaN(Number(seg))) return;

      let label = navLabels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      if (MAIN_MODULES.has(seg)) moduleLabel = label;
      if (SUB_ACTIONS.has(seg) && moduleLabel) label = `${label} ${moduleLabel}`;

      result.push({ label, url: accPath, isLast: false, isLink: !NON_LINKABLE.has(seg) });
    });

    if (result.length > 0) result[result.length - 1].isLast = true;
    return result;
  }, [pathname]);

  if (pathname === "/dashboard") return null;

  return (
    <div className="h-[30px] flex items-center bg-card dark:bg-[#09090b] border-b border-border dark:border-[#27272a] w-full px-2 md:px-4 min-w-0 overflow-hidden sticky top-[56px] z-40">
      <div className="flex-1 flex items-center min-w-0 text-[10px]">
        <div className="flex items-center gap-1 font-medium truncate min-w-0">
          {items.map((item, i) => (
            <Fragment key={`${item.url}-${i}`}>
              {i > 0 && <ChevronRight className="text-[#c8c8c8] dark:text-[#52525b] size-2 mx-1" />}
              {item.isLast ? (
                <span className="text-primary dark:text-[#60a5fa] font-bold truncate">{item.label}</span>
              ) : item.isLink ? (
                <Link href={item.url} className="text-[#6c757d] dark:text-[#a1a1aa] hover:text-primary transition-colors">{item.label}</Link>
              ) : (
                <span className="text-[#6c757d] dark:text-[#a1a1aa]">{item.label}</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

