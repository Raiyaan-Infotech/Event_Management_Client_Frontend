"use client";

import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

function DashboardTableShell() {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden mb-4">
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left border-separate border-spacing-0 min-w-[1100px]">
          <thead className="sticky top-0 z-20 bg-white dark:bg-[#1f2937] shadow-sm">
            <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100/50 dark:border-gray-800">
              <th className="px-6 py-5 w-10">
                <div className="h-4 w-4 rounded-sm bg-transparent" />
              </th>
              {Array.from({ length: 5 }).map((_, index) => (
                <th key={index} className="px-6 py-5">
                  <div className="h-3 w-24 rounded-full bg-transparent" />
                </th>
              ))}
              <th className="px-6 py-5">
                <div className="h-3 w-16 rounded-full bg-transparent ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-50 dark:border-gray-800/30">
                <td className="px-6 py-5">
                  <div className="h-4 w-4 rounded-sm bg-transparent" />
                </td>
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-5">
                    <div className="h-4 w-full rounded-full bg-transparent" />
                  </td>
                ))}
                <td className="px-6 py-5">
                  <div className="ml-auto h-8 w-8 rounded-xl bg-transparent" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DashboardTableSkeleton() {
  return (
    <BoneyardSkeleton
      name="dashboard-table"
      loading
      className="w-full"
      snapshotConfig={{ excludeTags: ["svg"] }}
    >
      <DashboardTableShell />
    </BoneyardSkeleton>
  );
}
