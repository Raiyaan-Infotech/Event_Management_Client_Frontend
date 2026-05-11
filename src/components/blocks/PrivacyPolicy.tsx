"use client";

import { sanitizeHtml } from "@/lib/sanitize-html";

export default function PrivacyPolicy({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const colors  = data?.colors || {};
  const primary = colors.primary_color || "#2563eb";
  const content = data?.privacy_content || "";
  const safeContent = sanitizeHtml(content);

  if (!content) return (
    <div className="w-full py-20 px-8 flex items-center justify-center">
      <p className="text-sm text-gray-400 italic">No Privacy Policy content added yet.</p>
    </div>
  );

  if (variant === "variant_2") {
    return (
      <div className="w-full bg-white px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-y border-gray-200 py-8">
              <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Legal</span>
              <h1 className="mt-4 text-4xl font-black leading-none text-gray-950">Privacy Policy</h1>
              <p className="mt-6 text-sm font-medium leading-relaxed text-gray-500">
                Understand how contact details, inquiries, and booking information are handled.
              </p>
            </div>
          </aside>
          <div className="border-l border-gray-200 pl-0 lg:pl-10">
            <div
              className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-950 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </div>
        </div>
      </div>
    );
  }

  // variant_1 — light card
  return (
    <div className="w-full py-20 px-8 bg-stone-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-10 md:p-14">
        <div className="mb-10">
          <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Legal</span>
          <h1 className="text-4xl font-black text-gray-900 mt-2">Privacy Policy</h1>
          <div className="w-12 h-0.5 mt-4" style={{ backgroundColor: primary }} />
        </div>
        <div
          className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </div>
    </div>
  );
}
