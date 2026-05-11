"use client";

import { sanitizeHtml } from "@/lib/sanitize-html";

export default function AboutUs({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const vendor = data?.vendor || {};
  const colors = data?.colors || {};
  const primary = colors.primary_color || "#3b82f6";

  const name = vendor.company_name || "Our Company";
  const about = vendor.about_us || "";
  const hasAbout = about.replace(/<[^>]*>/g, "").trim().length > 0;
  const aboutMarkup = hasAbout ? about : "<p>About Us content not yet configured.</p>";
  const safeAboutMarkup = sanitizeHtml(aboutMarkup);

  if (variant === "variant_2") {
    return (
      <section id="about-us" className="w-full scroll-mt-24 bg-[#f7f3ee] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-stretch">
          <aside className="flex flex-col justify-between border-y border-gray-900/15 py-8">
            <div className="space-y-5">
              <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>
                Studio Profile
              </span>
              <h2 className="max-w-sm text-5xl font-black leading-none text-gray-950">
                About {name}
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="border-l-4 pl-4" style={{ borderColor: primary }}>
                <p className="text-3xl font-black text-gray-950">01</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Planning</p>
              </div>
              <div className="border-l-4 pl-4" style={{ borderColor: primary }}>
                <p className="text-3xl font-black text-gray-950">02</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Execution</p>
              </div>
            </div>
          </aside>

          <div className="grid gap-6 md:grid-cols-[1fr_0.72fr]">
            <article className="bg-white p-8 shadow-sm md:p-10">
              <div
                className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-950"
                dangerouslySetInnerHTML={{ __html: safeAboutMarkup }}
              />
            </article>
            <div className="flex min-h-72 flex-col justify-end bg-gray-950 p-8 text-white">
              <p className="text-xs font-black uppercase tracking-[0.45em] text-white/40">Approach</p>
              <p className="mt-4 text-2xl font-black leading-tight">
                Designed around the event, the guest flow, and the story behind the moment.
              </p>
              <div className="mt-8 h-1 w-20" style={{ backgroundColor: primary }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "variant_3") {
    return (
      <section id="about-us" className="w-full py-20 px-6 md:px-8 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Our Story</span>
            <h2 className="text-5xl font-black text-gray-900 leading-tight">About {name}</h2>
          </div>
          <div
            className="prose prose-lg max-w-3xl mx-auto text-left text-gray-600 prose-headings:text-gray-900"
            dangerouslySetInnerHTML={{ __html: safeAboutMarkup }}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="about-us" className="w-full py-16 px-6 md:px-8 bg-white scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>About Us</span>
          <h2 className="text-4xl font-black text-gray-900 leading-tight max-w-xl">About {name}</h2>
          <div className="w-16 h-1 rounded-full" style={{ backgroundColor: primary }} />
        </div>
        <div
          className="prose prose-lg max-w-3xl mx-auto text-gray-600 prose-headings:text-gray-900"
          dangerouslySetInnerHTML={{ __html: safeAboutMarkup }}
        />
      </div>
    </section>
  );
}
