"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useMillsActivity,
  type MillSortKey,
  type SortOrder,
} from "@/hooks/useSuperadmin";
import Pagination from "@/components/ui/pagination";
import MillsFilterBar from "@/components/superadmin/mill/MillsFilterBar";
import MillsTable from "@/components/superadmin/mill/MillsTable";
import {
  ROWS_PER_PAGE,
  FILTER_FIELDS,
  type FilterField,
  matchesTextOrNumber,
  matchesDateRange,
} from "@/lib/superadmin/millsfilter";

export default function MillsActivityPage() {
  const [sortBy, setSortBy] = useState<MillSortKey>("status");
  const [order, setOrder] = useState<SortOrder>("desc");
  const {
    data: mills = [],
    isLoading,
    isError,
    isFetching,
  } = useMillsActivity(sortBy, order);
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterField, setFilterField] = useState<FilterField>("mill_id");
  const [filterValue, setFilterValue] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeFilterInput =
    FILTER_FIELDS.find((f) => f.value === filterField)?.input ?? "text";
  const isDateFilter = activeFilterInput === "date";
  const hasActiveFilter = isDateFilter
    ? Boolean(dateFrom || dateTo)
    : Boolean(filterValue.trim());

  const filteredMills = useMemo(() => {
    if (isDateFilter) {
      if (!dateFrom && !dateTo) return mills;
      return mills.filter((m) => matchesDateRange(m, dateFrom, dateTo));
    }
    if (!filterValue.trim()) return mills;
    return mills.filter((m) =>
      matchesTextOrNumber(m, filterField, activeFilterInput, filterValue),
    );
  }, [
    mills,
    isDateFilter,
    dateFrom,
    dateTo,
    filterField,
    activeFilterInput,
    filterValue,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMills.length / ROWS_PER_PAGE),
  );
  const paginatedMills = useMemo(
    () => filteredMills.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [filteredMills, page],
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  function handleSortClick(key: MillSortKey) {
    setSortBy(key);
    setPage(1);
    setExpanded(null);
  }

  function toggleOrder() {
    setOrder((o) => (o === "asc" ? "desc" : "asc"));
    setPage(1);
    setExpanded(null);
  }

  function handleFilterFieldChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilterField(e.target.value as FilterField);
    setFilterValue("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setExpanded(null);
  }

  function handleFilterValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterValue(e.target.value);
    setPage(1);
    setExpanded(null);
  }

  function handleDateFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDateFrom(e.target.value);
    setPage(1);
    setExpanded(null);
  }

  function handleDateToChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDateTo(e.target.value);
    setPage(1);
    setExpanded(null);
  }

  function toggleExpand(rowId: string) {
    setExpanded((cur) => (cur === rowId ? null : rowId));
  }

  const showSkeleton = !mounted || isLoading;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-[20px] font-bold text-(--text)">
          Mills Activity
        </h2>
        <p className="font-sans text-[13px] text-(--text-secondary) mt-1">
          {showSkeleton
            ? "Loading…"
            : hasActiveFilter
              ? `${filteredMills.length} of ${mills.length} mills match — click a row to inspect its machines`
              : `${mills.length} registered mills — click a row to inspect its machines`}
        </p>
      </div>

      <MillsFilterBar
        sortBy={sortBy}
        order={order}
        filterField={filterField}
        filterValue={filterValue}
        dateFrom={dateFrom}
        dateTo={dateTo}
        activeFilterInput={activeFilterInput}
        isDateFilter={isDateFilter}
        isFetching={isFetching}
        isLoading={isLoading}
        onSortClick={handleSortClick}
        onToggleOrder={toggleOrder}
        onFilterFieldChange={handleFilterFieldChange}
        onFilterValueChange={handleFilterValueChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
      />

      <p className="font-mono text-[10px] text-(--text-muted) -mt-3">
        Sort buttons order every mill on the server. The filter narrows the
        loaded rows by the chosen field: text matches on contains, numbers on
        exact value, and the date range keeps mills whose last data falls
        between the chosen days.
      </p>

      {isError && (
        <div className="rounded-[10px] border p-4 font-mono text-[12px] border-(--red) text-(--red) bg-(--red-bg)">
          ⚠ Failed to load mill activity data.
        </div>
      )}

      <MillsTable
        rows={paginatedMills}
        showSkeleton={showSkeleton}
        hasActiveFilter={hasActiveFilter}
        page={page}
        expanded={expanded}
        onToggleExpand={toggleExpand}
      />

      {!isLoading && filteredMills.length > ROWS_PER_PAGE && (
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
