"use client";

import { useState, useEffect } from "react";
import { getHealthColor } from "@/lib/database/helper";

interface HealthRingProps {
  score: number;
  size?: number;
}

export default function HealthRing({ score, size = 100 }: HealthRingProps) {
  const [val, setVal] = useState<number>(0);
  const color = getHealthColor(score);
  const r     = (size - 12) / 2;
  const circ  = 2 * Math.PI * r;

  useEffect(() => {
    const start = Date.now();
    const run = (): void => {
      const p = Math.min((Date.now() - start) / 1200, 1);
      setVal((1 - Math.pow(1 - p, 3)) * score);
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [score]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--border)" strokeWidth="4.5"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (val / 100) * circ}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold leading-none"
          style={{ fontSize: size * 0.26, color }}
        >
          {val.toFixed(1)}
        </span>
        <span
          className="font-mono tracking-[0.12em] mt-0.5"
          style={{ fontSize: size * 0.09, color: "var(--text-muted)" }}
        >
          HEALTH
        </span>
      </div>
    </div>
  );
}