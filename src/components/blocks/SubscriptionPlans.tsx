"use client";

const DEMO_PLANS = [
  { name: "Basic", price: "2,999", discounted_price: null, features: '["Up to 100 guests","Basic decor","1 coordinator","Email support"]', label_color: "#6b7280" },
  { name: "Silver", price: "8,999", discounted_price: "7,499", features: '["Up to 300 guests","Premium decor","2 coordinators","Photography","DJ"]', label_color: "#3b82f6" },
  { name: "Gold", price: "18,999", discounted_price: null, features: '["Up to 700 guests","Luxury decor","4 coordinators","Full photography","Live band","Custom theme"]', label_color: "#f59e0b" },
];

export default function SubscriptionPlans({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const colors = data?.colors || {};
  const primary = colors.primary_color || "#3b82f6";
  const plans = data?.plans?.length ? data.plans.slice(0, 3) : DEMO_PLANS;

  const decodeEntities = (s: string) =>
    s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();

  const parseFeatures = (f: any): string[] => {
    if (Array.isArray(f)) return f;
    if (typeof f !== "string") return [];
    try {
      return JSON.parse(f);
    } catch {
      const liMatches = f.match(/<li[^>]*>[\s\S]*?<\/li>/g) || [];
      if (liMatches.length) return liMatches.map((m) => decodeEntities(m.replace(/<[^>]+>/g, ""))).filter(Boolean);
      return f.replace(/<[^>]+>/g, "").split("\n").map((s) => decodeEntities(s)).filter(Boolean);
    }
  };

  if (variant === "variant_2") {
    return (
      <div className="w-full bg-[#101014] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="flex flex-col justify-between border border-white/10 p-8">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Plan Matrix</span>
              <h2 className="mt-4 text-5xl font-black leading-none text-white">Compare packages in one clean view.</h2>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 text-white">
              <div>
                <p className="text-4xl font-black">{plans.length}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/35">Plans</p>
              </div>
              <div>
                <p className="text-4xl font-black">{Math.max(...plans.map((p: any) => parseFeatures(p.features).length), 0)}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/35">Max Items</p>
              </div>
              <div>
                <p className="text-4xl font-black">01</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/35">Choice</p>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {plans.map((p: any, i: number) => {
              const features = parseFeatures(p.features);
              const accent = p.label_color || primary;
              const isFeatured = i === 1 || (plans.length === 1 && i === 0);
              return (
                <div
                  key={i}
                  className={`grid gap-5 border p-5 md:grid-cols-[150px_1fr_150px] ${
                    isFeatured ? "border-white bg-white text-gray-950" : "border-white/10 bg-white/[0.03] text-white"
                  }`}
                >
                  <div>
                    <div className="mb-4 h-1 w-10" style={{ backgroundColor: accent }} />
                    <p className={`text-xs font-black uppercase tracking-widest ${isFeatured ? "text-gray-500" : "text-white/45"}`}>{p.name}</p>
                    <p className="mt-3 text-3xl font-black">Rs. {p.discounted_price || p.price}</p>
                    {p.discounted_price && <p className={`mt-1 text-sm line-through ${isFeatured ? "text-gray-400" : "text-white/30"}`}>Rs. {p.price}</p>}
                    {p.validity && <p className={`mt-1 text-xs ${isFeatured ? "text-gray-500" : "text-white/35"}`}>{p.validity} days</p>}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {features.slice(0, 6).map((feat: string, j: number) => (
                      <p key={j} className={`flex items-start gap-2 text-sm ${isFeatured ? "text-gray-600" : "text-white/60"}`}>
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                        <span className="min-w-0 break-words">{feat}</span>
                      </p>
                    ))}
                  </div>
                  <div className="flex items-end justify-start md:justify-end">
                    <button
                      className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                        isFeatured ? "text-white" : "border border-white/15 text-white hover:bg-white/10"
                      }`}
                      style={isFeatured ? { backgroundColor: accent } : undefined}
                    >
                      Select
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "variant_3") {
    return (
      <div className="w-full bg-gray-50 px-8 py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3 text-center">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Plans</span>
            <h2 className="text-4xl font-black text-gray-900">Simple Pricing</h2>
          </div>
          <div className="flex flex-col gap-4">
            {plans.map((p: any, i: number) => {
              const features = parseFeatures(p.features);
              return (
                <div key={i} className="flex items-center gap-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="h-12 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.label_color || primary }} />
                  <div className="flex-1">
                    <p className="text-lg font-black text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-400">{features.slice(0, 3).join(" / ")}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="flex items-baseline justify-end gap-1 text-2xl font-black text-gray-900">
                      Rs. {p.discounted_price || p.price}
                      {p.validity && <span className="text-xs font-bold text-gray-400">/ {p.validity} days</span>}
                    </p>
                    {p.discounted_price && <p className="text-sm text-gray-300 line-through">Rs. {p.price}</p>}
                  </div>
                  <div className="shrink-0 cursor-pointer rounded-xl px-6 py-2.5 text-sm font-black uppercase tracking-widest text-white" style={{ backgroundColor: primary }}>
                    Choose
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-50 px-8 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14">
          <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Packages</span>
          <h2 className="mt-2 text-5xl font-black text-gray-900">Find Your Plan</h2>
          <div className="mt-4 h-0.5 w-16" style={{ backgroundColor: primary }} />
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
          {plans.map((p: any, i: number) => {
            const features = parseFeatures(p.features);
            const accent = p.label_color || primary;
            return (
              <div key={i} className="flex flex-col gap-6 p-10">
                <div className="h-1 w-10 rounded-full" style={{ backgroundColor: accent }} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">{p.name}</p>
                  <p className="mt-2 text-5xl font-black text-gray-900">Rs. {p.discounted_price || p.price}</p>
                  {p.discounted_price && <p className="mt-1 text-sm text-gray-300 line-through">Rs. {p.price}</p>}
                  {p.validity && <p className="mt-1 text-xs text-gray-400">{p.validity} days</p>}
                </div>
                <div className="flex-1 space-y-3 overflow-hidden border-t border-gray-100 pt-6">
                  {features.map((feat: string, j: number) => (
                    <p key={j} className="flex items-start gap-2.5 break-words text-sm text-gray-600">
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                      <span className="min-w-0">{feat}</span>
                    </p>
                  ))}
                </div>
                <button className="w-full rounded-xl border-2 py-3 text-sm font-black uppercase tracking-widest transition-colors hover:text-white" style={{ borderColor: accent, color: accent }}>
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
