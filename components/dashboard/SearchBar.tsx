"use client";

import type { ChangeEvent, FocusEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-[320px] w-full">
      <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ stroke: "var(--text-muted)" }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder="Search machines by ID..."
        className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border border-dash-border bg-dash-search-bg text-dash-text font-mono text-[12px] outline-none transition-[border-color] duration-200"
        onFocus={(e: FocusEvent<HTMLInputElement>) =>
          (e.target.style.borderColor = "var(--cyan)")
        }
        onBlur={(e: FocusEvent<HTMLInputElement>) =>
          (e.target.style.borderColor = "var(--border)")
        }
      />
    </div>
  );
}