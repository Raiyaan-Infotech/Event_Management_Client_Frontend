"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";

const navLabels: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  profile: "Profile",
  clients: "Client",
  staff: "Staff",
  events: "Events",
  payments: "Payments",
  reports: "Reports",
  "activity-log": "Activity Log",
  transactions: "Transactions",
  "payment-management": "Payment",
  communication: "Communication",
  contact: "Contact",
  email: "Email",
  notification: "Notification",
  chat: "Chat",
  settings: "Settings",
  config: "Configuration",
  currency: "Currency",
  timezone: "Timezone",
  help: "Help",
  website: "Website Management",
  "personal-info": "Personal Info",
  "contact-us-management": "Contact Us",
  "testimonial-management": "Testimonial",
  "subscription-management": "Subscription",
  "events-management": "Events",
  "portfolio-management": "Portfolio",
  "email-template": "Email Template",
  newsletter: "Newsletter",
  create: "Create",
  edit: "Edit",
  view: "View",
  add: "Add",
};

export default function VendorBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: { label: string; url: string; isLast: boolean }[] = [];

    // Always show Dashboard as the starting point if not already the first segment
    if (segments[0] !== "dashboard") {
      items.push({ label: "Dashboard", url: "/dashboard", isLast: false });
    }

    let accumulatedPath = "";
    let mainModuleLabel = "";

    segments.forEach((segment) => {
      accumulatedPath += `/${segment}`;

      // Skip numeric segments (IDs)
      if (isNaN(Number(segment))) {
        let label =
          navLabels[segment] ??
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        // Define which segments are considered "main modules" to track context
        const isMainModule = [
          "staff",
          "clients",
          "events",
          "payments",
          "payment-management",
        ].includes(segment.toLowerCase());
        if (isMainModule) {
          mainModuleLabel = label;
        }

        // Enhance labels for known sub-actions using the module context
        const isSubAction = ["add", "edit", "view", "create"].includes(
          segment.toLowerCase(),
        );
        if (isSubAction && mainModuleLabel) {
          label = `${label} ${mainModuleLabel}`;
        }

        items.push({ label, url: accumulatedPath, isLast: false });
      }
    });

    // Mark last item for styling
    if (items.length > 0) {
      items[items.length - 1].isLast = true;
    }

    return items;
  }, [pathname]);

  if (pathname === "/dashboard") return null;

  return (
    <div className="h-[30px] flex items-center bg-card dark:bg-[#09090b] border-b border-border dark:border-[#27272a] w-full px-2 md:px-4 min-w-0 overflow-hidden sticky top-[56px] z-40">
      <div className="flex-1 flex items-center min-w-0 text-[10px]">
        <div className="flex items-center gap-1 font-medium truncate min-w-0">
          {breadcrumbItems.map((item, index) => (
            <Fragment key={`${item.url}-${index}`}>
              {index > 0 && (
                <ChevronRight className="text-[#c8c8c8] dark:text-[#52525b] size-2 mx-1" />
              )}
              {item.isLast ? (
                <span className="text-primary dark:text-[#60a5fa] font-bold truncate">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-[#6c757d] dark:text-[#a1a1aa] hover:text-primary dark:hover:text-[#60a5fa] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
