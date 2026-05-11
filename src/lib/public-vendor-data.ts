import type { PublicVendorData } from "@/hooks/use-public-vendor";
import { publicApiUrl } from "@/lib/utils";

function isPublicAssetSlug(slug: string) {
  return !slug || slug.includes(".");
}

export async function getPublicVendorData(slug: string, revalidateSeconds = 30): Promise<PublicVendorData | null> {
  if (isPublicAssetSlug(slug)) {
    return null;
  }

  try {
    const res = await fetch(publicApiUrl(`public/vendors/${encodeURIComponent(slug)}/website-data`), {
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) return null;

    const payload = await res.json();
    return (payload?.data || null) as PublicVendorData | null;
  } catch {
    return null;
  }
}
