"use client";

import { useState } from "react";
import { useAlerts, useAcknowledgeAlert } from "@/hooks/useAlerts";
import type { Alert } from "@/lib/type";
import { getRiskColor, getRiskBg } from "@/lib/helper";
import type { BearingRisk } from "@/lib/type";

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function AlertCard({
  alert,
  onAcknowledge,
  isPending,
}: {
  alert: Alert;
  onAcknowledge: (id: number) => void;
  isPending: boolean;
}) {
  const color = getRiskColor(alert.severity as BearingRisk);
  const bg = getRiskBg(alert.severity as BearingRisk);

  return (
    <div
      className="rounded-[14px] border overflow-hidden transition-all duration-300"
      style={{
        borderColor: alert.acknowledged ? "var(--border)" : color,
        background: "var(--surface)",
        boxShadow: "var(--card-shadow)",
        opacity: alert.acknowledged ? 0.7 : 1,
      }}
    >
      {!alert.acknowledged && (
        <div
          className="h-0.75"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: bg, border: `1.5px solid ${color}` }}
            >
              <span className="text-sm">
                {alert.severity === "HIGH" ? "⚠" : alert.severity === "WARNING" ? "◈" : "ℹ"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[14px] font-bold" style={{ color: "var(--text)" }}>
                  {alert.machine_id}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold tracking-[0.06em]"
                  style={{ background: bg, color, border: `1px solid ${color}` }}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="font-mono text-[9px] tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>
                {(alert.alert_type ?? "").replace(/_/g, " ")}
                {alert.created_at ? ` — ${formatRelativeTime(alert.created_at)}` : ""}
              </p>
            </div>
          </div>

          {!alert.acknowledged ? (
            <button
              onClick={() => onAcknowledge(alert.id)}
              disabled={isPending}
              className="shrink-0 font-mono text-[10px] font-semibold tracking-[0.06em] px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80 disabled:opacity-50"
              style={{
                background: "var(--cyan-bg)",
                border: "1px solid var(--cyan)",
                color: "var(--cyan)",
              }}
            >
              {isPending ? "..." : "ACKNOWLEDGE"}
            </button>
          ) : (
            <span
              className="shrink-0 font-mono text-[9px] tracking-[0.08em] px-2 py-1 rounded-md"
              style={{ color: "var(--green)", background: "var(--green-bg)" }}
            >
              ✓ ACK&apos;D
            </span>
          )}
        </div>

        <p className="font-sans text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {alert.message}
        </p>

        {alert.acknowledged && alert.acknowledged_by && (
          <p className="font-mono text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>
            Acknowledged by {alert.acknowledged_by}
            {alert.acknowledged_at
              ? ` on ${new Date(alert.acknowledged_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
          </p>
        )}
      </div>
    </div>
  );
}

function AlertSkeleton() {
  return (
    <div
      className="rounded-[14px] border p-5 animate-pulse"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-(--bg-alt) shrink-0" />
        <div className="flex-1">
          <div className="h-4 w-32 rounded bg-(--bg-alt) mb-2" />
          <div className="h-3 w-48 rounded bg-(--bg-alt)" />
        </div>
      </div>
    </div>
  );
}

type FilterTab = "all" | "active" | "acknowledged";

export default function AlertsPage() {
  const { data: alerts = [], isLoading, isError, error } = useAlerts();
  const { mutate: acknowledge, isPending } = useAcknowledgeAlert();

  
  const [filter, setFilter] = useState<FilterTab>("active");

  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged);
  const activeCount = activeAlerts.length;


  const filtered: Alert[] =
    filter === "active"
      ? activeAlerts
      : filter === "acknowledged"
        ? acknowledgedAlerts
        : alerts;

  const showError = isError && (() => {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (!status) return true;
    return status >= 500;
  })();

  const tabCounts: Record<FilterTab, number> = {
    all: alerts.length,
    active: activeCount,
    acknowledged: acknowledgedAlerts.length,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-sans text-[20px] font-bold m-0" style={{ color: "var(--text)" }}>
            Alerts
          </h2>
          <p className="font-sans text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
            {isLoading
              ? "Loading alerts..."
              : alerts.length === 0
                ? "No alerts yet — alerts will appear once machine data is uploaded"
                : `${activeCount} active alert${activeCount !== 1 ? "s" : ""} requiring attention`}
          </p>
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-1 p-1 rounded-lg border"
          style={{ borderColor: "var(--border)", background: "var(--bg-alt)" }}
        >
          {(["all", "active", "acknowledged"] as FilterTab[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-mono text-[10px] tracking-[0.06em] px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 capitalize flex items-center gap-1.5"
              style={{
                background: filter === f ? "var(--tab-active-bg)" : "transparent",
                color: filter === f ? "var(--tab-active)" : "var(--text-muted)",
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f}
              {tabCounts[f] > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[8px] font-bold"
                  style={{
                    background: f === "active" ? "var(--red-bg)" : "var(--bg-alt)",
                    color: f === "active" ? "var(--red)" : "var(--text-muted)",
                    border: f === "active" ? "1px solid var(--red)" : "1px solid var(--border)",
                  }}
                >
                  {tabCounts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {showError && (
        <div
          className="rounded-[10px] border p-4 font-mono text-[12px]"
          style={{ borderColor: "var(--red)", color: "var(--red)", background: "var(--red-bg)" }}
        >
          ⚠ Failed to load alerts. Retrying automatically…
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <AlertSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-[14px] border border-dashed p-12 text-center"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-mono text-[12px] tracking-widest text-(--text-muted) mb-2">
            {filter === "active"
              ? "NO ACTIVE ALERTS"
              : filter === "acknowledged"
                ? "NO ACKNOWLEDGED ALERTS"
                : "NO ALERTS YET"}
          </p>
          <p className="font-sans text-[13px] text-(--text-secondary)">
            {filter === "all"
              ? "Alerts will appear here once your machines start reporting data."
              : filter === "active"
                ? "All clear — no active alerts at the moment."
                : "No alerts have been acknowledged yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledge}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}