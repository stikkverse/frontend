"use client";

import { useDashboardSummary, useDashboardMachines } from "@/hooks/useDashboard";
import { getRiskColor, getHealthColor } from "@/lib/helper";
import MetricCard from "@/components/dashboard/MetricCard";
import AlertBanner from "@/components/dashboard/AlertBanner";

// Skeleton shimmer for metric cards
function MetricSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-dash-border bg-(--surface) py-8 px-6 shadow-card lg:w-[20%] md:w-[20%] w-full animate-pulse">
      <div className="h-2 w-24 rounded bg-(--bg-alt) mb-4" />
      <div className="h-9 w-32 rounded bg-(--bg-alt)" />
    </div>
  );
}

export default function OverviewPage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useDashboardSummary();

  const {
    data: machines = [],
    isLoading: machinesLoading,
  } = useDashboardMachines();

  if (summaryError) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="font-mono text-[13px] text-(--red)">
          ⚠ Failed to load dashboard data. Check your connection and refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-sans text-[20px] font-bold m-0 text-(--text)">
          Energy &amp; Carbon Summary
        </h2>
        {summaryLoading ? (
          <div className="h-4 w-64 rounded bg-(--bg-alt) animate-pulse mt-1" />
        ) : (
          <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
            Aggregated performance metrics across {summary!.machines_total}{" "}
            machines in {summary!.mill_name}
          </p>
        )}
      </div>

      <div className="flex gap-5 items-center flex-wrap">
        {summaryLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              label="TOTAL EXCESS CO₂"
              value={summary!.total_excess_co2_kg.toFixed(1)}
              unit="kg"
              accentColor="var(--amber)"
              delay={100}
            />
            <MetricCard
              label="AVOIDABLE COST"
              value={summary!.avoidable_cost_usd.toFixed(2)}
              prefix="$"
              accentColor="var(--red)"
              delay={200}
            />
            <MetricCard
              label="MACHINES ACTIVE"
              value={`${summary!.machines_running}/${summary!.machines_total}`}
              accentColor="var(--green)"
              delay={300}
            />
            <MetricCard
              label="MACHINES IDLE"
              value={String(summary!.machines_idle)}
              accentColor="var(--text-muted)"
              delay={400}
            />
          </>
        )}
      </div>

      {!machinesLoading && <AlertBanner machines={machines} />}

      <div className="my-6">
        <h3 className="font-sans text-base font-semibold mb-3 text-(--text)">
          Fleet Health at a Glance
        </h3>

        {machinesLoading ? (
          <div className="flex gap-2.5 flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[10px] border bg-(--surface) p-6 lg:w-[19%] md:w-[19%] w-full mb-3 animate-pulse"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="h-4 w-16 rounded bg-(--bg-alt) mb-3" />
                <div className="h-8 w-12 rounded bg-(--bg-alt)" />
              </div>
            ))}
          </div>
        ) : (
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
                  <p className="font-mono text-[14px] font-bold" style={{ color: "var(--text)" }}>
                    {m.machine_id}
                  </p>
                  <p className="font-mono text-[22px] font-bold mt-1" style={{ color: hc }}>
                    {m.health_score}
                  </p>
                  <p className="font-mono text-[9px] tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {m.status === "IDLE" ? "IDLE" : m.bearing_risk}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}