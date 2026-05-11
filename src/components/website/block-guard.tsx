"use client";

import { notFound } from "next/navigation";
import { useVendorHomeBlocks } from "@/hooks/use-vendor-home-blocks";

interface BlockGuardProps {
  blockType: string;
  children: React.ReactNode;
}

export function BlockGuard({ blockType, children }: BlockGuardProps) {
  const { data: blocks, isLoading } = useVendorHomeBlocks();

  if (isLoading) return null;

  const hasBlock = blocks?.some((b) => b.block_type === blockType);
  if (!hasBlock) notFound();

  return <>{children}</>;
}
