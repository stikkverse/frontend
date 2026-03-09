"use client";

import { getRiskColor, getHealthColor } from "@/lib/helper";
import type { DashboardData } from "@/lib/type";
import MetricCard from "../MetricCard";
import AlertBanner from "../AlertBanner";

interface OverviewTabProps {
  data: DashboardData;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  const running = data.machines.filter((m) => m.status === "RUNNING").length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-sans text-[20px] font-bold text-dash-text m-0">
          Energy & Carbon Summary
        </h2>
        <p className="font-sans text-[13px] text-dash-text-secondary mt-1">
          Aggregated performance metrics across all machines in Mill{" "}
          {data.mill_id}
        </p>
      </div>

      <div
        className="grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
      >
        <MetricCard
          label="TOTAL EXCESS CO₂"
          value={data.total_excess_co2_kg.toFixed(1)}
          unit="kg"
          accentColor="var(--amber)"
          delay={100}
        />
        <MetricCard
          label="AVOIDABLE COST"
          value={data.avoidable_cost_usd.toFixed(2)}
          prefix="$"
          accentColor="var(--red)"
          delay={200}
        />
        <MetricCard
          label="MACHINES ACTIVE"
          value={`${running}/${data.machines.length}`}
          accentColor="var(--green)"
          delay={300}
        />
      </div>

      <AlertBanner machines={data.machines} />

      <div className="my-6">
        <h3 className="font-sans text-base font-semibold text-dash-text mb-3">
          Fleet Health at a Glance
        </h3>
        <div className="flex gap-2.5 flex-wrap justify-between">
          {data.machines.map((m) => {
            const hc = getHealthColor(m.health_score);
            const rc = getRiskColor(m.bearing_risk);
            return (
              <div
                key={m.machine_id}
                className="rounded-[10px] border border-dash-border bg-dash-surface p-[12px_16px] lg:w-[19%] md:w-[19%] w-full mb-3 shadow-card"
                style={{ borderTop: `3px solid ${rc}` }}
              >
                <p className="font-mono text-[14px] font-bold text-dash-text">
                  {m.machine_id}
                </p>
                <p
                  className="font-mono text-[22px] font-bold mt-1"
                  style={{ color: hc }}
                >
                  {m.health_score}
                </p>
                <p className="font-mono text-[9px] tracking-[0.1em] text-dash-text-muted mt-0.5">
                  {m.status === "IDLE" ? "IDLE" : m.bearing_risk}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
