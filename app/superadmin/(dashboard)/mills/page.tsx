"use client";

import { useState, useMemo, useEffect } from "react";
import { useMillsActivity } from "@/hooks/useSuperadmin";
import { getHealthColor } from "@/lib/helper";
import StatusBadge from "@/components/superadmin/StatusBadge";
import Pagination from "@/components/ui/pagination";

const ROWS_PER_PAGE = 10;

function TableSkeleton() {
  return (
    <tr className="border-t border-border">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-20 rounded bg-(--bg-alt) animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function MillsActivityPage() {
  const { data: mills = [], isLoading, isError } = useMillsActivity();
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPages = Math.max(1, Math.ceil(mills.length / ROWS_PER_PAGE));
  const paginatedMills = useMemo(
    () => mills.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [mills, page],
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-[20px] font-bold text-(--text)">
          Mills Activity
        </h2>
        <p className="font-sans text-[13px] text-(--text-secondary) mt-1">
          {!mounted || isLoading
            ? "Loading…"
            : `${mills.length} registered mills — sorted most-concerning first`}
        </p>
      </div>

      {isError && (
        <div className="rounded-[10px] border p-4 font-mono text-[12px] border-(--red) text-(--red) bg-(--red-bg)">
          ⚠ Failed to load mill activity data.
        </div>
      )}

      <div className="overflow-x-auto rounded-[12px] border border-border bg-[#060a13]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-(--bg-alt)">
              {[
                "MILL ID",
                "OWNER",
                "BASELINE",
                "MACHINES",
                "LAST DATA",
                "7D HEALTH",
                "OPEN ALERTS",
                "STATUS",
              ].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-[0.12em] text-(--text-muted) px-4 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!mounted || isLoading ? (
              Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
                <TableSkeleton key={i} />
              ))
            ) : mills.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center font-mono text-[12px] text-(--text-muted)"
                >
                  No mills registered
                </td>
              </tr>
            ) : (
              paginatedMills.map((m) => (
                <tr
                  key={m.mill_id}
                  className="border-t border-border transition-colors duration-150 hover:bg-(--surface-hover)"
                >
                  <td className="font-mono text-[13px] font-semibold px-4 py-3 text-(--text) whitespace-nowrap">
                    {m.mill_id}
                  </td>
                  <td className="font-mono text-[11px] px-4 py-3 text-(--text-secondary)">
                    {m.owner_email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-[10px] font-semibold ${m.has_baseline ? "text-(--green)" : "text-(--text-muted)"}`}
                    >
                      {m.has_baseline ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="font-mono text-[13px] px-4 py-3 text-(--cyan)">
                    {m.machine_count}
                  </td>
                  <td className="font-mono text-[11px] px-4 py-3 text-(--text-muted) whitespace-nowrap">
                    {m.last_data_date ?? "—"}
                    {m.days_since_last_data != null && (
                      <span className="ml-1.5 text-(--text-muted)">
                        ({m.days_since_last_data}d)
                      </span>
                    )}
                  </td>
                  <td
                    className="font-mono text-[16px] font-bold px-4 py-3"
                    style={{
                      color:
                        m.avg_health_score_7d != null
                          ? getHealthColor(m.avg_health_score_7d)
                          : "var(--text-muted)",
                    }}
                  >
                    {m.avg_health_score_7d != null
                      ? m.avg_health_score_7d.toFixed(0)
                      : "—"}
                  </td>
                  <td
                    className={`font-mono text-[13px] font-semibold px-4 py-3 ${m.open_alerts > 0 ? "text-(--red)" : "text-(--text-muted)"}`}
                  >
                    {m.open_alerts}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && mills.length > ROWS_PER_PAGE && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-2"
        />
      )}
    </div>
  );
}
