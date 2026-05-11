"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { resolveMediaUrl, toPublicSlug } from "@/lib/utils";
import { usePublicNewsletterSubscribe } from "@/hooks/use-public-client";
import { normalizeHomeBlocks } from "@/lib/safe-json";

interface Page       { id: number; name: string; is_active: number }
interface SocialLink { id: number; label: string; url: string; icon?: string; icon_color?: string; is_active: number }

// Render icon using @iconify/react.
// Handles both Iconify format ("simple-icons:facebook") and plain names ("Facebook" → "simple-icons:facebook").
function SocialIcon({ icon, color, label }: { icon?: string; color?: string; label?: string }) {
  if (icon) {
    const iconName = icon.includes(":")
      ? icon
      : `simple-icons:${icon.toLowerCase().trim().replace(/\s+/g, "")}`;
    return <Icon icon={iconName} style={{ color: color || "#ffffff", width: 16, height: 16 }} />;
  }
  return <span className="text-xs font-bold" style={{ color: color || "#ffffff" }}>{(label || "?").charAt(0)}</span>;
}

export default function Footer({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const router = useRouter();
  const variant     = settings?.variant || "variant_1";
  const vendor      = data?.vendor      || {};
  const colors      = data?.colors      || {};
  const pages       = (data?.pages      || []).filter((p: Page) => p.is_active !== 0) as Page[];
  const home_blocks = normalizeHomeBlocks(data?.home_blocks);
  const slug        = data?.slug        || "";
  const publicSlug  = slug === "preview" ? toPublicSlug(vendor.company_name || "") : slug;
  const socialLinks = (data?.socialLinks || []).filter((l: SocialLink) => l.is_active === 1) as SocialLink[];
  const previewBaseUrl = data?.previewBaseUrl as string | undefined;
  const isPreview = slug === "preview" && !!previewBaseUrl;

  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const newsletterMutation = usePublicNewsletterSubscribe(publicSlug);

  const footerBg = colors.footer_color  || "#1e293b";
  const primary  = colors.primary_color || "#2563eb";
  const text     = "#e2e8f0";
  const year     = new Date().getFullYear();

  // Gate terms/privacy links on whether those blocks are in the theme's home_blocks
  const hasTerms        = home_blocks.some(b => b.block_type === "terms_conditions" && b.is_visible);
  const hasPrivacy      = home_blocks.some(b => b.block_type === "privacy_policy"   && b.is_visible);
  // Social media section only when social_media block is in home_blocks
  const hasSocialBlock  = home_blocks.some(b => b.block_type === "social_media"     && b.is_visible);
  // Newsletter section driven by vendor's newsletter_status field (set from footer management page)
  const hasNewsletter   = vendor.newsletter_status === 1;

  const previewHref = (view?: string) => {
    if (!previewBaseUrl) return "#";
    const [path, query = ""] = previewBaseUrl.split("?");
    const params = new URLSearchParams(query);
    params.delete("previewPage");
    params.delete("pageId");
    if (view) params.set("previewPage", view);
    const queryString = params.toString();
    return `${path}${queryString ? `?${queryString}` : ""}`;
  };

  const pageHref = (id: number) => {
    if (isPreview) {
      const href = previewHref("page");
      const separator = href.includes("?") ? "&" : "?";
      return `${href}${separator}pageId=${id}`;
    }
    return slug ? `/${slug}/pages/${id}` : "#";
  };

  const legalHref = (view: "terms" | "privacy", fallbackPath: string) => {
    if (isPreview) return previewHref(view);
    return slug ? `/${slug}/${fallbackPath}` : "#";
  };

  const handleQuickLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isPreview || href === "#") return;
    event.preventDefault();
    router.push(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderQuickLink = (item: { label: string; href: string }) => {
    if (item.href === "#") {
      return (
        <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity" style={{ color: text }}>
          {item.label}
        </a>
      );
    }

    return (
      <Link href={item.href} onClick={(event) => handleQuickLinkClick(event, item.href)} className="text-sm opacity-60 hover:opacity-100 transition-opacity" style={{ color: text }}>
        {item.label}
      </Link>
    );
  };

  const handleNewsletterSubscribe = async () => {
    const trimmedEmail = email.trim();
    setNewsletterMessage("");

    if (!trimmedEmail) {
      setNewsletterMessage("Please enter your email.");
      return;
    }

    if (!slug || isPreview) {
      setNewsletterMessage("Newsletter subscription is available on the live vendor site.");
      return;
    }

    try {
      await newsletterMutation.mutateAsync({ email: trimmedEmail });

      setEmail("");
      setNewsletterMessage("Subscribed successfully.");
    } catch (error: any) {
      setNewsletterMessage(error?.message || "Subscription failed. Please try again.");
    }
  };

  const legalHrefForLabel = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized.includes("terms")) return legalHref("terms", "terms-conditions");
    if (normalized.includes("privacy")) return legalHref("privacy", "privacy-policy");
    return null;
  };

  const baseLinks: { label: string; href: string }[] = pages.map(p => ({
    label: p.name,
    href: legalHrefForLabel(p.name) || pageHref(p.id),
  }));

  const legalLinks = [
    ...(hasTerms   ? [{ label: "Terms & Conditions", href: legalHref("terms", "terms-conditions") }] : []),
    ...(hasPrivacy ? [{ label: "Privacy Policy",     href: legalHref("privacy", "privacy-policy")   }] : []),
  ];

  // Merge without duplicates
  const quickLinks = [...baseLinks];
  legalLinks.forEach(ll => {
    const index = quickLinks.findIndex(bl => bl.label.toLowerCase() === ll.label.toLowerCase());
    if (index >= 0) {
      quickLinks[index] = ll;
    } else {
      quickLinks.push(ll);
    }
  });

  const logoSrc = vendor.company_logo
    ? resolveMediaUrl(vendor.company_logo)
    : null;

  const socialRow = hasSocialBlock && socialLinks.length > 0 ? (
    <div className="flex flex-wrap items-center gap-3 mt-1">
      {socialLinks.map(l => (
        <a key={l.id} href={l.url || "#"} target="_blank" rel="noopener noreferrer" title={l.label}
          className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center transition-all">
          <SocialIcon icon={l.icon} color={l.icon_color} label={l.label} />
        </a>
      ))}
    </div>
  ) : null;

  // ── Variant 1: 3-column grid ────────────────────────────────────────────────
  if (variant === "variant_1") return (
    <footer className="w-full mt-auto" style={{ backgroundColor: footerBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1 — Company */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {logoSrc && (
                <Image src={logoSrc} alt={vendor.company_name || "Company logo"} width={44} height={44} className="h-11 w-11 object-contain rounded-lg bg-white/10 p-1" unoptimized />
              )}
              <p className="text-lg font-extrabold leading-tight" style={{ color: text }}>{vendor.company_name || "Vendor"}</p>
            </div>
            {vendor.short_description && (
              <p className="text-sm leading-relaxed opacity-60" style={{ color: text }}>{vendor.short_description}</p>
            )}
            <div className="space-y-2 pt-1">
              {vendor.company_address && <p className="flex items-start gap-2 text-sm opacity-60" style={{ color: text }}><span className="shrink-0 mt-0.5">📍</span><span>{vendor.company_address}</span></p>}
              {vendor.company_contact && <p className="flex items-center gap-2 text-sm opacity-60" style={{ color: text }}><span className="shrink-0">📞</span><a href={`tel:${vendor.company_contact}`} className="hover:opacity-100">{vendor.company_contact}</a></p>}
              {vendor.company_email   && <p className="flex items-center gap-2 text-sm opacity-60" style={{ color: text }}><span className="shrink-0">✉</span><a href={`mailto:${vendor.company_email}`} className="hover:opacity-100 break-all">{vendor.company_email}</a></p>}
            </div>
            {socialRow}
          </div>

          {/* Col 2 — Quick Links (always shown, terms/privacy conditional) */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 opacity-70" style={{ color: text }}>Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l, i) => (
                <li key={i}>{renderQuickLink(l)}</li>
              ))}
              {quickLinks.length === 0 && (
                <li><span className="text-sm opacity-30 italic" style={{ color: text }}>No pages yet</span></li>
              )}
            </ul>
          </div>

          {/* Col 3 — Newsletter (only when newsletter block is enabled in theme) */}
          {hasNewsletter && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-5 opacity-70" style={{ color: text }}>Newsletter</h3>
              <p className="text-sm opacity-50 mb-4" style={{ color: text }}>Subscribe to get the latest updates.</p>
              <div className="flex flex-col gap-3">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email..."
                  className="h-11 px-4 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/50 transition-all" />
                <button type="button" onClick={handleNewsletterSubscribe} disabled={newsletterMutation.isPending} className="h-11 px-6 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60" style={{ backgroundColor: primary }}>
                  {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
                </button>
                {newsletterMessage && <p className="text-xs font-semibold opacity-70" style={{ color: text }}>{newsletterMessage}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs opacity-40" style={{ color: text }}>&copy; {year} {vendor.copywrite || vendor.company_name}. All rights reserved.</p>
          {vendor.poweredby && <p className="text-xs opacity-30" style={{ color: text }}>Powered by {vendor.poweredby}</p>}
        </div>
      </div>
    </footer>
  );

  // ── Variant 2: Centered brand header + grid below ───────────────────────────
  return (
    <footer className="w-full mt-auto" style={{ backgroundColor: footerBg }}>
      <div className="h-1 w-full" style={{ backgroundColor: primary }} />

      {/* Brand section */}
      <div className="border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center gap-3">
            {logoSrc && (
              <Image src={logoSrc} alt={vendor.company_name || "Company logo"} width={56} height={56} className="h-14 w-14 object-contain rounded-xl bg-white/10 p-1" unoptimized />
            )}
            <p className="text-2xl font-extrabold leading-tight" style={{ color: text }}>{vendor.company_name || "Vendor"}</p>
          </div>
          {vendor.short_description && (
            <p className="text-sm opacity-50 max-w-md leading-relaxed" style={{ color: text }}>{vendor.short_description}</p>
          )}
          {/* Social icons in brand section only when social_media block is active */}
          {socialRow}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Quick Links (always shown) */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: primary }}>Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l, i) => (
                <li key={i}>{renderQuickLink(l)}</li>
              ))}
              {quickLinks.length === 0 && (
                <li><span className="text-sm opacity-30 italic" style={{ color: text }}>No pages yet</span></li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: primary }}>Contact Us</h3>
            <div className="space-y-2.5">
              {vendor.company_address && <p className="flex items-start gap-2 text-sm opacity-60" style={{ color: text }}><span className="shrink-0 mt-0.5">📍</span><span>{vendor.company_address}</span></p>}
              {vendor.company_contact && <p className="flex items-center gap-2 text-sm opacity-60" style={{ color: text }}><span className="shrink-0">📞</span><a href={`tel:${vendor.company_contact}`} className="hover:opacity-100">{vendor.company_contact}</a></p>}
              {vendor.company_email   && <p className="flex items-center gap-2 text-sm opacity-60" style={{ color: text }}><span className="shrink-0">✉</span><a href={`mailto:${vendor.company_email}`} className="hover:opacity-100 break-all">{vendor.company_email}</a></p>}
            </div>
          </div>

          {/* Newsletter (only when newsletter block is enabled in theme) */}
          {hasNewsletter && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: primary }}>Newsletter</h3>
              <p className="text-sm opacity-50 mb-4" style={{ color: text }}>Subscribe to get the latest updates.</p>
              <div className="flex flex-col gap-3">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email..."
                  className="h-11 px-4 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/50 transition-all" />
                <button type="button" onClick={handleNewsletterSubscribe} disabled={newsletterMutation.isPending} className="h-11 px-6 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60" style={{ backgroundColor: primary }}>
                  {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
                </button>
                {newsletterMessage && <p className="text-xs font-semibold opacity-70" style={{ color: text }}>{newsletterMessage}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs opacity-40" style={{ color: text }}>&copy; {year} {vendor.copywrite || vendor.company_name}. All rights reserved.</p>
          {vendor.poweredby && <p className="text-xs opacity-30" style={{ color: text }}>Powered by {vendor.poweredby}</p>}
        </div>
      </div>
    </footer>
  );
}
