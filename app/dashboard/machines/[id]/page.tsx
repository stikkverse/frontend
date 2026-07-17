"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMillSummary } from "@/hooks/useMillSummary";
import { ArrowLeft } from "lucide-react";
import HealthRing from "@/components/dashboard/HealthRing";
import PulseLine from "@/components/dashboard/PulseLine";
import RiskBadge from "@/components/dashboard/RiskBadge";
import type { MillMachine } from "@/lib/type";
import {
  getHealthColor,
  getHealthLabel,
  getCO2Color,
  getInsightClass
} from "@/lib/helper";

function PenaltyBar({
  label,
  value,
  max = 50,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const colorClass =
    value === 0 ? "bg-(--green)" : value <= 15 ? "bg-(--amber)" : "bg-(--red)";

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] tracking-[0.08em] text-(--text-muted) w-16 shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[12px] font-semibold text-(--text) w-8 text-right">
        {value}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  color = "var(--text)",
}: {
  label: string;
  value: string;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="rounded-[12px] border border-border bg-(--surface) p-4 mb-4 shadow-(--card-shadow) lg:w-[47%] md:w-[47%] w-full">
      <p className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted) mb-1.5">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className="font-mono text-[24px] font-bold leading-none"
          style={{ color }}
        >
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[11px] text-(--text-muted)">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-(--bg-alt)" />
        <div className="h-6 w-40 rounded bg-(--bg-alt)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] border border-border bg-(--surface) p-4 h-20"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-[14px] border border-border bg-(--surface) p-6 h-60" />
        <div className="rounded-[14px] border border-border bg-(--surface) p-6 h-60" />
      </div>
    </div>
  );
}

export default function MachineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: millData, isLoading } = useMillSummary();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const machine: MillMachine | undefined = millData?.machines?.find(
    (m) => m.machine_id === decodeURIComponent(id),
  );

  if (!mounted || isLoading) return <PageSkeleton />;

  if (!machine) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="font-mono text-[14px] text-(--text-muted)">
          Machine &quot;{decodeURIComponent(id)}&quot; not found
        </p>
        <button
          onClick={() => router.push("/dashboard/machines")}
          className="font-mono text-[11px] tracking-[0.08em] px-4 py-2 rounded-lg border border-(--cyan) text-(--cyan) bg-(--cyan-bg) hover:opacity-80 transition-colors cursor-pointer"
        >
          BACK TO MACHINES
        </button>
      </div>
    );
  }

  const health = machine.health_score ?? 0;
  const risk = machine.bearing_risk ?? "NORMAL";
  const category =
    typeof machine.health_score_breakdown?.category === "string"
      ? machine.health_score_breakdown.category
      : "Good";
  const isIdle = category.toLowerCase() === "idle";
  const breakdown = (machine.health_score_breakdown as {
    load_penalty: number;
    peak_penalty: number;
    drift_penalty: number;
    category: string;
  }) ?? {
    load_penalty: 0,
    peak_penalty: 0,
    drift_penalty: 0,
    category,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/machines")}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-(--surface) text-(--text-muted) hover:text-(--cyan) hover:border-(--cyan) transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-mono text-[28px] font-bold tracking-[0.04em] text-(--text)">
              {machine.machine_id}
            </h1>
            <p className="font-sans text-[14px] text-(--text-secondary) mt-0.5">
              {machine.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge category={category} />
        </div>
        
      </div>
      <div className="flex justify-between lg:flex-row md:flex-row flex-col">
        <div className="lg:w-[50%] md:w-[50%] w-full">
        <div className="rounded-[14px] border border-border bg-(--surface) shadow-(--card-shadow) overflow-hidden">
          <div className="flex items-center gap-8 p-6 lg:flex-row md:flex-row flex-col">
            <div className="flex flex-col items-center gap-2">
              <HealthRing score={health} size={140} />
              <span className="font-mono text-[11px] tracking-[0.08em] text-(--text-muted)">
                {getHealthLabel(health)}
              </span>
            </div>
               
            <div className="flex-1">
              <p className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted) mb-3">
                HEALTH SCORE BREAKDOWN
              </p>
              <div className="flex flex-col gap-3">
                <PenaltyBar label="LOAD" value={breakdown.load_penalty} />
                <PenaltyBar label="PEAK" value={breakdown.peak_penalty} />
                <PenaltyBar label="DRIFT" value={breakdown.drift_penalty} />
              </div>
              <p className="font-mono text-[10px] text-(--text-muted) mt-3">
                Total penalty:{" "}
                {breakdown.load_penalty +
                  breakdown.peak_penalty +
                  breakdown.drift_penalty}{" "}
                pts → Health: {health}/100
              </p>
            </div>
          </div>
          <PulseLine
            color={getHealthColor(health)}
            risk={risk}
            muted={isIdle}
          />
          
        </div>
        <p className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted) mt-4 mb-2">
            INSIGHTS &amp; DIAGNOSTICS
          </p>
        {machine.insights.length > 0 ? (
              <div className="flex gap-3 mb-4">
                {machine.insights.map((insight) => (
                  <div
                    key={insight}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${getInsightClass(insight)}`}
                  >
                    <span className="font-mono text-[11px] font-semibold tracking-[0.04em]">
                      {insight}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-[12px] text-(--text-muted) py-4 text-center">
                No active insights
              </p>
            )}
            </div>
        <div className="flex justify-between items-center flex-wrap lg:w-[47%] md:w-[47%] w-full">
          <StatCard
            label="EXCESS CO₂"
            value={machine.excess_co2_kg.toFixed(2)}
            unit="kg"
            color={getCO2Color(machine.excess_co2_kg)}
          />
          <StatCard
            label="TOTAL ENERGY"
            value={machine.total_energy_kwh.toFixed(1)}
            unit="kWh"
            color="var(--cyan)"
          />
          <StatCard
            label="AVG CURRENT"
            value={machine.avg_current_A.toFixed(2)}
            unit="A"
          />
          <StatCard
            label="RUN HOURS"
            value={machine.run_hours.toFixed(1)}
            unit="h"
          />
          <StatCard
            label="TOTAL CO₂"
            value={machine.total_co2_kg.toFixed(2)}
            unit="kg"
            color="var(--amber)"
          />
          <StatCard
            label="STATUS"
            value={isIdle ? "IDLE" : "ACTIVE"}
            color={isIdle ? "var(--text-muted)" : "var(--green)"}
          />
        </div>
      </div>
    </div>
  );
}
