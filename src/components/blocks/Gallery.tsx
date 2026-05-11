"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { resolveMediaUrl } from "@/lib/utils";

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
];

type GalleryImage = { src: string; title: string; city: string };
type GalleryEvent = { title: string; city: string; images: GalleryImage[] };

const demoEvent: GalleryEvent = {
  title: "Event Highlights",
  city: "Mumbai",
  images: DEMO_IMAGES.map((src, i) => ({ src, title: `Event ${i + 1}`, city: "Mumbai" })),
};

function normalizeImageList(value: any): string[] {
  const raw = typeof value === "string"
    ? (() => {
        try { return JSON.parse(value); } catch { return [value]; }
      })()
    : value;

  if (Array.isArray(raw)) return raw.map(resolveMediaUrl).filter(Boolean).slice(0, 10);
  const single = resolveMediaUrl(raw);
  return single ? [single] : [];
}

export default function Gallery({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const variant = settings?.variant || "variant_1";
  const colors  = data?.colors || {};
  const primary = colors.primary_color || "#3b82f6";

  const rawGallery = data?.gallery || [];
  const eventGroups = rawGallery
    .map((g: any) => {
      const title = g.event_name || g.title || "Event";
      const city = g.city || "";
      const sources = normalizeImageList(g.images || g.image_path || g.image);
      return {
        title,
        city,
        images: sources.map((src, i) => ({
          src,
          title: sources.length > 1 ? `${title} ${i + 1}` : title,
          city,
        })),
      };
    })
    .filter((event: GalleryEvent) => event.images.length > 0);
  const events: GalleryEvent[] = eventGroups.length ? eventGroups : [demoEvent];
  const images = events.flatMap(event => event.images).slice(0, 12);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (variant === "variant_2") {
    const featuredEvent = events[selectedEventIndex] || events[0];
    const eventImages = featuredEvent.images.slice(0, 10);
    const selectedImage = eventImages[selectedImageIndex] || eventImages[0];
    const nextImage = () => setSelectedImageIndex((p) => (p + 1) % eventImages.length);
    const prevImage = () => setSelectedImageIndex((p) => (p - 1 + eventImages.length) % eventImages.length);
    const selectEvent = (index: number) => {
      setSelectedEventIndex(index);
      setSelectedImageIndex(0);
    };

    return (
      <div className="w-full bg-[#111111] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-stretch">
            <div className="relative min-h-[520px] overflow-hidden">
              <Image src={selectedImage.src} alt={selectedImage.title} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              {eventImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white transition-colors hover:bg-black/60">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white transition-colors hover:bg-black/60">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>
                  Image {String(selectedImageIndex + 1).padStart(2, "0")} / {String(eventImages.length).padStart(2, "0")}
                </span>
                <h2 className="mt-3 max-w-lg text-5xl font-black leading-none text-white">{featuredEvent.title}</h2>
                {featuredEvent.city && <p className="mt-4 text-sm font-bold uppercase tracking-widest text-white/60">{featuredEvent.city}</p>}
              </div>
            </div>

            <aside className="flex flex-col justify-between border border-white/10 p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.45em] text-white/35">Event Slider</p>
                <p className="mt-4 text-3xl font-black leading-tight text-white">Each event can show up to 10 images as one focused slider.</p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3">
                {eventImages.map((img: GalleryImage, i: number) => (
                  <button key={i} onClick={() => setSelectedImageIndex(i)} className={`relative aspect-square overflow-hidden border text-left transition-colors ${i === selectedImageIndex ? "border-white" : "border-white/10"}`}>
                    <Image src={img.src} alt={img.title} fill sizes="180px" className="object-cover" unoptimized />
                    <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[9px] font-black ${i === selectedImageIndex ? "bg-white text-gray-950" : "bg-black/60 text-white"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>
            </aside>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {events.slice(0, 6).map((event, i) => (
              <button
                key={i}
                onClick={() => selectEvent(i)}
                className={`border p-4 text-left transition-colors ${i === selectedEventIndex ? "border-white bg-white text-gray-950" : "border-white/10 text-white hover:border-white/35"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black">{event.title}</p>
                    <p className={`text-xs font-bold uppercase tracking-widest ${i === selectedEventIndex ? "text-gray-500" : "text-white/35"}`}>{event.images.length} images</p>
                  </div>
                  <span className="text-xs font-black" style={{ color: i === selectedEventIndex ? primary : undefined }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="mt-4 flex gap-2 overflow-hidden">
                  {event.images.slice(0, 4).map((img, j) => (
                    <Image key={j} src={img.src} alt={img.title} width={80} height={64} className="h-16 w-20 shrink-0 object-cover" unoptimized />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "variant_3") {
    return (
      <div className="w-full py-16 px-8 bg-white">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Gallery</span>
            <h2 className="text-4xl font-black text-gray-900">Event Highlights</h2>
          </div>
          <div className="flex gap-2 overflow-hidden rounded-3xl h-80">
            {images.slice(0, 4).map((img: GalleryImage, i: number) => (
              <div key={i} className="relative flex-1 overflow-hidden group cursor-pointer min-w-0">
                <Image src={img.src} alt={img.title} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-black text-xs uppercase tracking-wider">{img.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // variant_1 — Default grid
  return (
    <div className="w-full py-16 px-8 bg-white">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Gallery</span>
          <h2 className="text-4xl font-black text-gray-900">Event Gallery</h2>
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: primary }} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {images.map((img: GalleryImage, i: number) => (
            <div key={i} className="relative group overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100 cursor-pointer shadow">
              <Image src={img.src} alt={img.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white font-black text-sm">{img.title}</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">{img.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
