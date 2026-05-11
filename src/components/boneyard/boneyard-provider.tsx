"use client";

import "@/bones/registry";

import { configureBoneyard } from "boneyard-js/react";
import { useEffect } from "react";

export function BoneyardProvider() {
  useEffect(() => {
    configureBoneyard({
      animate: "shimmer",
      color: "rgba(37, 99, 235, 0.12)",
      darkColor: "rgba(148, 163, 184, 0.18)",
      shimmerColor: "rgba(255, 255, 255, 0.55)",
      darkShimmerColor: "rgba(255, 255, 255, 0.08)",
      speed: "1.8s",
      transition: true,
    });
  }, []);

  return null;
}
