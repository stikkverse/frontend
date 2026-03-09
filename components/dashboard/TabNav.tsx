"use client";

import type { TabItem } from "@/lib/type";

interface TabNavProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}

export default function TabNav({ tabs, active, onChange }: TabNavProps) {
  return (
    <div className="inline-flex gap-0.5 p-1 rounded-[10px] border border-dash-border bg-dash-bg-alt">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex items-center px-4.5 py-2 rounded-lg border-none cursor-pointer font-mono text-[11px] tracking-[0.06em] transition-all duration-300"
            style={{
              fontWeight: isActive ? 600 : 400,
              background: isActive ? "var(--tab-active-bg)" : "transparent",
              color: isActive ? "var(--tab-active)" : "var(--text-muted)",
            }}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span
                className="ml-2 px-1.75 py-1 rounded-[10px] font-mono text-[9px] font-bold border border-dash-red text-dash-red bg-dash-red-bg"
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}