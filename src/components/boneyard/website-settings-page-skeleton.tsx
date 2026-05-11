"use client";

import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

function WebsiteSettingsPageShell() {
  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto mb-8 space-y-3">
        <div className="h-8 w-48 rounded-xl bg-transparent" />
        <div className="h-4 w-80 rounded-full bg-transparent" />
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 rounded-3xl bg-transparent" />
              <div className="h-40 rounded-3xl bg-transparent" />
            </div>
            <div className="space-y-4">
              <div className="h-12 rounded-xl bg-transparent" />
              <div className="h-12 rounded-xl bg-transparent" />
              <div className="h-44 rounded-2xl bg-transparent" />
            </div>
          </div>
          <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none space-y-4">
            <div className="h-6 w-40 rounded-full bg-transparent" />
            <div className="h-28 rounded-2xl bg-transparent" />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 rounded-2xl bg-transparent" />
            ))}
          </div>
          <div className="bg-white dark:bg-sidebar/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <div className="h-3 w-24 rounded-full bg-transparent" />
            <div className="h-12 rounded-xl bg-transparent" />
            <div className="h-12 rounded-xl bg-transparent" />
            <div className="h-12 rounded-xl bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebsiteSettingsPageSkeleton() {
  return (
    <BoneyardSkeleton
      name="website-settings-page"
      loading
      className="w-full"
      snapshotConfig={{ excludeTags: ["svg"] }}
    >
      <WebsiteSettingsPageShell />
    </BoneyardSkeleton>
  );
}
