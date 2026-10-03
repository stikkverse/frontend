import type { MillSortKey } from "@/hooks/useSuperadmin";
import type { MillActivityItem } from "@/lib/database/type";

export const ROWS_PER_PAGE = 10;

export const SORT_OPTIONS: { value: MillSortKey; label: string }[] = [
  { value: "status", label: "Status" },
  { value: "open_alerts", label: "Open alerts" },
  { value: "avg_health_score_7d", label: "7-day health" },
  { value: "machine_count", label: "Machine count" },
  { value: "last_data_date", label: "Last data date" },
  { value: "mill_id", label: "Mill ID" },
  { value: "owner_email", label: "Owner email" },
];

export type FilterField =
  | "mill_id"
  | "owner_email"
  | "status"
  | "open_alerts"
  | "machine_count"
  | "avg_health_score_7d"
  | "last_data_date";

export type FilterInputType = "text" | "number" | "date";

export const FILTER_FIELDS: {
  value: FilterField;
  label: string;
  input: FilterInputType;
}[] = [
  { value: "mill_id", label: "Mill ID", input: "text" },
  { value: "owner_email", label: "Owner email", input: "text" },
  { value: "status", label: "Status", input: "text" },
  { value: "open_alerts", label: "Open alerts", input: "number" },
  { value: "machine_count", label: "Machine count", input: "number" },
  { value: "avg_health_score_7d", label: "7-day health", input: "number" },
  { value: "last_data_date", label: "Last data date", input: "date" },
];

export function matchesTextOrNumber(
  mill: MillActivityItem,
  field: FilterField,
  input: FilterInputType,
  value: string,
): boolean {
  const q = value.trim();
  if (!q) return true;

  if (input === "number") {
    const cell = mill[field];
    if (cell == null) return false;
    const n = Number(q);
    if (Number.isNaN(n)) return true;
    return Number(cell) === n;
  }

  const cell = String(mill[field] ?? "").toLowerCase();
  return cell.includes(q.toLowerCase());
}

export function matchesDateRange(
  mill: MillActivityItem,
  from: string,
  to: string,
): boolean {
  if (!from && !to) return true;
  const cell = mill.last_data_date;
  if (!cell) return false;
  const day = cell.slice(0, 10);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

export function healthClass(score: number): string {
  if (score >= 80) return "text-(--green)";
  if (score >= 60) return "text-(--amber)";
  return "text-(--red)";
}

export function riskClass(risk: string): string {
  const r = risk.toUpperCase();
  if (r === "HIGH") return "text-(--red) border-(--red) bg-(--red-bg)";
  if (r === "WARNING") return "text-(--amber) border-(--amber) bg-(--amber-bg)";
  return "text-(--green) border-(--green) bg-(--green-bg)";
}
