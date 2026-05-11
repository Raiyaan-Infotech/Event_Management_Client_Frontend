"use client";

import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

function ThreePanelBuilderShell() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 items-start">
      <div className="h-[500px] rounded-xl bg-transparent" />
      <div className="h-[500px] rounded-xl bg-transparent" />
      <div className="h-[300px] rounded-xl bg-transparent" />
    </div>
  );
}

export function ThreePanelBuilderSkeleton() {
  return (
    <BoneyardSkeleton
      name="three-panel-builder"
      loading
      className="w-full"
      snapshotConfig={{ excludeTags: ["svg"] }}
    >
      <ThreePanelBuilderShell />
    </BoneyardSkeleton>
  );
}
