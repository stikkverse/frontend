"use client";

import { useState } from "react";
import {
  useAlerts,
  useAlertHistory,
  useAcknowledgeAlert,
  useResolveAlert,
} from "@/hooks/useAlerts";
import type { Alert, AlertType, ResolutionCategory } from "@/lib/type";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePermissions } from "@/hooks/usePermissions";

function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_STYLES: Record<
  AlertType,
  { color: string; bg: string; icon: string }
> = {
  DATA_GAP: { color: "var(--amber)", bg: "var(--amber-bg)", icon: "◈" },
  WARNING: { color: "var(--red)", bg: "var(--red-bg)", icon: "⚠" },
  CO2_INCREASE: { color: "var(--amber)", bg: "var(--amber-bg)", icon: "↑" },
};

const DEFAULT_TYPE_STYLE = {
  color: "var(--text-muted)",
  bg: "var(--bg-alt)",
  icon: "ℹ",
};

const RESOLUTION_CATEGORIES: { value: ResolutionCategory; label: string }[] = [
  { value: "hardware_fixed", label: "Hardware Fixed" },
  { value: "software_fix", label: "Software Fix" },
  { value: "false_alarm", label: "False Alarm" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
];

// ─── Resolve Modal ────────────────────────────────────────────────────────────

function ResolveModal({
  alert,
  open,
  onClose,
  onSubmit,
  isPending,
}: {
  alert: Alert | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (note: string, category: ResolutionCategory) => void;
  isPending: boolean;
}) {
  const [note, setNote] = useState("");
  const [category, setCategory] =
    useState<ResolutionCategory>("hardware_fixed");

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setNote("");
      setCategory("hardware_fixed");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle
          className="font-mono text-[14px] tracking-widest"
          style={{ color: "var(--text)" }}
        >
          RESOLVE ALERT
        </DialogTitle>
        <DialogDescription
          className="font-sans text-[13px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {alert
            ? `Machine ${alert.machine_id ?? "Unknown"} — ${alert.type}`
            : ""}
        </DialogDescription>

        <div className="flex flex-col gap-4 mt-2">
          <div>
            <p
              className="font-mono text-[10px] tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              RESOLUTION CATEGORY
            </p>
            <div className="grid grid-cols-2 gap-2">
              {RESOLUTION_CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className="font-mono text-[10px] tracking-[0.05em] px-3 py-2 rounded-lg border text-left transition-all duration-150 cursor-pointer"
                  style={{
                    background:
                      category === c.value ? "var(--cyan-bg)" : "var(--bg-alt)",
                    borderColor:
                      category === c.value ? "var(--cyan)" : "var(--border)",
                    color:
                      category === c.value
                        ? "var(--cyan)"
                        : "var(--text-muted)",
                    fontWeight: category === c.value ? 600 : 400,
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p
              className="font-mono text-[10px] tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              RESOLUTION NOTE{" "}
              <span style={{ color: "var(--text-muted)" }}>(optional)</span>
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Briefly describe what was done to resolve this alert…"
              rows={3}
              className="w-full font-sans text-[13px] px-3 py-2.5 rounded-lg border resize-none outline-none transition-colors duration-150"
              style={{
                background: "var(--bg-alt)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              disabled={isPending}
              className="font-mono text-[11px] tracking-widest px-4 py-2 rounded-lg border cursor-pointer transition-all duration-150 hover:opacity-80 disabled:opacity-50"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
                background: "var(--bg-alt)",
              }}
            >
              CANCEL
            </button>
            <button
              onClick={() => onSubmit(note.trim(), category)}
              disabled={isPending}
              className="font-mono text-[11px] tracking-widest px-4 py-2 rounded-lg border cursor-pointer transition-all duration-150 hover:opacity-90 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, var(--green), #22c55e)",
                borderColor: "var(--green)",
                color: "white",
              }}
            >
              {isPending ? "RESOLVING…" : "MARK RESOLVED"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Alert Card ───────────────────────────────────────────────────────────────

function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
  isAckPending,
  isResolvePending,
  isHistory = false,
  canWrite,
}: {
  alert: Alert;
  onAcknowledge: (id: number) => void;
  onResolve: (alert: Alert) => void;
  isAckPending: boolean;
  isResolvePending: boolean;
  isHistory?: boolean;
  canWrite: boolean;
}) {
  const ts = TYPE_STYLES[alert.type] ?? DEFAULT_TYPE_STYLE;
  const isActive = alert.status === "active";
  const isAcknowledged = alert.status === "acknowledged";
  const isResolved = isHistory || alert.status === "resolved";

  const borderColor = isResolved
    ? "var(--green)"
    : isAcknowledged
      ? "var(--border)"
      : ts.color;

  return (
    <div
      className="rounded-[14px] border overflow-hidden transition-all duration-300 lg:w-[32%] md:w-[32%] w-full"
      style={{
        borderColor,
        background: "var(--surface)",
        boxShadow: "var(--card-shadow)",
        opacity: isResolved ? 0.7 : isAcknowledged ? 0.85 : 1,
      }}
    >
      {isResolved ? (
        <div
          className="h-0.75"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--green), transparent)",
          }}
        />
      ) : isActive ? (
        <div
          className="h-0.75"
          style={{
            background: `linear-gradient(90deg, transparent, ${ts.color}, transparent)`,
          }}
        />
      ) : null}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-[14px]"
              style={{
                background: isResolved ? "var(--green-bg)" : ts.bg,
                border: `1.5px solid ${isResolved ? "var(--green)" : ts.color}`,
                color: isResolved ? "var(--green)" : ts.color,
              }}
            >
              {isResolved ? "✓" : ts.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono text-[13px] font-bold"
                  style={{ color: "var(--text)" }}
                >
                  {alert.machine_id ?? "Unknown Machine"}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold tracking-[0.06em]"
                  style={{
                    background: isResolved ? "var(--green-bg)" : ts.bg,
                    color: isResolved ? "var(--green)" : ts.color,
                    border: `1px solid ${isResolved ? "var(--green)" : ts.color}`,
                  }}
                >
                  {isResolved ? "RESOLVED" : alert.type.replace(/_/g, " ")}
                </span>
              </div>
              <p
                className="font-mono text-[9px] tracking-widest mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {alert.status.toUpperCase()}
                {alert.timestamp
                  ? ` — ${formatRelativeTime(alert.timestamp)}`
                  : ""}
              </p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {isResolved ? (
              <span
                className="font-mono text-[9px] tracking-[0.08em] px-2 py-1 rounded-md"
                style={{ color: "var(--green)", background: "var(--green-bg)" }}
              >
                ✓ RESOLVED
              </span>
            ) : !canWrite ? (
              <span
                className="font-mono text-[9px] tracking-[0.08em] px-2 py-1 rounded-md"
                style={{
                  color: isAcknowledged ? "var(--amber)" : "var(--text-muted)",
                  background: isAcknowledged
                    ? "var(--amber-bg)"
                    : "var(--bg-alt)",
                }}
              >
                {isAcknowledged ? "IN PROGRESS" : "ACTIVE"}
              </span>
            ) : (
              <>
                {isActive && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    disabled={isAckPending}
                    className="font-mono text-[10px] font-semibold tracking-[0.06em] px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80 disabled:opacity-50"
                    style={{
                      background: "var(--cyan-bg)",
                      border: "1px solid var(--cyan)",
                      color: "var(--cyan)",
                    }}
                  >
                    {isAckPending ? "…" : "ACKNOWLEDGE"}
                  </button>
                )}
                {isAcknowledged && (
                  <span
                    className="font-mono text-[9px] tracking-[0.08em] px-2 py-1 rounded-md"
                    style={{
                      color: "var(--amber)",
                      background: "var(--amber-bg)",
                    }}
                  >
                    IN PROGRESS
                  </span>
                )}
                <button
                  onClick={() => onResolve(alert)}
                  disabled={isResolvePending}
                  className="font-mono text-[10px] font-semibold tracking-[0.06em] px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80 disabled:opacity-50"
                  style={{
                    background: "var(--green-bg)",
                    border: "1px solid var(--green)",
                    color: "var(--green)",
                  }}
                >
                  {isResolvePending ? "…" : "RESOLVE"}
                </button>
              </>
            )}
          </div>
        </div>

        <p
          className="font-sans text-[13px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {alert.message}
        </p>

        {isAcknowledged && alert.acknowledged_at && (
          <p
            className="font-mono text-[10px] mt-2"
            style={{ color: "var(--text-muted)" }}
          >
            Acknowledged{" "}
            {new Date(alert.acknowledged_at).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}

        {isResolved && alert.resolved_at && (
          <p
            className="font-mono text-[10px] mt-2"
            style={{ color: "var(--text-muted)" }}
          >
            Resolved{" "}
            {new Date(alert.resolved_at).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {alert.resolution_category
              ? ` · ${alert.resolution_category.replace(/_/g, " ")}`
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

type FilterTab = "active" | "acknowledged" | "resolved" | "all";

export default function AlertsPage() {
  const { data: activeAlerts = [], isLoading, isError, error } = useAlerts();
  const { data: historyAlerts = [], isLoading: historyLoading } =
    useAlertHistory({ limit: 50 });
  const { mutate: acknowledge, isPending: isAckPending } =
    useAcknowledgeAlert();
  const { mutate: resolve, isPending: isResolvePending } = useResolveAlert();

  const [filter, setFilter] = useState<FilterTab>("active");
  const [resolveTarget, setResolveTarget] = useState<Alert | null>(null);
  const { canWrite } = usePermissions();

  const handleAcknowledge = (id: number) => acknowledge(id);

  const handleResolveSubmit = (note: string, category: ResolutionCategory) => {
    if (!resolveTarget) return;
    resolve(
      {
        alertId: resolveTarget.id,
        payload: {
          resolution_note: note || null,
          resolution_category: category,
        },
      },
      { onSettled: () => setResolveTarget(null) },
    );
  };

  // Split active feed by status
  const unacknowledged = activeAlerts.filter((a) => a.status === "active");
  const acknowledged = activeAlerts.filter((a) => a.status === "acknowledged");
  const activeCount = unacknowledged.length;

  const filtered: Alert[] =
    filter === "active"
      ? unacknowledged
      : filter === "acknowledged"
        ? acknowledged
        : filter === "resolved"
          ? historyAlerts
          : [...activeAlerts, ...historyAlerts];

  const isLoadingTab = filter === "resolved" ? historyLoading : isLoading;

  const showError =
    isError &&
    (() => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (!status) return true;
      return status >= 500;
    })();

  const tabCounts: Record<FilterTab, number> = {
    active: activeCount,
    acknowledged: acknowledged.length,
    resolved: historyAlerts.length,
    all: activeAlerts.length + historyAlerts.length,
  };

  const TAB_BADGE: Record<
    FilterTab,
    { color: string; bg: string; border: string }
  > = {
    active: {
      color: "var(--red)",
      bg: "var(--red-bg)",
      border: "1px solid var(--red)",
    },
    acknowledged: {
      color: "var(--amber)",
      bg: "var(--amber-bg)",
      border: "1px solid var(--amber)",
    },
    resolved: {
      color: "var(--green)",
      bg: "var(--green-bg)",
      border: "1px solid var(--green)",
    },
    all: {
      color: "var(--text-muted)",
      bg: "var(--bg-alt)",
      border: "1px solid var(--border)",
    },
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2
            className="font-sans text-[20px] font-bold m-0"
            style={{ color: "var(--text)" }}
          >
            Alerts
          </h2>
          <p
            className="font-sans text-[13px] mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {isLoading
              ? "Loading alerts..."
              : activeAlerts.length === 0 && historyAlerts.length === 0
                ? "No alerts yet — alerts will appear once machine data is uploaded"
                : `${activeCount} active alert${activeCount !== 1 ? "s" : ""} requiring attention`}
          </p>
        </div>

        <div
          className="flex gap-1 p-1 rounded-lg border"
          style={{ borderColor: "var(--border)", background: "var(--bg-alt)" }}
        >
          {(["active", "acknowledged", "resolved", "all"] as FilterTab[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="font-mono text-[10px] tracking-[0.06em] px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 capitalize flex items-center gap-1.5"
                style={{
                  background:
                    filter === f ? "var(--tab-active-bg)" : "transparent",
                  color:
                    filter === f ? "var(--tab-active)" : "var(--text-muted)",
                  fontWeight: filter === f ? 600 : 400,
                }}
              >
                {f}
                {tabCounts[f] > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[8px] font-bold"
                    style={TAB_BADGE[f]}
                  >
                    {tabCounts[f]}
                  </span>
                )}
              </button>
            ),
          )}
        </div>
      </div>

      {showError && (
        <div
          className="rounded-[10px] border p-4 font-mono text-[12px]"
          style={{
            borderColor: "var(--red)",
            color: "var(--red)",
            background: "var(--red-bg)",
          }}
        >
          ⚠ Failed to load alerts. Retrying automatically…
        </div>
      )}

      {isLoadingTab ? (
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
                ? "NO IN-PROGRESS ALERTS"
                : filter === "resolved"
                  ? "NO RESOLVED ALERTS"
                  : "NO ALERTS YET"}
          </p>
          <p className="font-sans text-[13px] text-(--text-secondary)">
            {filter === "active"
              ? "All clear — no active alerts at the moment."
              : filter === "acknowledged"
                ? "No alerts are currently being investigated."
                : filter === "resolved"
                  ? "Resolved alerts will appear here as an auditable history."
                  : "Alerts will appear here once your machines start reporting data."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row md:flex-row flex-wrap gap-5">
          {filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onResolve={(a) => setResolveTarget(a)}
              isAckPending={isAckPending}
              isResolvePending={isResolvePending}
              isHistory={filter === "resolved"}
              canWrite={canWrite}
            />
          ))}
        </div>
      )}

      <ResolveModal
        alert={resolveTarget}
        open={Boolean(resolveTarget)}
        onClose={() => setResolveTarget(null)}
        onSubmit={handleResolveSubmit}
        isPending={isResolvePending}
      />
    </div>
  );
}
