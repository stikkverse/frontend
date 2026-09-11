"use client";

import { useDashboardSummary, useDashboardMachines } from "@/hooks/useDashboard";
import { getRiskColor, getHealthColor } from "@/lib/helper";
import MetricCard from "@/components/dashboard/MetricCard";
import AlertBanner from "@/components/dashboard/AlertBanner";
import { useMillSummary } from "@/hooks/useMillSummary";
import HealthRing from "@/components/dashboard/HealthRing";
import Link from "next/link";

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

  const { data: millData, isLoading: millLoading } = useMillSummary();

  const {
    data: machines = [],
    isLoading: machinesLoading,
    isPlaceholderData: machinesPlaceholder,
  } = useDashboardMachines();

  const metrics = millData?.summary_metrics;
  const millMachines = millData?.machines ?? [];

  const showError = summaryError && isConnectivityError(summaryErrorObj);

  
  const machinesTotal = summary?.machine_count ?? millMachines.length;
  const millId = millData?.mill_id ?? "";
  const isEmpty = !summaryLoading && !showError && machinesTotal === 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-sans text-[20px] font-bold m-0 text-(--text)">
          Energy &amp; Carbon Summary
        </h2>
        {millLoading ? (
          <div className="h-4 w-64 rounded bg-(--bg-alt) animate-pulse mt-1" />
        ) : (
          <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
            {isEmpty
              ? "No data yet — upload your first CSV to get started"
              : `Aggregated performance metrics across ${machinesTotal} machines${millId ? ` — Mill ${millId}` : ""}`}
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
            <MetricSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              label="TOTAL EXCESS CO₂"
              value={(metrics?.total_excess_co2_kg ?? 0).toFixed(1)}
              unit="kg"
              accentColor="var(--amber)"
              delay={100}
            />
            <MetricCard
              label="AVOIDABLE COST"
              value={(metrics?.avoidable_cost_usd ?? 0).toFixed(2)}
              prefix="$"
              accentColor="var(--cyan)"
              delay={200}
            />
            <MetricCard
              label="TOTAL CO₂"
              value={(metrics?.total_co2_kg ?? 0).toFixed(1)}
              unit="kg"
              accentColor="var(--amber)"
              delay={300}
            />
            <MetricCard
              label="TOTAL ENERGY"
              value={(metrics?.total_energy_kwh ?? 0).toFixed(2)}
              unit="KWH"
              accentColor="var(--red)"
              delay={400}
            />
            <MetricCard
              label="MACHINES ACTIVE"
              value={`${millMachines.length}/${machinesTotal}`}
              accentColor="var(--green)"
              delay={500}
            />
          </>
        )}
      </div>

      {!machinesLoading && !machinesPlaceholder && machines.length > 0 && (
        <AlertBanner machines={machines as any} />
      )}

      <div className="my-6">
        <h3 className="font-sans text-base font-semibold mb-6 text-(--text)">
          Machine Health at a Glance
        </h3>

        {millLoading ? (
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
        ) : millMachines.length === 0 ? (
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
          <Link href="/dashboard/machines">
            <div className="flex justify-between items-center flex-wrap">
              {millMachines.map((m) => {
                
                const rc = getRiskColor(m.bearing_risk ?? "NORMAL");
                return (
                  <div
                    key={m.machine_id}
                    className="rounded-[10px] border bg-(--surface) p-4 lg:w-[32%] md:w-[32%] w-full mb-4"
                    style={{
                      borderColor: "var(--border)",
                      borderTop: `3px solid ${rc}`,
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    <p className="font-mono text-[14px] font-bold" style={{ color: "var(--text)" }}>
                      {m.machine_id}
                    </p>
                    <p className="font-mono text-[10px] text-(--text)">
                      {m.name}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-mono text-[9px] tracking-widest mt-0.5 text-(--text-muted)">
                          {m.bearing_risk ?? "NORMAL"}
                        </p>
                        <p className="text-[13px] text-cyan-300">
                          {m.run_hours} Hours
                        </p>
                      </div>
                      <HealthRing score={m.health_score ?? 0} size={90} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}