"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import type { MillSortKey, SortOrder } from "@/hooks/useSuperadmin";
import {
  SORT_OPTIONS,
  FILTER_FIELDS,
  type FilterField,
  type FilterInputType,
} from "@/lib/superadmin/millsfilter";

interface MillsFilterBarProps {
  sortBy: MillSortKey;
  order: SortOrder;
  filterField: FilterField;
  filterValue: string;
  dateFrom: string;
  dateTo: string;
  activeFilterInput: FilterInputType;
  isDateFilter: boolean;
  isFetching: boolean;
  isLoading: boolean;
  onSortClick: (key: MillSortKey) => void;
  onToggleOrder: () => void;
  onFilterFieldChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFilterValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MillsFilterBar({
  sortBy,
  order,
  filterField,
  filterValue,
  dateFrom,
  dateTo,
  activeFilterInput,
  isDateFilter,
  isFetching,
  isLoading,
  onSortClick,
  onToggleOrder,
  onFilterFieldChange,
  onFilterValueChange,
  onDateFromChange,
  onDateToChange,
}: MillsFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-border bg-(--surface) p-4">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted)">
          SORT BY
        </span>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((o) => {
            const active = sortBy === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onSortClick(o.value)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.04em] transition-colors duration-150 ${
                  active
                    ? "border-(--violet) bg-(--violet-bg) text-(--violet)"
                    : "border-border bg-(--bg-alt) text-(--text-secondary) hover:border-(--violet) hover:text-(--text)"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted)">
            ORDER
          </span>
          <button
            type="button"
            onClick={onToggleOrder}
            className="inline-flex items-center gap-2 rounded-[8px] border border-border bg-(--bg-alt) px-3 py-2 font-mono text-[12px] text-(--text) transition-colors duration-150 hover:border-(--violet) hover:text-(--violet)"
          >
            {order === "asc" ? (
              <>
                <ArrowUp className="w-3.5 h-3.5" />
                Ascending
              </>
            ) : (
              <>
                <ArrowDown className="w-3.5 h-3.5" />
                Descending
              </>
            )}
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-field"
            className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted)"
          >
            FILTER FIELD
          </label>
          <select
            id="filter-field"
            value={filterField}
            onChange={onFilterFieldChange}
            className="rounded-[8px] border border-border bg-(--bg-alt) px-3 py-2 font-mono text-[12px] text-(--text) outline-none transition-colors duration-150 focus:border-(--violet)"
          >
            {FILTER_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        {isDateFilter ? (
          <>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="date-from"
                className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted)"
              >
                FROM
              </label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={onDateFromChange}
                className="rounded-[8px] border border-border bg-(--bg-alt) px-3 py-2 font-mono text-[12px] text-(--text) outline-none transition-colors duration-150 focus:border-(--violet)"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="date-to"
                className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted)"
              >
                TO
              </label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={onDateToChange}
                className="rounded-[8px] border border-border bg-(--bg-alt) px-3 py-2 font-mono text-[12px] text-(--text) outline-none transition-colors duration-150 focus:border-(--violet)"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-1.5 flex-1 min-w-55">
            <label
              htmlFor="filter-value"
              className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted)"
            >
              {activeFilterInput === "number" ? "EQUALS" : "CONTAINS"}
            </label>
            <input
              id="filter-value"
              type={activeFilterInput}
              value={filterValue}
              onChange={onFilterValueChange}
              placeholder={
                activeFilterInput === "text"
                  ? "Type a value to match"
                  : undefined
              }
              className="w-full rounded-[8px] border border-border bg-(--bg-alt) px-3 py-2 font-mono text-[12px] text-(--text) placeholder:text-(--text-muted) outline-none transition-colors duration-150 focus:border-(--violet)"
            />
          </div>
        )}

        {isFetching && !isLoading && (
          <span className="font-mono text-[10px] text-(--text-muted) pb-2.5">
            Updating…
          </span>
        )}
      </div>
    </div>
  );
}
