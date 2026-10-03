"use client";

import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { MillActivityItem } from "@/lib/database/type";
import StatusBadge from "@/components/superadmin/StatusBadge";
import MachineSubRow from "./MachineSubRow";
import { ROWS_PER_PAGE, healthClass } from "@/lib/superadmin/millsfilter";

const TABLE_COLUMNS = [
  "MILL ID",
  "OWNER",
  "BASELINE",
  "MACHINES",
  "LAST DATA",
  "7D HEALTH",
  "OPEN ALERTS",
  "STATUS",
];

function TableSkeleton() {
  return (
    <tr className="border-t border-border">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-20 rounded bg-(--bg-alt) animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

interface MillsTableProps {
  rows: MillActivityItem[];
  showSkeleton: boolean;
  hasActiveFilter: boolean;
  page: number;
  expanded: string | null;
  onToggleExpand: (rowId: string) => void;
}

export default function MillsTable({
  rows,
  showSkeleton,
  hasActiveFilter,
  page,
  expanded,
  onToggleExpand,
}: MillsTableProps) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-border bg-(--surface)">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-(--bg-alt)">
            <th className="w-10 px-3 py-3" />
            {TABLE_COLUMNS.map((h) => (
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
          {showSkeleton ? (
            Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
              <TableSkeleton key={i} />
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="px-4 py-8 text-center font-mono text-[12px] text-(--text-muted)"
              >
                {hasActiveFilter
                  ? "No mills match the current filter"
                  : "No mills registered"}
              </td>
            </tr>
          ) : (
            rows.map((m, i) => {
              const rowId = `${m.mill_id}-${(page - 1) * ROWS_PER_PAGE + i}`;
              const isOpen = expanded === rowId;
              return (
                <Fragment key={rowId}>
                  <tr
                    onClick={() => onToggleExpand(rowId)}
                    className="border-t border-border cursor-pointer transition-colors duration-150 hover:bg-(--surface-hover)"
                  >
                    <td className="px-3 py-3 text-(--text-muted)">
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </td>
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
                      className={`font-mono text-[16px] font-bold px-4 py-3 ${
                        m.avg_health_score_7d != null
                          ? healthClass(m.avg_health_score_7d)
                          : "text-(--text-muted)"
                      }`}
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
                  {isOpen && <MachineSubRow mill={m} />}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
