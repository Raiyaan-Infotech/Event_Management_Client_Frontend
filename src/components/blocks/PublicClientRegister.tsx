"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { usePublicClientRegister } from "@/hooks/use-public-client";
import { toPublicSlug } from "@/lib/utils";

export default function PublicClientRegister({ data }: { data?: any }) {
  const slug = data?.slug || "";
  const colors = data?.colors || {};
  const vendor = data?.vendor || {};
  const publicSlug = slug === "preview" ? toPublicSlug(vendor.company_name || "") : slug;
  const primary = colors.primary_color || "#2563eb";
  const registerMutation = usePublicClientRegister(publicSlug);

  const initialForm = {
    name: "",
    email: "",
    mobile: "",
  };

  const [form, setForm] = useState({
    ...initialForm,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await registerMutation.mutateAsync({
        ...form,
        address: null,
        country: null,
        state: null,
        district: null,
        city: null,
        locality: null,
        pincode: null,
        subscribe_newsletter: true,
      });

      setMessage("Registration completed. Your details are now added with this vendor.");
      setForm({ ...initialForm });
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <section className="w-full bg-gray-50 px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <aside className="flex flex-col justify-between bg-gray-950 p-8 text-white">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Client Register</span>
            <h1 className="mt-5 text-5xl font-black leading-none">Create your client profile.</h1>
            <p className="mt-5 max-w-md text-sm font-medium leading-7 text-white/60">
              Register with {vendor.company_name || "this vendor"} so the team can manage your event details from the client module.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-3xl font-black">01</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/35">Profile</p>
            </div>
            <div>
              <p className="text-3xl font-black">Live</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/35">Vendor Client</p>
            </div>
          </div>
        </aside>

        <form onSubmit={submit} className="bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: primary }}>
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-950">Register</h2>
              <p className="text-sm text-gray-500">Only the core client details are required here.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</span>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-gray-950" />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Email</span>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-gray-950" />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Mobile</span>
              <input required value={form.mobile} onChange={(e) => update("mobile", e.target.value)} className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-gray-950" />
            </label>
          </div>

          {message && (
            <div className="mt-5 flex items-center gap-2 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {message}
            </div>
          )}
          {error && <p className="mt-5 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button disabled={registerMutation.isPending} className="inline-flex h-12 items-center justify-center px-7 text-sm font-black uppercase tracking-widest text-white disabled:opacity-60" style={{ backgroundColor: primary }}>
              {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Register
            </button>
            <Link href={slug === "preview" ? "/preview?previewPage=login" : `/${slug}/login`} className="text-sm font-bold text-gray-500 hover:text-gray-950">
              Already registered? Login
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
