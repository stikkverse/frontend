"use client";

import { useState, useEffect } from "react";
import { getRiskColor, getRiskGlow, getHealthColor, getCO2Color } from "@/lib/helper";
import type { DashboardMachine } from "@/lib/type";
import RiskBadge from "./RiskBadge";
import HealthRing from "./HealthRing";
import PulseLine from "./PulseLine";

interface MachineCardProps {
  machine: DashboardMachine;
  index: number;
}

export default function MachineCard({ machine, index }: MachineCardProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const isIdle    = machine.status === "IDLE";
  const co2       = machine.excess_co2_today_kg ?? 0;
  const health    = machine.health_score ?? 0;
  const risk      = machine.bearing_risk ?? "NORMAL";
  const color     = getRiskColor(risk);
  const hColor    = getHealthColor(health);
  const co2Color  = getCO2Color(co2);

  useEffect(() => {
    const tm = setTimeout(() => setVisible(true), 120 + index * 100);
    return () => clearTimeout(tm);
  }, [index]);

  return (
    <div
      className="rounded-[14px] border border-dash-border bg-dash-surface overflow-hidden shadow-card transition-all duration-500"
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
            <p className="font-mono text-[20px] font-bold tracking-[0.04em] text-dash-text">
              {machine.machine_id ?? "—"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="w-1.75 h-1.75 rounded-full"
                style={{
                  background: isIdle ? "var(--text-muted)" : "var(--green)",
                  boxShadow: isIdle ? "none" : "0 0 8px var(--green-glow)",
                  animation: isIdle ? "none" : "statusPulse 2s infinite",
                }}
              />
              <span
                className="font-mono text-[10px] tracking-[0.1em]"
                style={{ color: isIdle ? "var(--text-muted)" : "var(--green)" }}
              >
                {machine.status ?? "—"}
              </span>
            </div>
          </div>
          <RiskBadge risk={risk} />
        </div>

        <div className="flex items-center gap-5">
          <HealthRing score={health} size={90} />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] tracking-[0.14em] text-dash-text-muted mb-1">
              EXCESS CO₂ TODAY
            </p>
            <div className="flex items-baseline gap-1">
              <span
                className="font-mono text-[26px] font-bold leading-none"
                style={{ color: co2Color }}
              >
                {co2.toFixed(1)}
              </span>
              <span className="font-mono text-[11px] text-dash-text-muted">kg</span>
            </div>
            <p className="font-mono text-[9px] tracking-[0.14em] text-dash-text-muted mt-2.5">
              BEARING STATUS
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <PulseLine color={hColor} risk={risk} muted={isIdle} />
      </div>
    </div>
  );
}