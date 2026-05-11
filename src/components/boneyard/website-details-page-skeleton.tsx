"use client";

import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

function WebsiteDetailsPageShell() {
  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-slate-50/40 dark:bg-transparent">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-3">
            <div className="h-6 w-20 rounded-full bg-transparent" />
            <div className="h-8 w-64 rounded-xl bg-transparent" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-transparent" />
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-sidebar p-6 space-y-4">
          <div className="h-4 w-32 rounded-full bg-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-20 rounded-xl bg-transparent" />
            <div className="h-20 rounded-xl bg-transparent" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-sidebar p-6 space-y-4">
          <div className="h-4 w-28 rounded-full bg-transparent" />
          <div className="h-24 rounded-xl bg-transparent" />
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-sidebar p-6 space-y-4 min-h-[600px]">
          <div className="h-4 w-40 rounded-full bg-transparent" />
          <div className="h-[520px] rounded-xl bg-transparent" />
        </div>
      </div>
    </div>
  );
}

export function WebsiteDetailsPageSkeleton() {
  return (
    <BoneyardSkeleton
      name="website-details-page"
      loading
      className="w-full"
      snapshotConfig={{ excludeTags: ["svg", "iframe"] }}
    >
      <WebsiteDetailsPageShell />
    </BoneyardSkeleton>
  );
}
