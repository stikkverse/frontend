"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMillAlertsOverview } from "@/hooks/useSuperadmin";
import type { AlertOverviewItem } from "@/lib/database/type";
import Pagination from "@/components/ui/pagination";

const MILLS_PER_PAGE = 12;

function typeStyle(type: string): { badge: string } {
  const t = type.toLowerCase();
  if (t.includes("bearing") || t.includes("critical")) {
    return { badge: "text-(--red) bg-(--red-bg) border-(--red)" };
  }
  if (t.includes("health") || t.includes("co2") || t.includes("excess")) {
    return { badge: "text-(--amber) bg-(--amber-bg) border-(--amber)" };
  }
  return { badge: "text-(--cyan) bg-(--cyan-bg) border-(--cyan)" };
}

function GroupSkeleton() {
  return (
    <div className="rounded-[14px] border border-border bg-(--surface) p-5 animate-pulse">
      <div className="h-4 w-56 rounded bg-(--bg-alt) mb-3" />
      <div className="h-3 w-32 rounded bg-(--bg-alt)" />
    </div>
  );
}

function AlertRow({ alert }: { alert: AlertOverviewItem }) {
  const s = typeStyle(alert.type);
  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-border bg-(--bg-alt) px-4 py-3">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full border font-mono text-[9px] font-semibold tracking-[0.06em] ${s.badge}`}
          >
            {alert.type.replace(/_/g, " ")}
          </span>
          {alert.machine_id && (
            <span className="font-mono text-[13px] font-bold text-(--text)">
              {alert.machine_id}
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] text-(--text-muted) whitespace-nowrap">
          {new Date(alert.timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p className="font-sans text-[13px] text-(--text-secondary) leading-relaxed">
        {alert.message}
      </p>
    </div>
  );
}

export default function AlertsOverviewPage() {
  const { data: groups = [], isLoading, isError } = useMillAlertsOverview();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalAlerts = groups.reduce((sum, g) => sum + g.open_alerts, 0);
  const totalPages = Math.max(1, Math.ceil(groups.length / MILLS_PER_PAGE));
  const pagedGroups = useMemo(
    () => groups.slice((page - 1) * MILLS_PER_PAGE, page * MILLS_PER_PAGE),
    [groups, page],
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  function toggleExpand(groupId: string) {
    setExpanded((cur) => (cur === groupId ? null : groupId));
  }

  const showSkeleton = !mounted || isLoading;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-[20px] font-bold text-(--text)">
          Platform Alerts
        </h2>
        <p className="font-sans text-[13px] text-(--text-secondary) mt-1">
          {showSkeleton
            ? "Loading…"
            : `${totalAlerts} open alert${totalAlerts === 1 ? "" : "s"} across ${groups.length} mill${groups.length === 1 ? "" : "s"} — click a mill to see its alerts`}
        </p>
      </div>

      {isError && (
        <div className="rounded-[10px] border p-4 font-mono text-[12px] border-(--red) text-(--red) bg-(--red-bg)">
          ⚠ Failed to load platform alerts.
        </div>
      )}

      {showSkeleton ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: MILLS_PER_PAGE }).map((_, i) => (
            <GroupSkeleton key={i} />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-border p-12 text-center">
          <p className="font-mono text-[12px] tracking-widest text-(--text-muted) mb-2">
            ALL CLEAR
          </p>
          <p className="font-sans text-[13px] text-(--text-secondary)">
            No open alerts across the platform
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            {pagedGroups.map((g, i) => {
              const globalIndex = (page - 1) * MILLS_PER_PAGE + i;
              const groupId = `${g.mill_id ?? "unknown"}-${g.owner_email}-${globalIndex}`;
              const isOpen = expanded === groupId;
              return (
                <div
                  key={groupId}
                  className="rounded-[14px] border border-border bg-(--surface) overflow-hidden shadow-(--card-shadow)"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(groupId)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-(--surface-hover)"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-(--text-muted)">
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                      <span className="font-mono text-[14px] font-bold text-(--text)">
                        {g.mill_id ?? "—"}
                      </span>
                      <span className="font-mono text-[11px] text-(--violet)">
                        {g.owner_email}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-(--red) bg-(--red-bg) px-3 py-1 font-mono text-[11px] font-semibold text-(--red) whitespace-nowrap">
                      {g.open_alerts} open
                    </span>
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-2 px-5 pb-5">
                      {g.alerts.map((a) => (
                        <AlertRow key={a.id} alert={a} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {groups.length > MILLS_PER_PAGE && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-2"
            />
          )}
        </>
      )}
    </div>
  );
}
