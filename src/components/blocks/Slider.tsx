"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const alignMap: Record<string, string> = {
  left:   "items-start text-left",
  center: "items-center text-center",
  right:  "items-end text-right",
};

export default function Slider({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const slides  = data?.sliders?.filter((s: any) => s.is_active) ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide  = slides[currentIndex];
  const colors = data?.colors || {};
  const vendor = data?.vendor || {};

  const primary = colors.primary_color || "#7c3aed";
  const header  = colors.header_color  || "#312e81";

  const title      = slide.title;
  const desc       = slide.description;
  const img        = slide.image_path;
  const btnLabel   = slide.button_label;
  const btnColor   = slide.button_color;
  const titleColor = slide.title_color;
  const descColor  = slide.description_color;
  const opacity    = (slide.overlay_opacity ?? 40) / 100;
  const align      = slide.content_alignment || "center";
  const alignClass = alignMap[align] || alignMap.center;
  const blur       = slide.image_blur ?? 0;
  const brightness = slide.image_brightness ?? 100;
  const imgStyle   = { filter: `blur(${blur}px) brightness(${brightness}%)` };
  const backgroundImage = (
    <Image src={img} alt="" fill sizes="100vw" className="object-cover" style={imgStyle} priority unoptimized />
  );

  const nextSlide = () => setCurrentIndex(p => (p + 1) % slides.length);
  const prevSlide = () => setCurrentIndex(p => (p - 1 + slides.length) % slides.length);

  const renderVariant = () => {
    // variant_1 — Cinematic Dark
    if (variant === "variant_1") return (
      <div className="w-full min-h-[460px] relative overflow-hidden flex items-center justify-center">
        {backgroundImage}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
        <div className={`relative z-10 flex flex-col px-8 gap-6 max-w-3xl w-full ${alignClass}`}>
          {vendor.company_name && (
            <span className="bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-[0.5em] px-6 py-2 rounded-full w-fit">
              {vendor.company_name}
            </span>
          )}
          {title    && <h1 className="text-5xl font-black leading-tight tracking-tight" style={{ color: titleColor }}>{title}</h1>}
          {desc     && <p  className="text-base font-medium max-w-xl leading-relaxed"   style={{ color: descColor }}>{desc}</p>}
          {btnLabel && <div className="w-fit px-8 py-3 rounded-xl font-black text-white text-sm uppercase tracking-widest cursor-pointer shadow-2xl" style={{ backgroundColor: btnColor }}>{btnLabel}</div>}
        </div>
      </div>
    );

    // variant_2 — Image Right
    if (variant === "variant_2") return (
      <div className="w-full min-h-[460px] relative overflow-hidden flex items-center" style={{ backgroundColor: header }}>
        <div className="absolute inset-y-0 right-0 w-3/5 overflow-hidden">
          <Image src={img} alt="" fill sizes="60vw" className="object-cover opacity-40" style={imgStyle} priority unoptimized />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${header}, transparent)` }} />
        </div>
        <div className="relative z-10 px-16 space-y-6 max-w-2xl">
          {vendor.company_name && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-0.5" style={{ backgroundColor: primary }} />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-white/60">{vendor.company_name}</span>
            </div>
          )}
          {title    && <h1 className="text-5xl font-black leading-tight tracking-tight" style={{ color: titleColor }}>{title}</h1>}
          {desc     && <p  className="text-base font-medium leading-relaxed"            style={{ color: descColor }}>{desc}</p>}
          {btnLabel && <div className="w-fit px-8 py-3 rounded-xl font-black text-white text-sm uppercase tracking-widest cursor-pointer shadow-lg" style={{ backgroundColor: btnColor }}>{btnLabel}</div>}
        </div>
      </div>
    );

    // variant_3 — Bottom Text
    if (variant === "variant_3") return (
      <div className="w-full min-h-[500px] relative overflow-hidden flex items-end pb-20">
        {backgroundImage}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
        <div className={`relative z-10 w-full flex flex-col px-8 gap-5 ${alignClass}`}>
          {title    && <h1 className="text-6xl font-black leading-none tracking-tight max-w-3xl" style={{ color: titleColor }}>{title}</h1>}
          {desc     && <p  className="text-base font-medium max-w-xl"                            style={{ color: descColor }}>{desc}</p>}
          {btnLabel && <div className="w-fit px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest cursor-pointer" style={{ backgroundColor: btnColor, color: "#fff" }}>{btnLabel}</div>}
        </div>
      </div>
    );

    // variant_4 — Center with overlay
    if (variant === "variant_4") return (
      <div className="w-full min-h-[420px] relative overflow-hidden flex items-center">
        {backgroundImage}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
        <div className={`relative z-10 flex flex-col w-full gap-6 py-12 px-8 ${alignClass}`}>
          {title    && <h1 className="text-4xl font-black leading-tight max-w-xl" style={{ color: titleColor }}>{title}</h1>}
          {desc     && <p  className="text-base font-medium max-w-lg leading-relaxed" style={{ color: descColor }}>{desc}</p>}
          {btnLabel && <div className="w-fit px-7 py-3 rounded-xl font-black text-white text-sm uppercase tracking-widest shadow-xl cursor-pointer" style={{ backgroundColor: btnColor }}>{btnLabel}</div>}
        </div>
      </div>
    );

    // variant_5 — Split Screen Light
    if (variant === "variant_5") return (
      <div className="w-full min-h-[400px] flex items-center relative overflow-hidden" style={{ backgroundColor: `${primary}10` }}>
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <Image src={img} alt="" fill sizes="50vw" className="object-cover opacity-25" style={imgStyle} priority unoptimized />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to left, transparent, ${primary}10)` }} />
        </div>
        <div className="relative z-10 max-w-lg px-12 space-y-5">
          {vendor.company_name && <span className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: primary }}>{vendor.company_name}</span>}
          {title    && <h1 className="text-4xl font-black leading-tight"          style={{ color: titleColor }}>{title}</h1>}
          {desc     && <p  className="text-base font-medium leading-relaxed"      style={{ color: descColor }}>{desc}</p>}
          {btnLabel && <div className="w-fit px-7 py-3 rounded-full font-black text-white text-sm uppercase tracking-widest shadow-lg cursor-pointer" style={{ backgroundColor: btnColor }}>{btnLabel}</div>}
        </div>
      </div>
    );

    // variant_6 — Full Gradient
    return (
      <div className="w-full min-h-[480px] relative overflow-hidden flex items-center justify-center">
        {backgroundImage}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
        <div className={`relative z-10 flex flex-col px-8 gap-6 max-w-3xl w-full ${alignClass}`}>
          {vendor.company_name && (
            <span className="bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-[0.5em] px-6 py-2 rounded-full w-fit backdrop-blur-sm">
              {vendor.company_name}
            </span>
          )}
          {title    && <h1 className="text-5xl font-black leading-tight tracking-tight" style={{ color: titleColor }}>{title}</h1>}
          {desc     && <p  className="text-base font-medium leading-relaxed max-w-lg"   style={{ color: descColor }}>{desc}</p>}
          {btnLabel && <div className="w-fit px-8 py-3 rounded-full font-black text-white text-sm uppercase tracking-widest cursor-pointer shadow-xl" style={{ backgroundColor: btnColor }}>{btnLabel}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="relative group w-full overflow-hidden">
      <div key={currentIndex} className="w-full">
        {renderVariant()}
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all z-20" aria-label="Previous">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all z-20" aria-label="Next">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
            {slides.map((_: unknown, i: number) => (
              <button key={i} onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
