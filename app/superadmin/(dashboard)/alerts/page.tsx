"use client";

import { useState, useMemo, useEffect } from "react";
import { useAlertsOverview } from "@/hooks/useSuperadmin";
import Pagination from "@/components/ui/pagination";

const ALERTS_PER_PAGE = 12;

function AlertSkeleton() {
  return (
    <div className="rounded-[14px] border border-border bg-(--surface) overflow-hidden animate-pulse">
      <div className="h-0.75 bg-(--bg-alt)" />
      <div className="p-5">
        <div className="h-4 w-48 rounded bg-(--bg-alt) mb-3" />
        <div className="h-3 w-full rounded bg-(--bg-alt)" />
      </div>
    </div>
  );
}

function typeStyle(type: string): { accent: string; badge: string } {
  const t = type.toLowerCase();
  if (t.includes("bearing") || t.includes("critical")) {
    return {
      accent: "bg-[linear-gradient(90deg,transparent,var(--red),transparent)]",
      badge: "text-(--red) bg-(--red-bg) border-(--red)",
    };
  }
  if (t.includes("health") || t.includes("co2") || t.includes("excess")) {
    return {
      accent:
        "bg-[linear-gradient(90deg,transparent,var(--amber),transparent)]",
      badge: "text-(--amber) bg-(--amber-bg) border-(--amber)",
    };
  }
  return {
    accent: "bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]",
    badge: "text-(--cyan) bg-(--cyan-bg) border-(--cyan)",
  };
}

export default function AlertsOverviewPage() {
  const { data: alerts = [], isLoading, isError } = useAlertsOverview();
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPages = Math.max(1, Math.ceil(alerts.length / ALERTS_PER_PAGE));
  const paginatedAlerts = useMemo(
    () => alerts.slice((page - 1) * ALERTS_PER_PAGE, page * ALERTS_PER_PAGE),
    [alerts, page],
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-[20px] font-bold text-(--text)">
          Platform Alerts
        </h2>
        <p className="font-sans text-[13px] text-(--text-secondary) mt-1">
          {!mounted || isLoading
            ? "Loading…"
            : `${alerts.length} unacknowledged alert${alerts.length === 1 ? "" : "s"} across all mills`}
        </p>
      </div>

      {isError && (
        <div className="rounded-[10px] border p-4 font-mono text-[12px] border-(--red) text-(--red) bg-(--red-bg)">
          ⚠ Failed to load platform alerts.
        </div>
      )}

      {!mounted || isLoading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: ALERTS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="flex-1 basis-full md:basis-[calc(50%-0.375rem)] xl:basis-[calc(33.333%-0.5rem)] min-w-0"
            >
              <AlertSkeleton />
            </div>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-border p-12 text-center">
          <p className="font-mono text-[12px] tracking-widest text-(--text-muted) mb-2">
            ALL CLEAR
          </p>
          <p className="font-sans text-[13px] text-(--text-secondary)">
            No unacknowledged alerts across the platform
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-5">
            {paginatedAlerts.map((a) => {
              const s = typeStyle(a.type);
              return (
                <div
                  key={a.id}
                  className="lg:w-[32%] md:w-[32%] w-full rounded-[14px] border border-border bg-(--surface) overflow-hidden shadow-(--card-shadow)"
                >
                  <div className={`h-0.75 ${s.accent}`} />
                  <div className="px-5 py-8">
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full border font-mono text-[9px] font-semibold tracking-[0.06em] ${s.badge}`}
                        >
                          {a.type.replace(/_/g, " ")}
                        </span>
                        <span className="font-mono text-[14px] font-bold text-(--text)">
                          {a.machine_id}
                        </span>
                        {a.mill_id && (
                          <span className="font-mono text-[10px] text-(--text-muted)">
                            @ {a.mill_id}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-(--text-muted) whitespace-nowrap">
                        {new Date(a.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="font-sans text-[13px] text-(--text-secondary) leading-relaxed">
                      {a.message}
                    </p>

                    <p className="font-mono text-[9px] text-(--violet) mt-3">
                      {a.owner_email}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-2"
          />
        </>
      )}
    </div>
  );
}
