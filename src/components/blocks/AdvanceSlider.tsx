"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

const alignMap: Record<string, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export default function AdvanceSlider({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const slides = (data?.sliders ?? []).filter((s: any) => s.is_active && s.type === "advanced");

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const colors = data?.colors || {};
  const vendor = data?.vendor || {};

  const primary = colors.primary_color || "#7c3aed";

  const img = resolveMediaUrl(slide.image_path);
  const title = slide.title;
  const desc = slide.description;
  const btnLabel = slide.button_label;
  const btnColor = slide.button_color;
  const titleColor = slide.title_color;
  const descColor = slide.description_color;
  const opacity = (slide.overlay_opacity ?? 40) / 100;
  const align = slide.content_alignment || "center";
  const alignClass = alignMap[align] || alignMap.center;
  const blur = slide.image_blur ?? 0;
  const brightness = slide.image_brightness ?? 100;
  const imgStyle = { filter: `blur(${blur}px) brightness(${brightness}%)` };
  const backgroundImage = (
    <Image src={img} alt="" fill sizes="100vw" className="object-cover" style={imgStyle} priority unoptimized />
  );

  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  const renderVariant = () => {
    if (variant === "variant_1") return (
      <div className="relative flex min-h-[460px] w-full items-center justify-center overflow-hidden">
        {backgroundImage}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
        <div className={`relative z-10 flex w-full max-w-3xl flex-col gap-6 px-8 ${alignClass}`}>
          {vendor.company_name && (
            <span className="w-fit rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-black uppercase tracking-[0.5em] text-white">
              {vendor.company_name}
            </span>
          )}
          {title && <h1 className="text-5xl font-black leading-tight tracking-tight" style={{ color: titleColor }}>{title}</h1>}
          {desc && <p className="max-w-xl text-base font-medium leading-relaxed" style={{ color: descColor }}>{desc}</p>}
          {btnLabel && <div className="w-fit cursor-pointer rounded-xl px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-2xl" style={{ backgroundColor: btnColor }}>{btnLabel}</div>}
        </div>
      </div>
    );

    if (variant === "variant_2") return (
      <div className="w-full bg-white px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-0 border border-gray-200 lg:grid-cols-[360px_1fr]">
          <aside className="flex min-h-[520px] flex-col justify-between bg-gray-950 p-8">
            <div className="space-y-5">
              {vendor.company_name && (
                <div className="flex items-center gap-3">
                  <div className="h-0.5 w-12" style={{ backgroundColor: primary }} />
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-white/55">{vendor.company_name}</span>
                </div>
              )}
              {title && <h1 className="text-5xl font-black leading-none text-white">{title}</h1>}
              {desc && <p className="text-sm font-medium leading-7 text-white/65">{desc}</p>}
              {btnLabel && (
                <div className="inline-flex px-7 py-3 text-xs font-black uppercase tracking-widest text-white" style={{ backgroundColor: btnColor || primary }}>
                  {btnLabel}
                </div>
              )}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2">
              {slides.slice(0, 6).map((s: any, i: number) => (
                <button
                  key={s.id || i}
                  onClick={() => setCurrent(i)}
                  className={`relative aspect-square overflow-hidden border ${i === current ? "border-white" : "border-white/10"}`}
                >
                  <Image src={resolveMediaUrl(s.image_path)} alt="" fill sizes="120px" className="object-cover" unoptimized />
                  <span className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-1 text-[9px] font-black text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </aside>
          <div className="relative min-h-[520px] overflow-hidden bg-gray-100">
            <Image src={img} alt="" fill sizes="(min-width: 1024px) calc(100vw - 360px), 100vw" className="object-cover" style={imgStyle} priority unoptimized />
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity * 0.45})` }} />
            {slides.length > 1 && (
              <div className="absolute bottom-6 right-6 z-20 flex gap-3">
                <button onClick={prev} className="flex h-11 w-11 items-center justify-center bg-white text-gray-950 hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={next} className="flex h-11 w-11 items-center justify-center text-white" style={{ backgroundColor: primary }}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <div className="relative flex min-h-[500px] w-full items-end overflow-hidden pb-20">
        {backgroundImage}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
        <div className={`relative z-10 flex w-full flex-col gap-5 px-8 ${alignClass}`}>
          {title && <h1 className="max-w-3xl text-6xl font-black leading-none tracking-tight" style={{ color: titleColor }}>{title}</h1>}
          {desc && <p className="max-w-xl text-base font-medium" style={{ color: descColor }}>{desc}</p>}
          {btnLabel && <div className="w-fit cursor-pointer rounded-2xl px-8 py-3.5 text-sm font-black uppercase tracking-widest" style={{ backgroundColor: btnColor, color: "#fff" }}>{btnLabel}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="group relative w-full overflow-hidden">
      <div key={current} className="w-full">
        {renderVariant()}
      </div>

      {variant !== "variant_2" && slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-all hover:bg-black/50 group-hover:opacity-100">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-all hover:bg-black/50 group-hover:opacity-100">
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
            {slides.map((_: unknown, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
