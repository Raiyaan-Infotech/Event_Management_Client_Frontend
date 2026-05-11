"use client";

import React from "react";
import {
  Palette, Quote, Star, Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, Linkedin, Youtube
} from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { VendorPreviewData } from "@/hooks/use-vendor-preview";
import Image from "next/image";
import Link from "next/link";
import { normalizeHomeBlocks } from "@/lib/safe-json";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const imgUrl = (path?: string | null) =>
  resolveMediaUrl(path);

const stripHtml = (html?: string | null) =>
  (html ?? "").replace(/<[^>]*>/g, "").trim();

const parsePreviewNavMenu = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const previewMenuLabels = (vendorData?: VendorPreviewData) => {
  const savedMenu = parsePreviewNavMenu((vendorData?.vendor as any)?.nav_menu);
  const pageGroups = savedMenu
    .filter((item) => !["home", "about", "contact"].includes(item.type || ""))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!pageGroups.length && vendorData?.pages?.length) {
    pageGroups.push({ label: "Pages", order: 2 });
  }

  return ["Home", "About Us", ...pageGroups.map((item) => item.label || "Pages"), "Contact Us"];
};

// ─── Icon map ─────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  Facebook, Twitter, Instagram, Linkedin, Youtube, youtube: Youtube,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ThemeColors {
  header: string;
  footer: string;
  primary: string;
  secondary: string;
  hover: string;
  text: string;
}

interface ThemePreviewProps {
  themeId: number | string;
  colors?: ThemeColors;
  className?: string;
  isFullPage?: boolean;
  vendorData?: VendorPreviewData;
}

