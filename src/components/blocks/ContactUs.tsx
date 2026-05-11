"use client";

import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactUs({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const vendor = data?.vendor || {};
  const colors = data?.colors || {};
  const primary = colors.primary_color || "#2563eb";
  const text = colors.text_color || "#111827";

  const contactItems = [
    { icon: Phone, label: "Phone", value: vendor.company_contact, href: vendor.company_contact ? `tel:${vendor.company_contact}` : undefined },
    { icon: Mail, label: "Email", value: vendor.company_email, href: vendor.company_email ? `mailto:${vendor.company_email}` : undefined },
    { icon: MapPin, label: "Address", value: vendor.company_address },
  ].filter(item => item.value);

  if (variant === "variant_2") {
    return (
      <main className="flex-1 bg-[#111111]">
        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="flex min-h-[520px] flex-col justify-between bg-white p-8 md:p-12">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.45em]" style={{ color: primary }}>
                  Contact Desk
                </span>
                <h1 className="mt-5 max-w-2xl text-5xl font-black leading-none text-gray-950">
                  Start a conversation with {vendor.company_name || "our team"}
                </h1>
              </div>

              <div className="mt-12 divide-y divide-gray-200 border-y border-gray-200">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="grid grid-cols-[44px_1fr] gap-4 py-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full text-white" style={{ backgroundColor: primary }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                      {href ? (
                        <a href={href} className="mt-1 block break-words text-sm font-black text-gray-900 hover:opacity-70">
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 break-words text-sm font-black text-gray-900">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form className="flex min-h-[520px] flex-col justify-between border border-white/10 p-8 md:p-10">
              <div className="space-y-5">
                <input className="h-14 w-full border-0 border-b border-white/20 bg-transparent px-0 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-white" placeholder="Name" />
                <input className="h-14 w-full border-0 border-b border-white/20 bg-transparent px-0 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-white" placeholder="Phone" />
                <input className="h-14 w-full border-0 border-b border-white/20 bg-transparent px-0 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-white" placeholder="Email" />
                <textarea className="min-h-40 w-full resize-none border-0 border-b border-white/20 bg-transparent px-0 py-4 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-white" placeholder="Tell us about your event" />
              </div>
              <button
                type="button"
                className="mt-8 h-14 w-full text-sm font-black uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primary }}
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white">
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-[0.45em]" style={{ color: primary }}>
                  Contact Us
                </span>
                <h1 className="text-4xl md:text-5xl font-black leading-tight" style={{ color: text }}>
                  Get in touch with {vendor.company_name || "us"}
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-gray-500">
                  Send your event details and our team will reach out with the next steps.
                </p>
              </div>

              <div className="space-y-4">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: primary }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</p>
                      {href ? (
                        <a href={href} className="mt-1 block break-words text-sm font-bold text-gray-800 hover:opacity-70">
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 break-words text-sm font-bold text-gray-800">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-200/60 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <input className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400" placeholder="Name" />
                <input className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400" placeholder="Phone" />
                <input className="h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-gray-400 md:col-span-2" placeholder="Email" />
                <textarea className="min-h-36 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 md:col-span-2" placeholder="Tell us about your event" />
              </div>
              <button
                type="button"
                className="mt-5 h-12 rounded-xl px-6 text-sm font-black uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primary }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
