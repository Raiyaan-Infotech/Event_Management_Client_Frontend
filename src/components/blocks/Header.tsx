"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X, Phone, Mail } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import { normalizeHomeBlocks } from "@/lib/safe-json";

interface Page     { id: number; name: string; is_active?: number }
interface NavChild { page_id: number; label: string; order: number }
interface NavItem  { label: string; type?: string; page_ids: number[]; children: NavChild[]; order: number }

const FIXED_MENU_TYPES = new Set(["home", "about", "contact"]);

const parseNavMenu = (value: any): NavItem[] => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeMenuType = (item: Partial<NavItem>) => {
  const label = (item.label || "").trim().toLowerCase();
  if (item.type === "home" || label === "home") return "home";
  if (item.type === "about" || label === "about us" || label === "about") return "about";
  if (item.type === "contact" || label === "contact us" || label === "contact") return "contact";
  if (item.type === "pages" || label === "pages") return "pages";
  return item.type;
};

export default function Header({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const vendor  = data?.vendor  || {};
  const colors  = data?.colors  || {};
  const slug    = data?.slug    || "";
  const pages   = (data?.pages  || []) as Page[];
  const homeBlocks = normalizeHomeBlocks(data?.home_blocks);

  const [mobileOpen, setMobileOpen]         = useState(false);
  const [openDropdown, setOpenDropdown]     = useState<string | null>(null);

  const primary  = colors.primary_color || "#2563eb";
  const headerBg = colors.header_color  || "#ffffff";
  const navText  = colors.text_color    || "#1e293b";
  const cityName =
    vendor.locality?.name ||
    vendor.city ||
    (typeof vendor.company_address === "string" ? vendor.company_address.split(",")[0]?.trim() : "") ||
    "";

  const previewBaseUrl = data?.previewBaseUrl as string | undefined;
  const isPreview = slug === "preview" && !!previewBaseUrl;
  const previewHref = (view?: string, hash = "") => {
    if (!previewBaseUrl) return hash || "#";
    const [path, query = ""] = previewBaseUrl.split("?");
    const params = new URLSearchParams(query);
    params.delete("previewPage");
    params.delete("pageId");
    if (view) params.set("previewPage", view);
    const queryString = params.toString();
    return `${path}${queryString ? `?${queryString}` : ""}${hash}`;
  };

  const homeHref    = isPreview ? previewHref() : (slug ? `/${slug}`          : "#");
  const aboutHref   = isPreview ? previewHref(undefined, "#about-us") : (slug ? `/${slug}#about-us` : "#about-us");
  const contactHref = isPreview ? previewHref("contact") : (slug ? `/${slug}/contact-us`  : "#contact");
  const loginHref   = isPreview ? previewHref("login") : (slug ? `/${slug}/login` : "#");
  const registerHref = isPreview ? previewHref("register") : (slug ? `/${slug}/register` : "#");
  const showRegister = homeBlocks.some((block) => block.block_type === "register" && block.is_visible);
  const legalHrefForLabel = (label?: string) => {
    const normalized = (label || "").toLowerCase();
    if (normalized.includes("terms")) return isPreview ? previewHref("terms") : (slug ? `/${slug}/terms-conditions` : "#");
    if (normalized.includes("privacy")) return isPreview ? previewHref("privacy") : (slug ? `/${slug}/privacy-policy` : "#");
    return null;
  };
  const pageHref    = (id: number, label?: string) => {
    const legalHref = legalHrefForLabel(label);
    if (legalHref) return legalHref;
    if (isPreview) {
      const href = previewHref("page");
      const separator = href.includes("?") ? "&" : "?";
      return `${href}${separator}pageId=${id}`;
    }
    return slug ? `/${slug}/pages/${id}` : "#";
  };

  const scrollToAbout = () => {
    const section = document.getElementById("about-us");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== "#about-us") {
      window.history.replaceState(null, "", "#about-us");
    }
  };

  const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (isPreview && item.type === "about") {
      const section = document.getElementById("about-us");
      if (!section) return;
      event.preventDefault();
      setMobileOpen(false);
      requestAnimationFrame(scrollToAbout);
    }
  };

  const logoSrc = vendor.company_logo
    ? resolveMediaUrl(vendor.company_logo)
    : null;

  const visiblePages = pages.filter(p => p.is_active !== 0);
  const savedMenu = parseNavMenu(vendor.nav_menu);
  const pageGroups = savedMenu
    .map((item) => ({ ...item, type: normalizeMenuType(item) }))
    .filter((item) => !FIXED_MENU_TYPES.has(item.type || ""))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const fallbackPageGroups: NavItem[] = visiblePages.length
    ? [{ label: "Pages", type: "pages", page_ids: visiblePages.map(p => p.id), children: [], order: 2 }]
    : [];
  const menuPageGroups = pageGroups.length ? pageGroups : fallbackPageGroups;
  const rawMenu: NavItem[] = [
    { label: "Home", type: "home", page_ids: [], children: [], order: 0 },
    { label: "About Us", type: "about", page_ids: [], children: [], order: 1 },
    ...menuPageGroups.map((item, index) => ({ ...item, order: index + 2 })),
    { label: "Contact Us", type: "contact", page_ids: [], children: [], order: menuPageGroups.length + 2 },
  ];

  // Resolve the link href based on nav item type
  const resolveHref = (item: NavItem) => {
    if (item.type === "home")    return homeHref;
    if (item.type === "about")   return aboutHref;
    if (item.type === "contact") return contactHref;
    return "#";
  };

  const getChildren = (item: NavItem): { page_id: number; label: string; order: number }[] => {
    const children = Array.isArray(item.children) ? item.children : [];
    if (children.length > 0) {
      return children.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    if (item.type === "pages") {
      const selectedIds = Array.isArray(item.page_ids) ? item.page_ids : [];
      const selectedPages = selectedIds.length > 0
        ? selectedIds
            .map((id, order) => {
              const page = pages.find(p => p.id === id && p.is_active !== 0);
              return page ? { page_id: page.id, label: page.name, order } : null;
            })
            .filter(Boolean) as { page_id: number; label: string; order: number }[]
        : visiblePages
            .map((p, order) => ({ page_id: p.id, label: p.name, order }));
      return selectedPages;
    }
    return [];
  };

  // ── Desktop item renderer ────────────────────────────────────────────────
  const renderDesktopItem = (item: NavItem, linkClass: string, dropdownBg: string, dropdownText: string) => {
    const children   = getChildren(item);
    const hasChildren = children.length > 0;
    const isOpen      = openDropdown === item.label;

    if (!hasChildren) {
      return (
        <Link key={item.label} href={resolveHref(item)}
          onClick={(event) => handleItemClick(event, item)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${linkClass}`}>
          {item.label}
        </Link>
      );
    }

    return (
      <div key={item.label} className="relative"
        onMouseEnter={() => setOpenDropdown(item.label)}
        onMouseLeave={() => setOpenDropdown(null)}>
        <button className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${linkClass}`}>
          {item.label}
          <ChevronDown className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div className={`absolute top-full left-0 mt-1 min-w-[180px] rounded-xl border shadow-xl py-2 z-50 ${dropdownBg}`}>
            {children.map(c => (
              <Link key={c.page_id} href={pageHref(c.page_id, c.label)}
                className={`block px-4 py-2 text-[13px] font-semibold transition-colors ${dropdownText}`}>
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── Mobile item renderer ─────────────────────────────────────────────────
  const renderMobileItem = (item: NavItem, linkClass: string) => {
    const children    = getChildren(item);
    const hasChildren = children.length > 0;

    if (!hasChildren) {
      return (
        <Link key={item.label} href={resolveHref(item)}
          onClick={(event) => handleItemClick(event, item)}
          className={`px-3 py-2.5 text-sm font-semibold rounded-lg ${linkClass}`}>
          {item.label}
        </Link>
      );
    }
    return (
      <React.Fragment key={item.label}>
        <span className={`px-3 py-2.5 text-sm font-semibold rounded-lg ${linkClass}`}>{item.label}</span>
        {children.map(c => (
          <Link key={c.page_id} href={pageHref(c.page_id, c.label)}
            className={`pl-7 px-3 py-2.5 text-sm font-semibold rounded-lg ${linkClass}`}>
            {c.label}
          </Link>
        ))}
      </React.Fragment>
    );
  };

  // ── Variant 1: Classic ───────────────────────────────────────────────────
  if (variant === "variant_1") return (
    <header className="w-full sticky top-0 z-50 shadow-sm" style={{ backgroundColor: headerBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href={homeHref} className="flex items-center gap-3 no-underline shrink-0">
            {logoSrc && <Image src={logoSrc} alt={vendor.company_name || "Company logo"} width={36} height={36} className="h-9 w-9 object-contain rounded-md" unoptimized />}
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight" style={{ color: primary }}>
                {vendor.company_name || "Vendor"}
              </span>
              {cityName && (
                <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  {cityName}
                </span>
              )}
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {rawMenu.map(item => renderDesktopItem(item, "hover:bg-black/5", "bg-white", "text-gray-700 hover:bg-blue-50 hover:text-blue-600"))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link href={loginHref} className="px-4 py-2 text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: navText }}>Login</Link>
            {showRegister ? (
              <Link href={registerHref} className="px-5 py-2 rounded-full text-sm font-bold text-white shadow-sm hover:scale-105 active:scale-95 transition-all" style={{ backgroundColor: primary }}>Register</Link>
            ) : null}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-black/5" style={{ color: navText }} onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-0.5" style={{ backgroundColor: headerBg }}>
          {rawMenu.map(item => renderMobileItem(item, "hover:bg-black/5"))}
          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-black/5">
            <Link
              href={loginHref}
              className="px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-black/5"
              style={{ color: navText }}
            >
              Login
            </Link>
            {showRegister ? (
              <Link
                href={registerHref}
                className="px-4 py-2.5 rounded-lg text-sm font-bold text-white text-center shadow-sm transition-all"
                style={{ backgroundColor: primary }}
              >
                Register
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );

  // ── Variant 2: Two-row ───────────────────────────────────────────────────
  return (
    <header className="w-full sticky top-0 z-50" style={{ backgroundColor: primary }}>
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href={homeHref} className="flex items-center gap-3 no-underline">
              {logoSrc && <Image src={logoSrc} alt={vendor.company_name || "Company logo"} width={36} height={36} className="h-9 w-9 object-contain rounded-md bg-white/10 p-1" unoptimized />}
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white leading-none block">{vendor.company_name || "Vendor"}</span>
                {cityName && (
                  <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider">{cityName}</span>
                )}
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-5">
              {vendor.company_contact && (
                <a href={`tel:${vendor.company_contact}`} className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors">
                  <Phone className="size-3.5" /> {vendor.company_contact}
                </a>
              )}
              {vendor.company_email && (
                <a href={`mailto:${vendor.company_email}`} className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors">
                  <Mail className="size-3.5" /> {vendor.company_email}
                </a>
              )}
              {showRegister ? (
                <Link href={registerHref} className="px-4 py-1.5 rounded-full text-xs font-bold bg-white transition-all hover:bg-white/90" style={{ color: primary }}>
                  Register
                </Link>
              ) : null}
            </div>

            <button className="md:hidden p-2 rounded-lg text-white hover:bg-white/10" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center justify-center gap-1 h-11">
            {rawMenu.map(item => renderDesktopItem(item,
              "text-white/80 hover:text-white hover:bg-white/10",
              "bg-white",
              "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            ))}
            <Link href={loginHref} className="px-5 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">Login</Link>
          </nav>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-0.5 bg-white/10">
          {rawMenu.map(item => renderMobileItem(item, "text-white/80 hover:text-white hover:bg-white/10"))}
          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-white/10">
            <Link
              href={loginHref}
              className="px-3 py-2.5 text-sm font-semibold rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              Login
            </Link>
            {showRegister ? (
              <Link
                href={registerHref}
                className="px-4 py-2.5 rounded-lg text-sm font-bold bg-white text-center transition-all"
                style={{ color: primary }}
              >
                Register
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
