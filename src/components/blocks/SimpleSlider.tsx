"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

export default function SimpleSlider({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const slides = (data?.sliders ?? []).filter((s: any) => s.is_active && s.type === "basic");

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
  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  const renderVariant = () => {
    if (variant === "variant_1") return (
      <div className="relative flex min-h-[460px] w-full items-end overflow-hidden pb-10">
        <Image src={img} alt="" fill sizes="100vw" className="object-cover" priority unoptimized />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
        {vendor.company_name && (
          <div className="relative z-10 px-10">
            <span className="text-sm font-black uppercase tracking-[0.4em] text-white/80">{vendor.company_name}</span>
          </div>
        )}
      </div>
    );

    if (variant === "variant_2") return (
      <div className="w-full bg-[#f7f3ee] px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
          <div className="relative min-h-[520px] overflow-hidden bg-gray-950">
            <Image src={img} alt="" fill sizes="(min-width: 1024px) calc(100vw - 320px), 100vw" className="object-cover" priority unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>
                {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <h1 className="mt-4 max-w-3xl text-5xl font-black leading-none text-white">
                {vendor.company_name || "Event Showcase"}
              </h1>
            </div>
          </div>
          <aside className="flex flex-col justify-between bg-white p-6">
            <div className="space-y-4">
              {vendor.company_logo && (
                <Image src={resolveMediaUrl(vendor.company_logo)} alt={vendor.company_name || "Company logo"} width={160} height={48} className="h-12 w-auto object-contain" unoptimized />
              )}
              <p className="text-xs font-black uppercase tracking-[0.45em] text-gray-400">Slider Set</p>
              <p className="text-3xl font-black leading-tight text-gray-950">Browse each active hero image as a designed sequence.</p>
            </div>
            <div className="mt-8 space-y-3">
              {slides.map((s: any, i: number) => (
                <button
                  key={s.id || i}
                  onClick={() => setCurrent(i)}
                  className={`grid w-full grid-cols-[48px_1fr] items-center gap-3 border p-2 text-left transition-colors ${
                    i === current ? "border-gray-950 bg-gray-950 text-white" : "border-gray-200 bg-white text-gray-950 hover:bg-gray-50"
                  }`}
                >
                  <Image src={resolveMediaUrl(s.image_path)} alt="" width={48} height={48} className="h-12 w-12 object-cover" unoptimized />
                  <span className="text-xs font-black uppercase tracking-widest">Slide {String(i + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
            {slides.length > 1 && (
              <div className="mt-6 flex gap-3">
                <button onClick={prev} className="flex h-11 w-11 items-center justify-center border border-gray-200 text-gray-950 hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={next} className="flex h-11 w-11 items-center justify-center text-white" style={{ backgroundColor: primary }}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    );

    return (
      <div className="relative flex min-h-[440px] w-full items-center justify-center overflow-hidden">
        <Image src={img} alt="" fill sizes="100vw" className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-black/20" />
        {vendor.company_name && (
          <div className="relative z-10 rounded-2xl border border-white/30 bg-white/10 px-10 py-4 backdrop-blur-sm">
            <span className="text-sm font-black uppercase tracking-[0.5em] text-white">{vendor.company_name}</span>
          </div>
        )}
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
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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
