"use client";

import {
  MOCK_DASHBOARD_SUMMARY,
  MOCK_DASHBOARD_MACHINES,
} from "@/lib/mockData";
import { getRiskColor, getHealthColor } from "@/lib/helper";
import MetricCard from "@/components/dashboard/MetricCard";
import AlertBanner from "@/components/dashboard/AlertBanner";

export default function OverviewPage() {
  const summary = MOCK_DASHBOARD_SUMMARY;
  const machines = MOCK_DASHBOARD_MACHINES;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-sans text-[20px] font-bold m-0 text-(--text)">
          Energy &amp; Carbon Summary
        </h2>
        <p
          className="font-sans text-[13px] mt-1 text-(--text-secondary)"
        >
          Aggregated performance metrics across {summary.machines_total}{" "}
          machines in {summary.mill_name}
        </p>
      </div>

      <div
        className="flex gap-5 items-center"
      >
        <MetricCard
          label="TOTAL EXCESS CO₂"
          value={summary.total_excess_co2_kg.toFixed(1)}
          unit="kg"
          accentColor="var(--amber)"
          delay={100}
        />
        <MetricCard
          label="AVOIDABLE COST"
          value={summary.avoidable_cost_usd.toFixed(2)}
          prefix="$"
          accentColor="var(--red)"
          delay={200}
        />
        <MetricCard
          label="MACHINES ACTIVE"
          value={`${summary.machines_running}/${summary.machines_total}`}
          accentColor="var(--green)"
          delay={300}
        />
        <MetricCard
          label="MACHINES IDLE"
          value={String(summary.machines_idle)}
          accentColor="var(--text-muted)"
          delay={400}
        />
      </div>

      <AlertBanner machines={machines} />

      <div className="my-6">
        <h3
          className="font-sans text-base font-semibold mb-3 text-(--text)"
        >
          Fleet Health at a Glance
        </h3>
        <div className="flex gap-2.5 flex-wrap justify-between">
          {machines.map((m) => {
            const hc = getHealthColor(m.health_score);
            const rc = getRiskColor(m.bearing_risk);
            return (
              <div
                key={m.machine_id}
                className="rounded-[10px] border bg-(--surface) p-6 lg:w-[19%] md:w-[19%] w-full mb-3"
                style={{
                  borderColor: "var(--border)",
                  borderTop: `3px solid ${rc}`,
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <p
                  className="font-mono text-[14px] font-bold"
                  style={{ color: "var(--text)" }}
                >
                  {m.machine_id}
                </p>
                <p
                  className="font-mono text-[22px] font-bold mt-1"
                  style={{ color: hc }}
                >
                  {m.health_score}
                </p>
                <p
                  className="font-mono text-[9px] tracking-widest mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
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
