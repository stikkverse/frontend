"use client";

import { useState, useEffect } from "react";

interface PlatformHealthRingProps {
  score: number;
  label?: string;
  size?: number;
}

function getColor(score: number) {
  if (score >= 80) return "var(--green)";
  if (score >= 60) return "var(--amber)";
  return "var(--red)";
}

export default function PlatformHealthRing({ score, label, size = 160 }: PlatformHealthRingProps) {
  const [val, setVal] = useState(0);
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const color = getColor(score);

  useEffect(() => {
    const start = Date.now();
    const run = () => {
      const p = Math.min((Date.now() - start) / 1500, 1);
      setVal((1 - Math.pow(1 - p, 3)) * score);
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [score]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (val / 100) * circ}
          className="drop-shadow-[0_0_8px_currentColor]"
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold leading-none" style={{ fontSize: size * 0.25, color }}>
          {Math.round(val)}
        </span>
        {label && (
          <span className="font-mono text-[9px] tracking-[0.12em] text-(--text-muted) mt-1 uppercase">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}