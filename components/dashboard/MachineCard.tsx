"use client";

import { useState, useEffect } from "react";
import type { MillMachine, BearingRisk } from "@/lib/type";
import RiskBadge from "./RiskBadge";
import HealthRing from "./HealthRing";
import PulseLine from "./PulseLine";
import { getInsightClass } from "@/lib/helper";

interface MachineCardProps {
  machine: MillMachine;
  index: number;
}

const RISK_ACCENT: Record<BearingRisk, { line: string; glow: string; pulse: string }> = {
  HIGH: {
    line: "bg-[linear-gradient(90deg,transparent,var(--red),transparent)]",
    glow: "shadow-[0_1px_8px_var(--red-glow)]",
    pulse: "bg-(--red) shadow-[0_0_8px_var(--red-glow)]",
  },
  WARNING: {
    line: "bg-[linear-gradient(90deg,transparent,var(--amber),transparent)]",
    glow: "shadow-[0_1px_8px_var(--amber-glow)]",
    pulse: "bg-(--amber) shadow-[0_0_8px_var(--amber-glow)]",
  },
  NORMAL: {
    line: "bg-[linear-gradient(90deg,transparent,var(--green),transparent)]",
    glow: "shadow-[0_1px_8px_var(--green-glow)]",
    pulse: "bg-(--green) shadow-[0_0_8px_var(--green-glow)]",
  },
};

function getHealthColorVar(score: number): string {
  if (score >= 80) return "var(--green)";
  if (score >= 60) return "var(--amber)";
  return "var(--red)";
}

function getCO2ColorClass(co2: number): string {
  if (co2 <= 1) return "text-(--green)";
  if (co2 <= 10) return "text-(--amber)";
  return "text-(--red)";
}



export default function MachineCard({ machine, index }: MachineCardProps) {
  const [visible, setVisible] = useState(false);

  const co2 = machine.excess_co2_kg ?? 0;
  const health = machine.health_score ?? 0;
  const risk = machine.bearing_risk ?? "NORMAL";
  const category =
    typeof machine.health_score_breakdown?.category === "string"
      ? machine.health_score_breakdown.category
      : "";
  const isIdle = category.toLowerCase() === "idle";
  const accent = RISK_ACCENT[risk];

  useEffect(() => {
    const tm = setTimeout(() => setVisible(true), 120 + index * 100);
    return () => clearTimeout(tm);
  }, [index]);

  return (
    <div
      className={[
        "rounded-[14px] border border-border bg-(--surface) overflow-hidden shadow-(--card-shadow)",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
    >
      <div className={`h-0.75 ${accent.line} ${accent.glow}`} />

      <div className="px-5.5 pt-4.5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-mono text-[20px] font-bold tracking-[0.04em] text-(--text)">
              {machine.machine_id}
            </p>
            <p className="font-sans text-[11px] text-(--text-secondary) mt-0.5">
              {machine.name}
            </p>
          </div>
          <RiskBadge category={category} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted) mb-1">
              EXCESS CO₂
            </p>
            <div className="flex items-baseline gap-1">
              <span className={`font-mono text-[26px] font-bold leading-none ${getCO2ColorClass(co2)}`}>
                {co2.toFixed(2)}
              </span>
              <span className="font-mono text-[11px] text-(--text-muted)">kg</span>
            </div>

            <div className="flex gap-4 mt-2.5">
              <div>
                <p className="font-mono text-[8px] tracking-[0.12em] text-(--text-muted)">ENERGY</p>
                <p className="font-mono text-[12px] font-semibold text-(--cyan)">
                  {machine.total_energy_kwh.toFixed(1)}{" "}
                  <span className="text-(--text-muted) font-normal text-[10px]">kWh</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-[8px] tracking-[0.12em] text-(--text-muted)">CURRENT</p>
                <p className="font-mono text-[12px] font-semibold text-(--text)">
                  {machine.avg_current_A.toFixed(1)}{" "}
                  <span className="text-(--text-muted) font-normal text-[10px]">A</span>
                </p>
              </div>
            </div>
          </div>

          <HealthRing score={health} size={90} />
        </div>
        {machine.insights.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-4">
            {machine.insights.map((insight) => (
              <span
                key={insight}
                className={`font-mono text-[8px] tracking-[0.06em] px-1.5 py-0.5 rounded-full border ${getInsightClass(insight)}`}
              >
                {insight}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2">
        <PulseLine color={getHealthColorVar(health)} risk={risk} muted={isIdle} />
      </div>
    </div>
  );
}