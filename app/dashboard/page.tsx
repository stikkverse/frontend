"use client";

import { useDashboardSummary, useDashboardMachines } from "@/hooks/useDashboard";
import { getRiskColor, getHealthColor } from "@/lib/helper";
import MetricCard from "@/components/dashboard/MetricCard";
import AlertBanner from "@/components/dashboard/AlertBanner";

function MetricSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-dash-border bg-(--surface) py-8 px-6 shadow-card lg:w-[20%] md:w-[20%] w-full animate-pulse">
      <div className="h-2 w-24 rounded bg-(--bg-alt) mb-4" />
      <div className="h-9 w-32 rounded bg-(--bg-alt)" />
    </div>
  );
}

function isConnectivityError(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (!status) return true;
  if (status === 401 || status === 403 || status === 422) return false;
  return status >= 500;
}

export default function OverviewPage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErrorObj,
  } = useDashboardSummary();

  const {
    data: machines = [],
    isLoading: machinesLoading,
    isPlaceholderData: machinesPlaceholder,
  } = useDashboardMachines();

  const showError = summaryError && isConnectivityError(summaryErrorObj);
  const machinesTotal = summary?.machines_total ?? 0;
  const millName = summary?.mill_name ?? "";
  const isEmpty = !summaryLoading && !showError && machinesTotal === 0;

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
            {isEmpty
              ? "No data yet — upload your first CSV to get started"
              : `Aggregated performance metrics across ${machinesTotal} machines${millName ? ` in ${millName}` : ""}`}
          </p>
        )}
      </div>

      {showError && (
        <div
          className="rounded-[10px] border p-4 font-mono text-[12px]"
          style={{ borderColor: "var(--red)", color: "var(--red)", background: "var(--red-bg)" }}
        >
          ⚠ Failed to load dashboard data. Check your connection and refresh.
        </div>
      )}

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
              value={(summary?.total_excess_co2_kg ?? 0).toFixed(1)}
              unit="kg"
              accentColor="var(--amber)"
              delay={100}
            />
            <MetricCard
              label="AVOIDABLE COST"
              value={(summary?.avoidable_cost_usd ?? 0).toFixed(2)}
              prefix="$"
              accentColor="var(--red)"
              delay={200}
            />
            <MetricCard
              label="MACHINES ACTIVE"
              value={`${summary?.machines_running ?? 0}/${machinesTotal}`}
              accentColor="var(--green)"
              delay={300}
            />
            <MetricCard
              label="MACHINES IDLE"
              value={String(summary?.machines_idle ?? 0)}
              accentColor="var(--text-muted)"
              delay={400}
            />
          </>
        )}
      </div>

      {!machinesLoading && !machinesPlaceholder && machines.length > 0 && (
        <AlertBanner machines={machines} />
      )}

      <div className="my-6">
        <h3 className="font-sans text-base font-semibold mb-3 text-(--text)">
          Fleet Health at a Glance
        </h3>

        {machinesLoading ? (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[10px] border bg-(--surface) p-4 animate-pulse"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="h-4 w-16 rounded bg-(--bg-alt) mb-3" />
                <div className="h-8 w-12 rounded bg-(--bg-alt)" />
              </div>
            ))}
          </div>
        ) : machines.length === 0 ? (
          <div
            className="rounded-[14px] border border-dashed p-12 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="font-mono text-[12px] tracking-widest text-(--text-muted) mb-2">
              NO MACHINES REGISTERED
            </p>
            <p className="font-sans text-[13px] text-(--text-secondary)">
              Upload a baseline CSV to register your machines and start monitoring.
            </p>
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
          >
            {machines.map((m) => {
              const hc = getHealthColor(m.health_score ?? 0);
              const rc = getRiskColor(m.bearing_risk ?? "NORMAL");
              return (
                <div
                  key={m.machine_id}
                  className="rounded-[10px] border bg-(--surface) p-4"
                  style={{
                    borderColor: "var(--border)",
                    borderTop: `3px solid ${rc}`,
                    boxShadow: "var(--card-shadow)",
                  }}
                >
                  <p className="font-mono text-[13px] font-bold" style={{ color: "var(--text)" }}>
                    {m.machine_id}
                  </p>
                  <p className="font-mono text-[22px] font-bold mt-1" style={{ color: hc }}>
                    {m.health_score ?? 0}
                  </p>
                  <p className="font-mono text-[9px] tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {m.status === "IDLE" ? "IDLE" : (m.bearing_risk ?? "NORMAL")}
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