// ─── Testimonial Slider ───────────────────────────────────────────────────────
const TestimonialSlider = ({
  testimonials,
  colors,
  isFullPage,
  variant = "light",
}: {
  testimonials: VendorPreviewData["testimonials"];
  colors?: ThemeColors;
  isFullPage?: boolean;
  variant?: "light" | "dark";
}) => {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const isLight = variant === "light";

  if (!testimonials.length) {
    return (
      <div className={cn(
        "w-full max-w-md mx-auto py-8 text-center font-bold uppercase tracking-widest text-[10px] border-2 border-dashed rounded-2xl",
        isLight ? "text-gray-400 border-gray-200" : "text-white/40 border-white/20"
      )}>
        No testimonials added yet.
      </div>
    );
  }

  const testimonial = testimonials[current];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Quote */}
      <div className="space-y-4 text-center px-10 relative w-full">
        <p className={cn(
          "font-bold leading-relaxed italic mx-auto transition-all",
          isLight ? "text-gray-800" : "text-white",
          isFullPage ? "text-[26px] max-w-[900px]" : "text-[18px] max-w-[700px]"
        )}>
          "{stripHtml(testimonial.client_feedback)}"
        </p>
      </div>

      {/* Avatar + Name */}
      <div className={cn("flex flex-col items-center transition-all", isFullPage ? "gap-6 mt-10" : "gap-3 mt-4")}>
        <div className={cn(
          "relative rounded-full border-4 border-white shadow-2xl overflow-hidden transition-all",
          isLight ? "bg-gray-300" : "bg-white/20 border-white/40",
          isFullPage ? "size-24" : "size-16"
        )}>
          {testimonial.customer_portrait ? (
            <Image
              src={imgUrl(testimonial.customer_portrait)}
              alt={testimonial.customer_name}
              fill
              sizes={isFullPage ? "96px" : "64px"}
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center font-bold",
              isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-white text-xl"
            )}>
              {testimonial.customer_name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="text-center">
          <span className={cn(
            "font-black uppercase block tracking-tighter transition-all",
            isLight ? "text-gray-900" : "text-white",
            isFullPage ? "text-[18px]" : "text-[12px]"
          )}>
            {testimonial.customer_name}
          </span>
          <span
            className={cn(
              "font-black uppercase transition-all mt-1 block",
              isFullPage ? "text-[12px] tracking-[0.3em]" : "text-[9px] tracking-[0.2em]",
              !colors?.primary && (isLight ? "text-blue-600" : "text-white/60")
            )}
            style={{ color: colors?.primary || undefined }}
          >
            {testimonial.event_name || "Client"}
          </span>
        </div>
      </div>

      {/* Dots */}
      {testimonials.length > 1 && (
        <div className={cn("flex items-center gap-2", isFullPage ? "mt-8" : "mt-5")}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? cn("h-2 w-6", !colors?.primary && (isLight ? "bg-blue-600" : "bg-white"))
                  : cn("size-2", isLight ? "bg-gray-300 hover:bg-gray-400" : "bg-white/30 hover:bg-white/50")
              )}
              style={i === current && colors?.primary ? { backgroundColor: colors.primary } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MiniNavbar ───────────────────────────────────────────────────────────────
export const MiniNavbar = ({
  colors, isFullPage, vendorData,
}: {
  colors?: ThemeColors; isFullPage?: boolean; vendorData?: VendorPreviewData;
}) => {
  const companyName = vendorData?.vendor?.company_name || "Sample";
  const companyLogo = vendorData?.vendor?.company_logo ? imgUrl(vendorData.vendor.company_logo) : null;
  const city = vendorData?.vendor?.locality?.name || "City";
  const navLabels = previewMenuLabels(vendorData);
  const slug = (vendorData as any)?.slug;
  const registerHref = slug === "preview" ? "/preview?previewPage=register" : (slug ? `/${slug}/register` : "#");
  const loginHref = slug === "preview" ? "/preview?previewPage=login" : (slug ? `/${slug}/login` : "#");
  const homeBlocks = normalizeHomeBlocks(vendorData?.home_blocks);
  const showRegister = homeBlocks.some((block) => block.block_type === "register" && block.is_visible);

  const links = (
    <div className={cn("hidden min-[450px]:flex items-center", isFullPage ? "gap-8" : "gap-4")}>
      {navLabels.map((label, index) => (
        <span
          key={`${label}-${index}`}
          className={cn(
            "font-bold uppercase tracking-wider cursor-pointer transition-all",
            isFullPage ? "text-[12px]" : "text-[9px]",
            index === 0 ? "border-b-2" : "text-gray-500 hover:text-gray-900",
            index === 0 && !colors?.primary && "text-gray-900 border-blue-600"
          )}
          style={index === 0 ? { color: colors?.primary || undefined, borderBottomColor: colors?.primary || undefined } : undefined}
        >
          {label}
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20 transition-all", isFullPage ? "px-10 py-4" : "px-4 py-2")}>
      <div className={cn("flex items-center", !isFullPage && "gap-8")}>
        <div className="flex items-center gap-3">
          <div className={cn("relative rounded-[8px] flex items-center justify-center shadow-lg transition-all", isFullPage ? "size-10" : "size-7", !colors?.primary && "bg-blue-600")}
            style={{ backgroundColor: colors?.primary || undefined, boxShadow: colors?.primary ? `0 10px 15px -3px ${colors.primary}33` : undefined }}>
            {companyLogo
              ? <Image src={companyLogo} alt={companyName} fill sizes={isFullPage ? "40px" : "28px"} className="object-contain p-1" unoptimized />
              : <Palette size={isFullPage ? 20 : 14} className="text-white" />}
          </div>
          <div className="flex flex-col leading-none">
            <span className={cn("font-black uppercase text-gray-900 tracking-tighter", isFullPage ? "text-[18px]" : "text-[12px]")}>{companyName}</span>
            <span className={cn("font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap", isFullPage ? "text-[10px]" : "text-[7px]")}>{city}</span>
          </div>
        </div>
        {!isFullPage && links}
      </div>
      <div className={cn("flex items-center", isFullPage ? "gap-10" : "gap-2")}>
        {isFullPage && links}
        <div className={cn("flex items-center", isFullPage ? "gap-4" : "gap-2")}>
          {showRegister ? (
            <Link href={registerHref} className={cn("rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center", isFullPage ? "px-6 py-2.5" : "px-3 py-1.5", !colors?.primary && "bg-blue-600")}
              style={{ backgroundColor: colors?.primary || undefined, boxShadow: colors?.primary ? `0 4px 6px -1px ${colors.primary}1A` : undefined }}>
              <span className={cn("font-black text-white uppercase tracking-widest", isFullPage ? "text-[11px]" : "text-[8px]")}>Register</span>
            </Link>
          ) : null}
          <Link href={loginHref} className={cn("border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group flex items-center justify-center", isFullPage ? "px-6 py-2.5" : "px-3 py-1.5")}>
            <span className={cn("font-black text-gray-600 group-hover:text-gray-900 uppercase tracking-widest", isFullPage ? "text-[11px]" : "text-[8px]")}>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── MiniFooter ───────────────────────────────────────────────────────────────
export const MiniFooter = ({
  colors, isFullPage, vendorData,
}: {
  colors?: ThemeColors; isFullPage?: boolean; vendorData?: VendorPreviewData;
}) => (
  <div
    className={cn("border-t border-white/5 flex flex-col transition-all", isFullPage ? "px-16 py-16 gap-16" : "px-10 py-10 gap-10")}
    style={{ backgroundColor: colors?.footer || "#0a0a0a" }}
  >
    <div className={cn("grid grid-cols-4", isFullPage ? "gap-12" : "gap-6")}>
      {/* Company Info */}
      <div className="space-y-7">
        <div className="flex items-center gap-4">
          <div className={cn("relative rounded-xl flex items-center justify-center shadow-lg transition-all", isFullPage ? "size-10" : "size-6", !colors?.primary && "bg-blue-600")}
            style={{ backgroundColor: colors?.primary || undefined }}>
            {vendorData?.vendor?.company_logo
              ? <Image src={imgUrl(vendorData.vendor.company_logo)} alt={vendorData.vendor.company_name} fill sizes={isFullPage ? "40px" : "24px"} className="object-contain p-1" unoptimized />
              : <Palette size={isFullPage ? 20 : 12} className="text-white" />}
          </div>
          <span className={cn("font-black text-white uppercase tracking-tighter", isFullPage ? "text-[20px]" : "text-[12px]")}>
            {vendorData?.vendor?.company_name || "Sample Company"}
          </span>
        </div>
        <p className={cn("text-gray-400 font-medium leading-relaxed", isFullPage ? "text-[14px] max-w-[350px]" : "text-[9px] max-w-[200px]")}>
          {stripHtml(vendorData?.vendor?.short_description) || "Creating unforgettable moments with professional event management solutions."}
        </p>
      </div>

      {/* Social Links */}
      <div className="space-y-7">
        <span className={cn("font-black text-white uppercase tracking-widest block", isFullPage ? "text-[14px]" : "text-[10px]")}>Social Links</span>
        <div className={cn("flex items-center flex-wrap transition-all", isFullPage ? "gap-4" : "gap-3")}>
          {vendorData?.socialLinks
            ?.filter((link) => link.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((link) => {
              const IconComponent = iconMap[link.icon];
              return IconComponent ? (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  className={cn(
                    "bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer",
                    isFullPage ? "size-10" : "size-8"
                  )}
                >
                  <IconComponent size={isFullPage ? 18 : 14} style={{ color: link.icon_color }} />
                </Link>
              ) : null;
            })}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-7">
        <span className={cn("font-black text-white uppercase tracking-widest block", isFullPage ? "text-[14px]" : "text-[10px]")}>Contact Info</span>
        <div className="flex flex-col gap-5">
          {[
            { icon: Phone,  value: vendorData?.vendor?.company_contact || "+91 9876543210" },
            { icon: Mail,   value: vendorData?.vendor?.company_email   || "hello@company.com" },
            { icon: MapPin, value: vendorData?.vendor?.company_address || "123 Event St, Gala City" },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-3">
              <div className={cn("flex items-center justify-center rounded-lg bg-white/5 border border-white/10", isFullPage ? "size-10" : "size-7")}>
                <Icon size={isFullPage ? 18 : 12} className="text-gray-400" />
              </div>
              <span className={cn("text-gray-400 font-bold", isFullPage ? "text-[13px]" : "text-[9px]")}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="space-y-7">
        <span className={cn("font-black text-white uppercase tracking-widest block", isFullPage ? "text-[14px]" : "text-[10px]")}>Newsletter</span>
        <div className="flex flex-col gap-4">
          <p className={cn("text-gray-500 font-bold", isFullPage ? "text-[12px]" : "text-[8px]")}>Subscribe for latest updates and event news.</p>
          <div className={cn("bg-white/5 border border-white/10 rounded-lg flex items-center", isFullPage ? "px-4 py-2" : "px-2 py-1")}>
            <span className={cn("text-gray-600 font-bold", isFullPage ? "text-[11px]" : "text-[8px]")}>Email Address</span>
          </div>
          <div
            className={cn("rounded-lg flex items-center justify-center font-black text-white uppercase tracking-widest transition-all cursor-pointer shadow-lg", isFullPage ? "w-fit px-5 py-2 text-[10px] self-end" : "w-fit px-3 py-1 text-[7px] self-end", !colors?.primary && "bg-blue-600 shadow-blue-600/20")}
            style={{ backgroundColor: colors?.primary || undefined, boxShadow: colors?.primary ? `0 10px 15px -3px ${colors.primary}33` : undefined }}
          >
            Subscribe
          </div>
        </div>
      </div>
    </div>

    <div className={cn("flex justify-between items-center pt-8 border-t border-white/5 font-bold text-gray-500 uppercase tracking-widest", isFullPage ? "text-[11px]" : "text-[8px]")}>
      <span>© 2026 {vendorData?.vendor?.company_name || "Sample Company"}. {vendorData?.vendor?.copywrite || "All rights reserved."}</span>
      <div className="flex gap-4 items-center">
        <span>Powered By</span>
        <span className="text-white">{vendorData?.vendor?.poweredby || "Sample Tech"}</span>
      </div>
    </div>
  </div>
);

// ─── Theme 1 ──────────────────────────────────────────────────────────────────
const Theme1Preview = ({
  colors, isFullPage, vendorData,
}: {
  colors?: ThemeColors; isFullPage?: boolean; vendorData?: VendorPreviewData;
}) => (
  <div className={cn("w-full flex flex-col bg-white transition-all duration-500", isFullPage ? "min-h-screen" : "h-full overflow-y-auto custom-scrollbar-hidden select-none pointer-events-none")}>
    <MiniNavbar colors={colors} isFullPage={isFullPage} vendorData={vendorData} />

    {/* About Us */}
    <div className={cn("bg-white relative overflow-hidden transition-all", isFullPage ? "p-16 space-y-12" : "p-6 space-y-8")}>
      <div className="absolute top-0 right-0 opacity-[0.03]">
        <Palette className={cn("rotate-12 transition-all", isFullPage ? "size-[600px]" : "size-80")} />
      </div>
      <div className={cn("relative z-10 flex flex-col items-center", isFullPage ? "gap-16" : "gap-8")}>
        <div className="space-y-3 text-center">
          <span className={cn("font-black uppercase transition-all", isFullPage ? "text-[14px] tracking-[0.5em]" : "text-[10px] tracking-[0.3em]", !colors?.primary && "text-blue-600")}
            style={{ color: colors?.primary || undefined }}>
            About us
          </span>
          <h2 className={cn("font-black text-gray-900 leading-[1.1] tracking-tight mx-auto transition-all", isFullPage ? "text-[48px] max-w-[800px]" : "text-[22px] max-w-[400px]")}>
            {vendorData?.vendor?.short_description || "Crafting Memorable Experiences Since 2010"}
          </h2>
          <p className={cn("text-gray-500 mx-auto leading-relaxed font-medium transition-all text-center px-4", isFullPage ? "text-[16px] max-w-[600px]" : "text-[11px] max-w-[350px]")}>
            {stripHtml(vendorData?.vendor?.about_us) || "We specialize in premium wedding planning, corporate gala events, and exclusive private celebrations."}
          </p>
        </div>

        <div className={cn("flex items-center mx-auto transition-all", isFullPage ? "gap-16 w-full max-w-5xl px-8" : "gap-12 px-6")}>
          <div className="flex-1 space-y-6 text-left">
            <div className="space-y-3">
              <span className={cn("font-black text-gray-900 block tracking-tight transition-all", isFullPage ? "text-[28px]" : "text-[14px]")}>Who We Exactly Are</span>
              <p className={cn("text-gray-500 leading-relaxed font-medium transition-all text-left", isFullPage ? "text-[16px]" : "text-[11px]")}>
                {vendorData?.vendor?.company_information || "Our team of dedicated experts works tirelessly to bring your creative vision to life."}
              </p>
            </div>
          </div>
          <div className={cn("bg-gray-50 border border-gray-100 shadow-2xl flex items-center justify-center relative overflow-hidden group transition-all shrink-0", isFullPage ? "size-[350px] rounded-[4.5rem]" : "size-48 rounded-[2.5rem]")}>
            <Image
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
              alt="Event"
              fill
              sizes={isFullPage ? "350px" : "192px"}
              className="object-cover scale-110 transition-transform duration-1000 group-hover:scale-100"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>

    {/* Testimonials */}
    <div className={cn("bg-gray-50 flex flex-col items-center border-y border-gray-100 relative overflow-hidden transition-all", isFullPage ? "p-24 gap-12" : "p-10 gap-6")}>
      <div className="flex flex-col items-center text-center space-y-4 mb-4">
        <span className={cn("font-black uppercase transition-all", isFullPage ? "text-[14px] tracking-[0.5em]" : "text-[10px] tracking-[0.3em]", !colors?.primary && "text-blue-600")}
          style={{ color: colors?.primary || undefined }}>
          Testimonials
        </span>
        <div className={cn("w-12 h-1 rounded-full", !colors?.primary && "bg-blue-600")} style={{ backgroundColor: colors?.primary }} />
      </div>
      <div
        className={cn("rounded-full shadow-xl flex items-center justify-center border border-white transition-all", isFullPage ? "size-24 mb-4" : "size-16 mb-2", !colors?.primary && "bg-blue-600 shadow-blue-600/20")}
        style={{ backgroundColor: colors?.primary || undefined, boxShadow: colors?.primary ? `0 15px 30px -5px ${colors.primary}4D` : undefined }}
      >
        <Quote size={isFullPage ? 40 : 24} className="text-white" />
      </div>
      <TestimonialSlider
        testimonials={vendorData?.testimonials ?? []}
        colors={colors}
        isFullPage={isFullPage}
        variant="light"
      />
    </div>

    {/* Gallery — all images from all events */}
    <div className={cn("bg-white transition-all", isFullPage ? "p-16 space-y-12" : "p-8 space-y-8")}>
      <div className="flex flex-col items-center text-center space-y-3">
        <span className={cn("font-black text-gray-900 block tracking-tight leading-none transition-all", isFullPage ? "text-[42px]" : "text-[24px]")}>Event Gallery</span>
        <p className={cn("text-gray-400 font-bold uppercase tracking-[0.2em] transition-all text-center", isFullPage ? "text-[12px]" : "text-[10px]")}>
          A visual journey of our most prestigious celebrations.
        </p>
        <div className={cn("w-16 h-1 rounded-full", !colors?.primary && "bg-blue-600")} style={{ backgroundColor: colors?.primary }} />
      </div>

      {(() => {
        // Flatten all images across all gallery events
        const allImages = (vendorData?.gallery ?? [])
          .flatMap((item) =>
            (Array.isArray(item.images) ? item.images : [item.images]).map((img) => ({
              src: img,
              event_name: item.event_name,
              city: item.city,
              id: item.id,
            }))
          )
          .slice(0, 9);

        return allImages.length ? (
          <div className={cn("grid transition-all", isFullPage ? "grid-cols-3 gap-6" : "grid-cols-2 gap-4")}>
            {allImages.map((img, idx) => (
              <div
                key={`${img.id}-${idx}`}
                className={cn("relative group overflow-hidden bg-gray-100 transition-all cursor-pointer shadow-lg aspect-[4/3]", isFullPage ? "rounded-[1.5rem]" : "rounded-xl")}
              >
                <Image
                  src={imgUrl(img.src)}
                  alt={img.event_name || "Gallery Image"}
                  fill
                  sizes={isFullPage ? "33vw" : "50vw"}
                  className="object-cover transition-all duration-1000 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={isFullPage ? 12 : 8} style={{ color: colors?.primary }} />
                      <span className={cn("text-white/80 font-black uppercase tracking-[0.2em]", isFullPage ? "text-[9px]" : "text-[7px]")}>{img.city || "Location"}</span>
                    </div>
                    <h4 className={cn("text-white font-black uppercase tracking-tighter leading-none transition-all", isFullPage ? "text-[18px]" : "text-[12px]")}>{img.event_name || "Event"}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed rounded-2xl border-gray-200">
            No gallery images uploaded yet.
          </div>
        );
      })()}
    </div>

    {/* Newsletter / Subscription */}
    <div className={cn("transition-all", isFullPage ? "px-16 py-16" : "px-8 py-10")}
      style={{ backgroundColor: colors?.primary ? `${colors.primary}12` : "#eff6ff" }}>
      <div className={cn("flex flex-col items-center text-center", isFullPage ? "gap-8 max-w-2xl mx-auto" : "gap-5 max-w-xl mx-auto")}>
        <div className="space-y-3">
          <span className={cn("font-black uppercase block transition-all", isFullPage ? "text-[14px] tracking-[0.5em]" : "text-[10px] tracking-[0.3em]", !colors?.primary && "text-blue-600")}
            style={{ color: colors?.primary || undefined }}>
            Newsletter
          </span>
          <h3 className={cn("font-black text-gray-900 tracking-tight leading-tight transition-all", isFullPage ? "text-[36px]" : "text-[20px]")}>
            Stay in the Loop
          </h3>
          <p className={cn("text-gray-500 font-medium transition-all", isFullPage ? "text-[15px]" : "text-[10px]")}>
            Subscribe for the latest event updates, exclusive offers, and news delivered straight to your inbox.
          </p>
        </div>
        <div className={cn("flex w-full transition-all", isFullPage ? "gap-4 max-w-lg" : "gap-2 max-w-sm")}>
          <div className={cn("flex-1 bg-white border border-gray-200 rounded-xl flex items-center shadow-sm", isFullPage ? "px-5 py-3" : "px-3 py-2")}>
            <Mail size={isFullPage ? 16 : 11} className="text-gray-400 mr-2 shrink-0" />
            <span className={cn("text-gray-400 font-medium", isFullPage ? "text-[13px]" : "text-[9px]")}>Enter your email address</span>
          </div>
          <div
            className={cn("rounded-xl font-black text-white uppercase tracking-widest cursor-pointer shadow-lg flex items-center justify-center shrink-0 transition-all", isFullPage ? "px-6 py-3 text-[11px]" : "px-3 py-2 text-[8px]", !colors?.primary && "bg-blue-600 shadow-blue-600/20")}
            style={{ backgroundColor: colors?.primary || undefined, boxShadow: colors?.primary ? `0 8px 20px -4px ${colors.primary}55` : undefined }}
          >
            Subscribe
          </div>
        </div>
      </div>
    </div>

    <MiniFooter colors={colors} isFullPage={isFullPage} vendorData={vendorData} />
  </div>
);

// ─── Theme 2 ──────────────────────────────────────────────────────────────────
const Theme2Preview = ({
  colors, isFullPage, vendorData,
}: {
  colors?: ThemeColors; isFullPage?: boolean; vendorData?: VendorPreviewData;
}) => (
  <div className={cn("w-full flex flex-col bg-[#050505] transition-all duration-500", isFullPage ? "min-h-screen" : "h-full overflow-y-auto custom-scrollbar-hidden select-none pointer-events-none")}>
    <div className="bg-white">
      <MiniNavbar colors={colors} isFullPage={isFullPage} vendorData={vendorData} />
    </div>

    {/* Hero */}
    <div className={cn("relative w-full flex items-center justify-center overflow-hidden transition-all", isFullPage ? "h-[85vh] min-h-[750px]" : "h-[400px]")}>
      <div className="absolute inset-0"
        style={{ background: colors?.header ? `linear-gradient(to bottom right, ${colors.header}, ${colors.footer}, #000)` : "linear-gradient(to bottom right, #312e81, #581c87, #000)" }} />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:40px_40px]" />
      <div className={cn("relative z-10 flex flex-col items-center text-center px-8 transition-all", isFullPage ? "gap-12" : "gap-6")}>
        <div className={cn("transition-all", isFullPage ? "space-y-12" : "space-y-4")}>
          <span className={cn("bg-white/10 border border-white/20 rounded-full font-black text-white uppercase backdrop-blur-3xl shadow-2xl transition-all", isFullPage ? "px-8 py-3 text-[12px] tracking-[0.5em]" : "px-4 py-1.5 text-[8px] tracking-[0.3em]")}>
            Global Premium Management
          </span>
          <h1 className={cn("font-black text-white leading-[1.05] tracking-tighter transition-all", isFullPage ? "text-[72px]" : "text-[32px]")}>
            EXPERIENCE THE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r"
              style={{ backgroundImage: colors?.primary ? `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` : "linear-gradient(to right, #a855f7, #60a5fa)" }}>
              UNEXPECTED MOMENTS
            </span>
          </h1>
          <p className={cn("text-white/60 mx-auto font-bold leading-relaxed tracking-wide transition-all", isFullPage ? "text-[16px] max-w-[500px]" : "text-[11px] max-w-[350px]")}>
            {vendorData?.vendor?.short_description || "Bespoke luxury events tailored to your unique style and vision."}
          </p>
        </div>
        <div className={cn("bg-white rounded-full shadow-[0_15px_30px_rgba(255,255,255,0.2)] flex items-center justify-center font-black tracking-[0.2em] hover:scale-105 transition-all text-black cursor-pointer", isFullPage ? "px-12 py-4 text-[13px]" : "px-8 py-3 text-[11px]")}>
          BOOK YOUR EVENT
        </div>
      </div>
    </div>

    {/* About Us — dark */}
    <div className={cn("bg-[#0d0d0d] transition-all", isFullPage ? "p-16 space-y-12" : "p-8 space-y-8")}>
      <div className={cn("flex flex-col items-center text-center", isFullPage ? "gap-6" : "gap-4")}>
        <span className={cn("font-black uppercase transition-all", isFullPage ? "text-[14px] tracking-[0.5em]" : "text-[10px] tracking-[0.3em]", !colors?.primary && "text-purple-400")}
          style={{ color: colors?.primary || undefined }}>
          About us
        </span>
        <h2 className={cn("font-black text-white leading-[1.1] tracking-tight mx-auto transition-all", isFullPage ? "text-[48px] max-w-[800px]" : "text-[22px] max-w-[400px]")}>
          {vendorData?.vendor?.short_description || "Crafting Memorable Experiences"}
        </h2>
        <p className={cn("text-gray-400 mx-auto leading-relaxed font-medium transition-all", isFullPage ? "text-[16px] max-w-[600px]" : "text-[11px] max-w-[350px]")}>
          {stripHtml(vendorData?.vendor?.about_us) || "We specialize in premium events and exclusive private celebrations across the globe."}
        </p>
        <p className={cn("text-gray-500 mx-auto leading-relaxed font-medium transition-all", isFullPage ? "text-[15px] max-w-[600px]" : "text-[10px] max-w-[350px]")}>
          {vendorData?.vendor?.company_information || "Our team of dedicated experts works tirelessly to bring your creative vision to life."}
        </p>
      </div>
    </div>

    {/* Portfolio */}
    <div className={cn("bg-white transition-all", isFullPage ? "p-12 space-y-16" : "p-8 space-y-12")}>
      <h2 className={cn("font-black text-gray-900 leading-none transition-all", isFullPage ? "text-[56px] tracking-[-0.04em]" : "text-[32px] tracking-tight")}>
        Portfolio
      </h2>

      {/* Events — stat counters */}
      {(() => {
        const events = vendorData?.portfolio?.events ?? [];
        return (
          <div className={cn("transition-all", isFullPage ? "space-y-8" : "space-y-5")}>
            <div className="border-b-2 border-gray-100 pb-6 space-y-1">
              <h3 className={cn("font-black text-gray-900 tracking-tighter uppercase leading-none transition-all", isFullPage ? "text-[40px]" : "text-[20px]")}>Events</h3>
              <span className={cn("font-black uppercase transition-all", isFullPage ? "text-[13px] tracking-[0.5em]" : "text-[9px] tracking-[0.3em]", !colors?.primary && "text-purple-600")}
                style={{ color: colors?.primary || undefined }}>
                MEMORABLE MOMENTS
              </span>
            </div>
            {events.length > 0 ? (
              <div
                className={cn("grid border border-gray-100 rounded-[2rem] overflow-hidden divide-x divide-gray-100 bg-white shadow-xl shadow-gray-200/50 transition-all", isFullPage ? "h-40" : "h-24")}
                style={{ gridTemplateColumns: `repeat(${events.length}, 1fr)` }}
              >
                {[...events]
                  .sort((a: any, b: any) => a.sort_order - b.sort_order)
                  .map((ev: any) => (
                    <div key={ev.id} className="flex flex-col items-center justify-center text-center space-y-2 hover:bg-gray-50/50 transition-colors px-2">
                      <span className={cn("font-black tracking-tighter transition-all", isFullPage ? "text-[42px]" : "text-xl")}
                        style={{ color: colors?.primary || undefined }}>
                        {ev.value}
                      </span>
                      <span className={cn("font-black text-gray-400 uppercase leading-tight transition-all", isFullPage ? "text-[11px] tracking-widest px-4" : "text-[7px] tracking-wider")}>
                        {ev.label}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="w-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed rounded-2xl border-gray-200">
                No event stats added yet.
              </div>
            )}
          </div>
        );
      })()}

      {/* Clients & Sponsors */}
      {(["clients", "sponsors"] as const).map((type) => {
        const items = vendorData?.portfolio?.[type] ?? [];
        const title = type === "clients" ? "Clients" : "Sponsors";
        const sub   = type === "clients" ? "TRUSTED PARTNERS" : "GLOBAL SUPPORT";
        return (
          <div key={type} className={cn("transition-all", isFullPage ? "space-y-8" : "space-y-5")}>
            <div className="border-b-2 border-gray-100 pb-6 space-y-1">
              <h3 className={cn("font-black text-gray-900 tracking-tighter uppercase leading-none transition-all", isFullPage ? "text-[40px]" : "text-[20px]")}>{title}</h3>
              <span className={cn("font-black uppercase transition-all", isFullPage ? "text-[13px] tracking-[0.5em]" : "text-[9px] tracking-[0.3em]", !colors?.primary && "text-purple-600")}
                style={{ color: colors?.primary || undefined }}>
                {sub}
              </span>
            </div>
            {items.length > 0 ? (
              <div className={cn("grid grid-cols-4", isFullPage ? "gap-8" : "gap-4")}>
                {items.slice(0, 4).map((item: any) => (
                  <div key={item.id}
                    className={cn("group hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center", isFullPage ? "p-6" : "p-3")}>
                    <div className={cn("flex items-center justify-center w-full bg-gray-50 border border-gray-100 rounded-2xl", isFullPage ? "h-36" : "h-20")}>
                      {item.image_path ? (
                        <Image
                          src={imgUrl(item.image_path)}
                          alt={item.label || title}
                          width={180}
                          height={120}
                          className="max-h-[75%] max-w-[75%] object-contain transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <span className={cn("font-bold text-gray-300 uppercase tracking-widest", isFullPage ? "text-[11px]" : "text-[8px]")}>No Image</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed rounded-2xl border-gray-200">
                No {type} added yet.
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* Gallery — all images */}
    <div className={cn("bg-[#0d0d0d] transition-all", isFullPage ? "p-16 space-y-12" : "p-8 space-y-8")}>
      <div className="flex flex-col items-start space-y-3">
        <span className={cn("font-black text-white block tracking-tight leading-none transition-all", isFullPage ? "text-[42px]" : "text-[24px]")}>Event Gallery</span>
        <div className={cn("w-16 h-1 rounded-full", !colors?.primary && "bg-purple-600")} style={{ backgroundColor: colors?.primary }} />
      </div>
      {(() => {
        const allImages = (vendorData?.gallery ?? [])
          .flatMap((item) =>
            (Array.isArray(item.images) ? item.images : [item.images]).map((img) => ({
              src: img, event_name: item.event_name, city: item.city, id: item.id,
            }))
          )
          .slice(0, 9);
        return allImages.length ? (
          <div className={cn("grid transition-all", isFullPage ? "grid-cols-3 gap-4" : "grid-cols-2 gap-3")}>
            {allImages.map((img, idx) => (
              <div key={`${img.id}-${idx}`}
                className={cn("relative group overflow-hidden bg-gray-900 transition-all cursor-pointer shadow-lg aspect-[4/3]", isFullPage ? "rounded-2xl" : "rounded-xl")}>
                <Image src={imgUrl(img.src)} alt={img.event_name || "Gallery"} fill sizes={isFullPage ? "33vw" : "50vw"} className="object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={cn("text-white/70 font-black uppercase tracking-[0.2em]", isFullPage ? "text-[9px]" : "text-[7px]")}>{img.city || "Location"}</span>
                  <h4 className={cn("text-white font-black uppercase tracking-tighter leading-none", isFullPage ? "text-[18px]" : "text-[12px]")}>{img.event_name || "Event"}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-600 font-bold uppercase tracking-widest text-xs border-2 border-dashed rounded-2xl border-gray-800">
            No gallery images uploaded yet.
          </div>
        );
      })()}
    </div>

    {/* Newsletter — dark */}
    <div className={cn("transition-all", isFullPage ? "px-16 py-16" : "px-8 py-10")}
      style={{ backgroundColor: colors?.primary || "#7c3aed" }}>
      <div className={cn("flex flex-col items-center text-center mx-auto", isFullPage ? "gap-8 max-w-2xl" : "gap-5 max-w-xl")}>
        <div className="space-y-3">
          <span className={cn("font-black text-white/60 uppercase block tracking-[0.5em] transition-all", isFullPage ? "text-[13px]" : "text-[9px]")}>Newsletter</span>
          <h3 className={cn("font-black text-white tracking-tight leading-tight transition-all", isFullPage ? "text-[36px]" : "text-[20px]")}>Stay in the Loop</h3>
          <p className={cn("text-white/60 font-medium transition-all", isFullPage ? "text-[15px]" : "text-[10px]")}>
            Subscribe for the latest event updates, exclusive offers, and news delivered to your inbox.
          </p>
        </div>
        <div className={cn("flex w-full transition-all", isFullPage ? "gap-4 max-w-lg" : "gap-2 max-w-sm")}>
          <div className={cn("flex-1 bg-white/10 border border-white/20 rounded-xl flex items-center backdrop-blur-sm", isFullPage ? "px-5 py-3" : "px-3 py-2")}>
            <Mail size={isFullPage ? 16 : 11} className="text-white/50 mr-2 shrink-0" />
            <span className={cn("text-white/40 font-medium", isFullPage ? "text-[13px]" : "text-[9px]")}>Enter your email address</span>
          </div>
          <div className={cn("bg-white rounded-xl font-black uppercase tracking-widest cursor-pointer flex items-center justify-center shrink-0 transition-all", isFullPage ? "px-6 py-3 text-[11px]" : "px-3 py-2 text-[8px]")}
            style={{ color: colors?.primary || "#7c3aed" }}>
            Subscribe
          </div>
        </div>
      </div>
    </div>

    {/* Testimonial */}
    <div className={cn("bg-[#0d0d0d] relative overflow-hidden transition-all", isFullPage ? "px-16 py-24" : "px-8 py-10")}>
      <div className="absolute -top-40 -right-40 opacity-5">
        <Quote size={isFullPage ? 400 : 180} className="text-white" />
      </div>
      <div className="flex flex-col items-center text-center">
        <span className={cn("font-black text-white/40 uppercase mb-8 transition-all", isFullPage ? "text-[14px] tracking-[0.8em]" : "text-[10px] tracking-[0.4em]")}>Testimonials</span>
        <div className={cn("flex justify-center mb-8 transition-all", isFullPage ? "gap-4" : "gap-2")}>
          {[1,2,3,4,5].map((i) => (
            <Star key={i} size={isFullPage ? 28 : 16} fill={colors?.primary || "#a855f7"} style={{ color: colors?.primary || "#a855f7" }} />
          ))}
        </div>
        <TestimonialSlider
          testimonials={vendorData?.testimonials ?? []}
          colors={colors}
          isFullPage={isFullPage}
          variant="dark"
        />
      </div>
    </div>

    <MiniFooter colors={colors} isFullPage={isFullPage} vendorData={vendorData} />
  </div>
);

// ─── ThemePreview (entry point) ───────────────────────────────────────────────
export const ThemePreview = ({ themeId, colors, className, isFullPage, vendorData }: ThemePreviewProps) => {
  const idNum = typeof themeId === "string" ? parseInt(themeId) : themeId;
  const layout = idNum % 2 === 0 ? 2 : 1;
  return (
    <div className={cn("w-full", isFullPage ? "min-h-screen h-auto" : "h-full", className)}>
      {layout === 1
        ? <Theme1Preview colors={colors} isFullPage={isFullPage} vendorData={vendorData} />
        : <Theme2Preview colors={colors} isFullPage={isFullPage} vendorData={vendorData} />}
    </div>
  );
};
