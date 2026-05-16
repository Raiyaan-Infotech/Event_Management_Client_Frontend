"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface Rule { label: string; met: boolean }

function getRules(pw: string): Rule[] {
  return [
    { label: "Exactly 8 characters (min & max)", met: pw.length === 8 },
    { label: "At least 1 uppercase letter",  met: /[A-Z]/.test(pw) },
    { label: "At least 1 lowercase letter",  met: /[a-z]/.test(pw) },
    { label: "At least 1 number",            met: /[0-9]/.test(pw) },
    { label: "At least 1 special character", met: /[^A-Za-z0-9\s]/.test(pw) },
    { label: "No spaces allowed",            met: pw.length > 0 && !/\s/.test(pw) },
  ];
}

export function PasswordHint({ password, alwaysShow = false }: { password: string; alwaysShow?: boolean }) {
  if (!password && !alwaysShow) return null;
  const rules = getRules(password);
  const allMet = rules.every((r) => r.met);
  if (password && allMet) return null;

  return (
    <ul className="mt-2 space-y-1">
      {rules.map((r) => (
        <li key={r.label} className="flex items-center gap-1.5 text-[11px]">
          {r.met ? (
            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
          ) : (
            <Circle className="h-3 w-3 text-muted-foreground/50 shrink-0" />
          )}
          <span className={r.met ? "text-emerald-600 opacity-70" : "text-muted-foreground"}>
            {r.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
