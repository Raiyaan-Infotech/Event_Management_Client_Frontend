"use client";

const DEMO_STATS = [
  { label: "Past Events",     value: "500+" },
  { label: "Present Events",  value: "20"   },
  { label: "Future Events",   value: "50"   },
  { label: "Happy Clients",   value: "98%"  },
];

const DEMO_HEADER = "Our Event Highlights";
const DEMO_DETAIL = "Statistics from our best events across the country.";

export default function PortfolioEvents({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const colors  = data?.colors || {};
  const primary = colors.primary_color || "#3b82f6";

  // Events items store label + value stats rows — max 4
  const rawEvents = data?.portfolio?.events || [];
  const stats = (rawEvents.length ? rawEvents : DEMO_STATS)
    .slice(0, 4)
    .map((e: any) => ({ label: e.label || "", value: e.value || "" }));

  // Header/Detail may be stored as items with specific labels, or fall back to demo
  const header = DEMO_HEADER;
  const detail = DEMO_DETAIL;

  if (variant === "variant_2") {
    return (
      <div className="w-full bg-white px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Event Metrics</span>
            <h2 className="text-5xl font-black leading-none text-gray-950">{header}</h2>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-gray-500">{detail}</p>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gray-200" />
            <div className="space-y-5">
              {stats.map((s: any, i: number) => (
                <div key={i} className="relative grid grid-cols-[42px_1fr] gap-5">
                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-xs font-black text-white" style={{ backgroundColor: primary }}>
                    {i + 1}
                  </div>
                  <div className="border border-gray-200 bg-gray-50 p-6">
                    <span className="block text-5xl font-black leading-none text-gray-950">{s.value}</span>
                    <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "variant_3") {
    return (
      <div className="w-full py-16 px-8" style={{ backgroundColor: colors.footer_color || "#111827" }}>
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Events</span>
            <h2 className="text-4xl font-black" style={{ color: colors.text_color || "#ffffff" }}>{header}</h2>
            <p className="text-sm font-medium opacity-40" style={{ color: colors.text_color || "#ffffff" }}>{detail}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-3 hover:bg-white/10 transition-colors">
                <span className="text-4xl md:text-5xl font-black block" style={{ color: colors.text_color || "#ffffff" }}>{s.value}</span>
                <div className="w-8 h-0.5 mx-auto rounded-full" style={{ backgroundColor: primary }} />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-tight break-words" style={{ color: colors.text_color || "#ffffff" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // variant_1 — Default with colored background
  return (
    <div className="w-full py-16 px-8" style={{ background: `linear-gradient(135deg, ${primary}15 0%, ${primary}05 100%)` }}>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Events</span>
          <h2 className="text-4xl font-black text-gray-900">{header}</h2>
          <p className="text-gray-500 text-sm font-medium max-w-md">{detail}</p>
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: primary }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s: any, i: number) => (
            <div key={i} className="bg-white rounded-3xl p-8 text-center space-y-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <span className="text-4xl md:text-5xl font-black block" style={{ color: primary }}>{s.value}</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight break-words">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
