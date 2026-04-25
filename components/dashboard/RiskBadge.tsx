"use client";

interface RiskBadgeProps {
  category: string;
}

const CATEGORY_STYLES: Record<string, { color: string; bg: string; pulse: boolean }> = {
  risk:     { color: "var(--red)",        bg: "var(--red-bg)",    pulse: true },
  warning:  { color: "var(--amber)",      bg: "var(--amber-bg)",  pulse: false },
  good:     { color: "var(--green)",      bg: "var(--green-bg)",  pulse: false },
  idle:     { color: "var(--text-muted)", bg: "var(--bg-alt)",    pulse: false },
};

const DEFAULT_STYLE = { color: "var(--text-muted)", bg: "var(--bg-alt)", pulse: false };

export default function RiskBadge({ category }: RiskBadgeProps) {
  const key = category.toLowerCase();
  const { color, bg, pulse } = CATEGORY_STYLES[key] ?? DEFAULT_STYLE;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        border: `1px solid ${color}`,
        background: bg,
        animation: pulse ? "riskPulse 1.5s ease-in-out infinite" : "none",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span
        className="font-mono text-[10px] font-semibold tracking-[0.08em] uppercase"
        style={{ color }}
      >
        {category}
      </span>
    </div>
  );
}