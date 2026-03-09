"use client";

import type { Machine } from "@/lib/type";

interface AlertBannerProps {
  machines: Machine[];
}

export default function AlertBanner({ machines }: AlertBannerProps) {
  const risky = machines.filter((m) => m.bearing_risk === "HIGH");
  if (!risky.length) return null;

  return (
    <div
      className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl border border-dash-red bg-dash-red-bg animate-alert-slide mt-6"
      style={{ boxShadow: "0 0 20px var(--red-glow)" }}
    >
      <div
        className="w-8.5 h-8.5 rounded-full border-2 border-dash-red bg-dash-red-bg flex items-center justify-center shrink-0 animate-risk-pulse"
      >
        <span className="text-base">⚠</span>
      </div>
      <div>
        <p className="font-mono text-[12px] font-bold tracking-[0.06em] text-dash-red">
          BEARING RISK ALERT
        </p>
        <p className="font-sans text-[13px] text-dash-text-secondary mt-0.5">
          {risky.map((m) => m.machine_id).join(", ")} — schedule inspection immediately
        </p>
      </div>
    </div>
  );
}