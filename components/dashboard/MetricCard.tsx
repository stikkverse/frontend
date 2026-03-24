"use client";

import { useState, useEffect } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  prefix?: string;
  accentColor: string;
  delay?: number;
}

export default function MetricCard({
  label,
  value,
  unit,
  prefix,
  accentColor,
  delay = 0,
}: MetricCardProps) {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const tm = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(tm);
  }, [delay]);

  return (
    <div
      className="relative overflow-hidden rounded-[14px] border border-dash-border bg-(--surface) py-8 px-6 shadow-card transition-all duration-600 lg:w-[20%] md:w-[20%] w-full"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.75"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
      <p className="font-mono text-[10px] tracking-[0.14em] text-dash-text-muted mb-2.5">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        {prefix && (
          <span className="font-mono text-base" style={{ color: accentColor }}>
            {prefix}
          </span>
        )}
        <span className="font-mono text-[36px] font-bold leading-none text-accentColor">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[13px] ml-0.5 text-dash-text-muted">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
