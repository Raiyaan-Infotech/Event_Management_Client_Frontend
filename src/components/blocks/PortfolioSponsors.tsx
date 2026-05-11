"use client";

import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";

const DEMO_SPONSORS = [
  { name: "Samsung",    image: null },
  { name: "Sony",       image: null },
  { name: "LG",         image: null },
  { name: "Bosch",      image: null },
  { name: "Siemens",    image: null },
  { name: "Panasonic",  image: null },
];

export default function PortfolioSponsors({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant  = settings?.variant || "variant_1";
  const colors   = data?.colors || {};
  const primary  = colors.primary_color || "#3b82f6";
  const raw      = data?.portfolio?.sponsors || [];
  const sponsors = raw.length
    ? raw.map((s: any) => ({ 
        name: s.label || s.name || "", 
        image: resolveMediaUrl(s.image_path || s.image) || null 
      }))
    : DEMO_SPONSORS;

  if (variant === "variant_2") {
    return (
      <div className="w-full bg-[#f6f7fb] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-gray-300 pb-8 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Sponsors</span>
              <h2 className="mt-2 text-5xl font-black leading-none text-gray-950">Powered by supporters</h2>
            </div>
            <p className="max-w-md text-sm font-medium leading-relaxed text-gray-500">
              A clean editorial roll-call for partners behind the event experience.
            </p>
          </div>

          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {sponsors.map((s: any, i: number) => (
              <div key={i} className="grid grid-cols-[64px_1fr_auto] items-center gap-5 py-5">
                <span className="text-sm font-black text-gray-400">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex min-h-16 items-center">
                  {s.image
                    ? <Image src={s.image} alt={s.name} width={160} height={48} className="max-h-12 max-w-40 object-contain" unoptimized />
                    : <span className="text-xl font-black uppercase tracking-wider text-gray-900">{s.name}</span>}
                </div>
                <span className="hidden rounded-full border border-gray-300 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 md:inline-flex">
                  Partner
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "variant_3") {
    return (
      <div className="w-full py-16 px-8 bg-gray-900">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Global Support</span>
            <h2 className="text-4xl font-black text-white">Our Sponsors</h2>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {sponsors.map((s: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-center h-20 hover:bg-white/10 transition-colors">
                {s.image
                  ? <Image src={s.image} alt={s.name} width={128} height={40} className="max-h-10 max-w-full object-contain opacity-60 transition-opacity hover:opacity-100" unoptimized />
                  : <span className="text-white/40 font-black text-[10px] uppercase tracking-wider text-center">{s.name}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // variant_1 — Default with colored background strip
  return (
    <div className="w-full py-16 px-8 bg-white">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Sponsors</span>
          <h2 className="text-4xl font-black text-gray-900">Our Sponsors</h2>
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: primary }} />
        </div>
        <div className="grid grid-cols-6 gap-5">
          {sponsors.map((s: any, i: number) => (
            <div key={i} className="aspect-[3/2] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-4 hover:shadow-md transition-shadow">
              {s.image
                ? <Image src={s.image} alt={s.name} width={128} height={86} className="max-h-full max-w-full object-contain" unoptimized />
                : <span className="font-black text-gray-400 text-[10px] uppercase tracking-wider text-center">{s.name}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
