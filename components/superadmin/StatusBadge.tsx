"use client";

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<
  string,
  {
    label: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  active: {
    label: "ACTIVE",
    colorClass: "text-(--green)",
    bgClass: "bg-(--green-bg)",
    borderClass: "border-(--green)",
    dotClass: "bg-(--green)",
  },
  stale: {
    label: "STALE",
    colorClass: "text-(--amber)",
    bgClass: "bg-(--amber-bg)",
    borderClass: "border-(--amber)",
    dotClass: "bg-(--amber)",
  },
  inactive: {
    label: "INACTIVE",
    colorClass: "text-(--red)",
    bgClass: "bg-(--red-bg)",
    borderClass: "border-(--red)",
    dotClass: "bg-(--red)",
  },
  no_data: {
    label: "NO DATA",
    colorClass: "text-(--text-muted)",
    bgClass: "bg-(--bg-alt)",
    borderClass: "border-(--border)",
    dotClass: "bg-(--text-muted)",
  },
  healthy: {
    label: "HEALTHY",
    colorClass: "text-(--green)",
    bgClass: "bg-(--green-bg)",
    borderClass: "border-(--green)",
    dotClass: "bg-(--green)",
  },
  connected: {
    label: "CONNECTED",
    colorClass: "text-(--green)",
    bgClass: "bg-(--green-bg)",
    borderClass: "border-(--green)",
    dotClass: "bg-(--green)",
  },
  ok: {
    label: "OK",
    colorClass: "text-(--green)",
    bgClass: "bg-(--green-bg)",
    borderClass: "border-(--green)",
    dotClass: "bg-(--green)",
  },
  degraded: {
    label: "DEGRADED",
    colorClass: "text-(--amber)",
    bgClass: "bg-(--amber-bg)",
    borderClass: "border-(--amber)",
    dotClass: "bg-(--amber)",
  },
  down: {
    label: "DOWN",
    colorClass: "text-(--red)",
    bgClass: "bg-(--red-bg)",
    borderClass: "border-(--red)",
    dotClass: "bg-(--red)",
  },
  disabled: {
    label: "DISABLED",
    colorClass: "text-(--text-muted)",
    bgClass: "bg-(--bg-alt)",
    borderClass: "border-(--border)",
    dotClass: "bg-(--text-muted)",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = (status ?? "").toLowerCase();
  const s = STATUS_MAP[key] ?? {
    label: (status ?? "UNKNOWN").toUpperCase(),
    colorClass: "text-(--text-muted)",
    bgClass: "bg-(--bg-alt)",
    borderClass: "border-(--border)",
    dotClass: "bg-(--text-muted)",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono text-[9px] font-semibold tracking-[0.08em] ${s.colorClass} ${s.bgClass} ${s.borderClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dotClass}`} />
      {s.label}
    </span>
  );
}
