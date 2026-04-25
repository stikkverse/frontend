"use client";

import { useState, useEffect } from "react";
import { getRiskColor, getRiskGlow, getHealthColor, getCO2Color } from "@/lib/helper";
import type { MillMachine } from "@/lib/type";
import RiskBadge from "./RiskBadge";
import HealthRing from "./HealthRing";
import PulseLine from "./PulseLine";

interface MachineCardProps {
  machine: MillMachine;
  index: number;
}

export default function MachineCard({ machine, index }: MachineCardProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const co2 = machine.excess_co2_kg ?? 0;
  const health = machine.health_score ?? 0;
  const risk = machine.bearing_risk ?? "NORMAL";
  const category = machine.health_score_breakdown?.category ?? "";
  const isIdle = category.toLowerCase() === "idle";
  const color = getRiskColor(risk);
  const hColor = getHealthColor(health);
  const co2Color = getCO2Color(co2);

  useEffect(() => {
    const tm = setTimeout(() => setVisible(true), 120 + index * 100);
    return () => clearTimeout(tm);
  }, [index]);

  return (
    <div
      className="rounded-[14px] border border-border bg-(--surface) overflow-hidden shadow-(--card-shadow) transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="h-0.75"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 1px 8px ${getRiskGlow(risk)}`,
        }}
      />

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
          <HealthRing score={health} size={90} />
          <div className="">
            <p className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted) mb-1">
              EXCESS CO₂
            </p>
            <div className="flex items-baseline gap-1">
              <span
                className="font-mono text-[26px] font-bold leading-none"
                style={{ color: co2Color }}
              >
                {co2.toFixed(2)}
              </span>
              <span className="font-mono text-[11px] text-(--text-muted)">kg</span>
            </div>
            <div className="flex gap-4 mt-2.5">
              <div>
                <p className="font-mono text-[8px] tracking-[0.12em] text-(--text-muted)">ENERGY</p>
                <p className="font-mono text-[12px] font-semibold text-(--cyan)">
                  {machine.total_energy_kwh.toFixed(1)} <span className="text-(--text-muted) font-normal text-[10px]">kWh</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-[8px] tracking-[0.12em] text-(--text-muted)">CURRENT</p>
                <p className="font-mono text-[12px] font-semibold text-(--text)">
                  {machine.avg_current_A.toFixed(1)} <span className="text-(--text-muted) font-normal text-[10px]">A</span>
                </p>
              </div>
            </div>

            {/* Insights */}
            {machine.insights.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-2">
                {machine.insights.map((insight) => (
                  <span
                    key={insight}
                    className="font-mono text-[8px] tracking-[0.06em] px-1.5 py-0.5 rounded-full bg-(--amber-bg) text-(--amber) border border-(--amber)"
                  >
                    {insight}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2">
        <PulseLine color={hColor} risk={risk} muted={isIdle} />
      </div>
    </div>
  );
}