"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-(--border) bg-(--surface) text-(--text-muted) hover:text-(--cyan) hover:border-(--cyan) disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-(--text-muted) disabled:hover:border-(--border) transition-colors duration-200 cursor-pointer"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-8 h-8 flex items-center justify-center font-mono text-[11px] text-(--text-muted)"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={[
              "w-8 h-8 rounded-lg font-mono text-[11px] font-semibold border transition-colors duration-200 cursor-pointer",
              page === currentPage
                ? "bg-(--tab-active-bg) border-(--cyan) text-(--cyan)"
                : "bg-(--surface) border-(--border) text-(--text-muted) hover:text-(--cyan) hover:border-(--cyan)",
            ].join(" ")}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-(--border) bg-(--surface) text-(--text-muted) hover:text-(--cyan) hover:border-(--cyan) disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-(--text-muted) disabled:hover:border-(--border) transition-colors duration-200 cursor-pointer"
      >
        <ChevronRight size={14} />
      </button>

      {/* Page info */}
      <span className="ml-3 font-mono text-[10px] tracking-[0.06em] text-(--text-muted)">
        {currentPage} of {totalPages}
      </span>
    </div>
  );
}