"use client";

import { useState } from "react";
import { MOCK_ALERTS } from "@/lib/mockData";
import type { Alert } from "@/lib/type";
import { getRiskColor, getRiskBg } from "@/lib/helper";
import type { BearingRisk } from "@/lib/type";

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function AlertCard({
  alert,
  onAcknowledge,
}: {
  alert: Alert;
  onAcknowledge: (id: number) => void;
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
                {alert.alert_type.replace(/_/g, " ")} — {formatRelativeTime(alert.created_at)}
              </p>
            </div>
          </div>

          {!alert.acknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="shrink-0 font-mono text-[10px] font-semibold tracking-[0.06em] px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{
                background: "var(--cyan-bg)",
                border: "1px solid var(--cyan)",
                color: "var(--cyan)",
              }}
            >
              ACKNOWLEDGE
            </button>
          )}

          {alert.acknowledged && (
            <span className="shrink-0 font-mono text-[9px] tracking-[0.08em] px-2 py-1 rounded-md" style={{ color: "var(--green)", background: "var(--green-bg)" }}>
              ✓ ACK&apos;D
            </span>
          )}
        </div>

        <p className="font-sans text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {alert.message}
        </p>

        {alert.acknowledged && alert.acknowledged_by && (
          <p className="font-mono text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>
            Acknowledged by {alert.acknowledged_by} on{" "}
            {new Date(alert.acknowledged_at!).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<"all" | "active" | "acknowledged">("all");

  const handleAcknowledge = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, acknowledged: true, acknowledged_at: new Date().toISOString(), acknowledged_by: "mgr@millb.com" }
          : a,
      ),
    );
  };

  const activeCount = alerts.filter((a) => !a.acknowledged).length;

  const filtered = alerts.filter((a) => {
    if (filter === "active") return !a.acknowledged;
    if (filter === "acknowledged") return a.acknowledged;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-sans text-[20px] font-bold m-0" style={{ color: "var(--text)" }}>
            Alerts
          </h2>
          <p className="font-sans text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
            {activeCount} active alert{activeCount !== 1 ? "s" : ""} requiring attention
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--bg-alt)" }}>
          {(["all", "active", "acknowledged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-mono text-[10px] tracking-[0.06em] px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 capitalize"
              style={{
                background: filter === f ? "var(--tab-active-bg)" : "transparent",
                color: filter === f ? "var(--tab-active)" : "var(--text-muted)",
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f}
              {f === "active" && activeCount > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold"
                  style={{ background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red)" }}
                >
                  {activeCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 font-mono text-[13px]" style={{ color: "var(--text-muted)" }}>
          {filter === "active" ? "No active alerts — all clear" : "No alerts to show"}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
          ))}
        </div>
      )}
    </div>
  );
}
