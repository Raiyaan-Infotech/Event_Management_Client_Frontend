"use client";

import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";

const DEMO_CLIENTS = [
  { name: "Tata Group",      image: null },
  { name: "Infosys",         image: null },
  { name: "Reliance",        image: null },
  { name: "HDFC Bank",       image: null },
  { name: "Wipro",           image: null },
  { name: "Mahindra",        image: null },
];

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
      <span className="text-xs font-black uppercase tracking-widest text-gray-400 text-center px-2">{name}</span>
    </div>
  );
}

export default function PortfolioClients({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const colors  = data?.colors || {};
  const primary = colors.primary_color || "#3b82f6";
  const raw     = data?.portfolio?.clients || [];
  const clients = raw.length
    ? raw.map((c: any) => ({ 
        name: c.label || c.name || "", 
        image: resolveMediaUrl(c.image_path || c.image) || null 
      }))
    : DEMO_CLIENTS;

  if (variant === "variant_2") {
    return (
      <div className="w-full bg-white px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Client Network</span>
            <h2 className="text-5xl font-black leading-none text-gray-950">Brands and teams we support</h2>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-gray-500">
              A structured partner wall built for scanning, proof, and momentum.
            </p>
            <div className="h-1 w-20" style={{ backgroundColor: primary }} />
          </div>

          <div className="grid grid-cols-2 border border-gray-200 md:grid-cols-3">
            {clients.map((c: any, i: number) => (
              <div key={i} className="flex aspect-[4/3] items-center justify-center border-b border-r border-gray-200 bg-gray-50 p-6 transition-colors hover:bg-white">
                {c.image
                  ? <Image src={c.image} alt={c.name} width={180} height={64} className="max-h-16 max-w-full object-contain grayscale transition-all hover:grayscale-0" unoptimized />
                  : <span className="px-2 text-center text-xs font-black uppercase tracking-widest text-gray-500">{c.name}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "variant_3") {
    return (
      <div className="w-full py-16 px-8 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Clients</span>
            <h2 className="text-4xl font-black text-gray-900">Our Trusted Clients</h2>
            <p className="text-gray-400 text-sm font-medium">Proud to work with industry leaders</p>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...clients, ...clients].map((c: any, i: number) => (
              <div key={i} className="shrink-0 w-32 h-20 border border-gray-100 rounded-2xl flex items-center justify-center p-3 shadow-sm">
                {c.image
                  ? <Image src={c.image} alt={c.name} width={128} height={80} className="max-h-full max-w-full object-contain" unoptimized />
                  : <LogoPlaceholder name={c.name} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // variant_1 — Default grid
  return (
    <div className="w-full py-16 px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Our Clients</span>
          <h2 className="text-4xl font-black text-gray-900">Trusted By Leaders</h2>
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: primary }} />
        </div>
        <div className="grid grid-cols-6 gap-5">
          {clients.map((c: any, i: number) => (
            <div key={i} className="aspect-square bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center p-4 hover:shadow-md transition-shadow">
              {c.image
                ? <Image src={c.image} alt={c.name} width={128} height={128} className="max-h-full max-w-full object-contain" unoptimized />
                : <LogoPlaceholder name={c.name} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
