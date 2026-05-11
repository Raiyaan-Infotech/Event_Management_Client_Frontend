"use client";

import Image from "next/image";

const DEMO_TESTIMONIALS = [
  { customer_name: "Priya Sharma", event_name: "Bride",         client_feedback: "Absolutely magical! Every detail was perfect.", customer_portrait: null },
  { customer_name: "Rohit Mehta",  event_name: "CEO, TechCorp", client_feedback: "Our corporate gala was flawlessly executed.",  customer_portrait: null },
  { customer_name: "Anita Joshi",  event_name: "Event Manager", client_feedback: "Outstanding work! Highly recommended!",         customer_portrait: null },
];

function stripHtml(html: string) {
  return html?.replace(/<[^>]*>/g, '').trim() || "";
}

interface T { name: string; image: string | null; message: string; designation: string; }

function norm(t: any): T {
  return {
    name:        t.customer_name     || t.name        || "Client",
    image:       t.customer_portrait || t.image       || null,
    message:     stripHtml(t.client_feedback || t.message || ""),
    designation: t.event_name        || t.designation || "Client",
  };
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      <span className="relative block h-full w-full rounded-full">
        <Image src={image} alt={name} fill sizes="80px" className="rounded-full object-cover" unoptimized />
      </span>
    );
  }
  return (
    <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-black text-xl">
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

export default function Testimonial({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const colors  = data?.colors || {};
  const primary = colors.primary_color || "#3b82f6";

  const raw: any[]   = data?.testimonials?.length ? data.testimonials.slice(0, 3) : DEMO_TESTIMONIALS;
  const testimonials = raw.map((item: any) => norm(item));
  const main         = testimonials[0];

  if (variant === "variant_2") {
    return (
      <div className="w-full bg-[#f7f3ee] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="bg-gray-950 p-8 text-white md:p-12">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Client Voice</span>
            <p className="mt-10 text-3xl font-black italic leading-tight md:text-5xl">
              "{main.message}"
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="size-16 overflow-hidden rounded-full border-2 border-white/20">
                <Avatar name={main.name} image={main.image} />
              </div>
              <div>
                <p className="font-black">{main.name}</p>
                <p className="text-xs font-black uppercase tracking-widest text-white/40">{main.designation}</p>
              </div>
            </div>
          </article>

          <div className="space-y-4">
            <div className="border-b border-gray-300 pb-6">
              <h2 className="text-4xl font-black leading-none text-gray-950">What clients remember</h2>
            </div>
            {testimonials.slice(1).map((t: T, i: number) => (
              <div key={i} className="grid grid-cols-[48px_1fr] gap-4 border-b border-gray-200 py-6">
                <div className="size-12 overflow-hidden rounded-full">
                  <Avatar name={t.name} image={t.image} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-relaxed text-gray-600">"{t.message}"</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-widest text-gray-400">{t.name}</p>
                </div>
              </div>
            ))}
            {testimonials.length === 1 && (
              <p className="text-sm font-medium text-gray-500">More testimonials can be added from the vendor portal.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "variant_3") {
    return (
      <div className="w-full py-20 px-8 relative overflow-hidden" style={{ backgroundColor: primary }}>
        <div className="absolute -top-20 -right-20 opacity-10">
          <svg width="300" height="300" viewBox="0 0 24 24" fill="white"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
          <div className="size-20 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
            <Avatar name={main.name} image={main.image} />
          </div>
          <p className="text-white text-2xl font-black italic leading-relaxed">"{main.message}"</p>
          <div>
            <p className="text-white font-black text-lg">{main.name}</p>
            <p className="text-white/60 font-black text-xs uppercase tracking-[0.4em]">{main.designation}</p>
          </div>
          <div className="flex gap-2">
            {testimonials.map((_: T, i: number) => (
              <div key={i} className={`rounded-full transition-all ${i === 0 ? "w-6 h-2 bg-white" : "size-2 bg-white/30"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // variant_1 — Default centered
  return (
    <div className="w-full py-20 px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Testimonials</span>
        <div className="size-20 rounded-full overflow-hidden border-4 shadow-xl" style={{ borderColor: primary }}>
          <Avatar name={main.name} image={main.image} />
        </div>
        <p className="text-gray-700 text-xl font-bold italic leading-relaxed max-w-2xl">"{main.message}"</p>
        <div>
          <p className="font-black text-gray-900 text-lg">{main.name}</p>
          <p className="text-xs font-black uppercase tracking-[0.4em] mt-1" style={{ color: primary }}>{main.designation}</p>
        </div>
        {testimonials.length > 1 && (
          <div className="flex gap-3 pt-4">
            {testimonials.slice(1).map((t: T, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="size-8 rounded-full overflow-hidden shrink-0"><Avatar name={t.name} image={t.image} /></div>
                <div className="text-left">
                  <p className="text-xs font-black text-gray-900">{t.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.designation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
