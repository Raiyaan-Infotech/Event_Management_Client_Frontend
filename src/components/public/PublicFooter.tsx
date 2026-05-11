"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { PublicVendorData } from "@/hooks/use-public-vendor";

interface PublicFooterProps {
  vendor: PublicVendorData["vendor"];
  colors: PublicVendorData["colors"];
  socialLinks: PublicVendorData["socialLinks"];
  pages?: { id: number; name: string }[];
  slug: string;
  hasSocialMediaBlock?: boolean;
  hasTermsBlock?: boolean;
  hasPrivacyBlock?: boolean;
}

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

function IconMapPin() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function IconPhone() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

function IconMail() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

export function PublicFooter({
  vendor,
  colors,
  socialLinks,
  pages = [],
  slug,
  hasSocialMediaBlock = false,
  hasTermsBlock = false,
  hasPrivacyBlock = false,
}: PublicFooterProps) {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!vendor) return null;

  const footerBg    = colors?.footer_color   || "#1e293b";
  const primary     = colors?.primary_color  || "#3b82f6";
  const textColor   = "#e2e8f0";
  const year        = new Date().getFullYear();

  const activeSocialLinks  = (socialLinks ?? []).filter((l: any) => l.is_active === 1);
  const hasNewsletterBlock = (vendor as any).newsletter_status === 1;
  const isPreview = slug === "preview";
  const previewHref = (view: "terms" | "privacy" | "page", pageId?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("previewPage");
    params.delete("pageId");
    params.set("previewPage", view);
    if (pageId) params.set("pageId", String(pageId));
    return `/preview?${params.toString()}`;
  };

  const legalHrefForLabel = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized.includes("terms")) {
      return isPreview ? previewHref("terms") : `/${slug}/terms-conditions`;
    }
    if (normalized.includes("privacy")) {
      return isPreview ? previewHref("privacy") : `/${slug}/privacy-policy`;
    }
    return null;
  };

  // Quick links: vendor pages + conditional legal links
  const quickLinks: { label: string; href: string }[] = pages.map(p => ({
    label: p.name,
    href: legalHrefForLabel(p.name) || (isPreview ? previewHref("page", p.id) : `/${slug}/pages/${p.id}`),
  }));
  if (hasTermsBlock && !quickLinks.some(l => l.label.toLowerCase().includes("terms"))) {
    quickLinks.push({ label: "Terms & Conditions", href: isPreview ? previewHref("terms") : `/${slug}/terms-conditions` });
  } else {
    const index = quickLinks.findIndex(l => l.label.toLowerCase().includes("terms"));
    if (index >= 0) quickLinks[index].href = isPreview ? previewHref("terms") : `/${slug}/terms-conditions`;
  }
  if (hasPrivacyBlock && !quickLinks.some(l => l.label.toLowerCase().includes("privacy"))) {
    quickLinks.push({ label: "Privacy Policy", href: isPreview ? previewHref("privacy") : `/${slug}/privacy-policy` });
  } else {
    const index = quickLinks.findIndex(l => l.label.toLowerCase().includes("privacy"));
    if (index >= 0) quickLinks[index].href = isPreview ? previewHref("privacy") : `/${slug}/privacy-policy`;
  }

  const handleQuickLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isPreview) return;
    event.preventDefault();
    router.push(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full mt-auto" style={{ backgroundColor: footerBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Col 1: Company Info + Social */}
          <div className="space-y-4">
            {vendor.company_logo ? (
              <Image
                src={vendor.company_logo.startsWith("http") ? vendor.company_logo : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${vendor.company_logo}`}
                alt={vendor.company_name || "Company logo"}
                width={160}
                height={48}
                className="h-12 w-auto object-contain"
                unoptimized
              />
            ) : (
              <h3 className="font-bold text-xl" style={{ color: textColor }}>{vendor.company_name}</h3>
            )}

            {vendor.short_description && (
              <p className="text-sm opacity-70 leading-relaxed" style={{ color: textColor }}>{vendor.short_description}</p>
            )}

            <div className="pt-2 space-y-2">
              {vendor.company_address && (
                <p className="text-sm opacity-70 flex items-start gap-2" style={{ color: textColor }}>
                  <IconMapPin /><span>{vendor.company_address}</span>
                </p>
              )}
              {vendor.company_contact && (
                <p className="text-sm opacity-70 flex items-center gap-2" style={{ color: textColor }}>
                  <IconPhone />
                  <a href={`tel:${vendor.company_contact}`} className="hover:opacity-100 transition-opacity">{vendor.company_contact}</a>
                </p>
              )}
              {vendor.company_email && (
                <p className="text-sm opacity-70 flex items-center gap-2" style={{ color: textColor }}>
                  <IconMail />
                  <a href={`mailto:${vendor.company_email}`} className="hover:opacity-100 transition-opacity">{vendor.company_email}</a>
                </p>
              )}
            </div>

            {/* Social icons — gated on social_media block */}
            {hasSocialMediaBlock && activeSocialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {activeSocialLinks.map((link: any) => (
                  <a key={link.id} href={link.url || "#"} target="_blank" rel="noopener noreferrer" title={link.label}
                    className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center transition-all">
                    <SocialIcon icon={link.icon} color={link.icon_color || textColor} label={link.label} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          {quickLinks.length > 0 && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 opacity-70" style={{ color: textColor }}>Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} onClick={(event) => handleQuickLinkClick(event, l.href)} className="text-sm opacity-60 hover:opacity-100 transition-opacity" style={{ color: textColor }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 3: Newsletter — gated on newsletter block */}
          {hasNewsletterBlock && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 opacity-70" style={{ color: textColor }}>Newsletter</h3>
              <p className="text-sm opacity-50 mb-4" style={{ color: textColor }}>Subscribe to get the latest updates.</p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="h-11 px-4 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/50 transition-all"
                />
                <button
                  className="h-11 px-6 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: primary }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs opacity-50" style={{ color: textColor }}>
            &copy; {year} {vendor.copywrite || vendor.company_name}. All rights reserved.
          </p>
          {vendor.poweredby && (
            <p className="text-xs opacity-40" style={{ color: textColor }}>Powered by {vendor.poweredby}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
