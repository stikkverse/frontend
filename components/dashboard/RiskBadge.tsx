"use client";

import { getRiskColor, getRiskBg } from "@/lib/helper";
import type { BearingRisk } from "@/lib/type";

interface RiskBadgeProps {
  risk: BearingRisk;
}

export default function RiskBadge({ risk }: RiskBadgeProps) {
  const color = getRiskColor(risk);
  const bg    = getRiskBg(risk);

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        border: `1px solid ${color}`,
        background: bg,
        animation: risk === "HIGH" ? "riskPulse 1.5s ease-in-out infinite" : "none",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span
        className="font-mono text-[10px] font-semibold tracking-[0.08em]"
        style={{ color }}
      >
        {risk}
      </span>
    </div>
  );
}