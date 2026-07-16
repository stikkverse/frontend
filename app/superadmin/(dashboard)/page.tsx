"use client";

import { useState, useEffect } from "react";
import { usePlatformHealth } from "@/hooks/useSuperadmin";
import PlatformHealthRing from "@/components/superadmin/PlatformHealthRing";
import StatusBadge from "@/components/superadmin/StatusBadge";

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function MetricTile({
  label,
  value,
  colorClass = "text-(--text)",
  sub,
}: {
  label: string;
  value: string | number;
  colorClass?: string;
  sub?: string;
}) {
  return (
    <div className="flex-1 min-w-35 rounded-[12px] border border-border bg-(--surface) p-4 shadow-(--card-shadow)">
      <p className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted) mb-1.5">
        {label}
      </p>
      <p
        className={`font-mono text-[28px] font-bold leading-none ${colorClass}`}
      >
        {value}
      </p>
      {sub && (
        <p className="font-mono text-[10px] text-(--text-muted) mt-1">{sub}</p>
      )}
    </div>
  );
}

function PipelineCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className="flex-1 min-w-20 text-center py-3 rounded-[10px] bg-(--bg-alt)">
      <p className={`font-mono text-[24px] font-bold ${colorClass}`}>{value}</p>
      <p className="font-mono text-[8px] tracking-widest text-(--text-muted) mt-1">
        {label}
      </p>
    </div>
  );
}

function ServiceRow({
  name,
  status,
  detail,
}: {
  name: string;
  status: string;
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <span className="font-mono text-[11px] tracking-[0.08em] text-(--text-secondary)">
        {name}
      </span>
      <div className="flex items-center gap-3">
        {detail && (
          <span className="font-mono text-[10px] text-(--text-muted)">
            {detail}
          </span>
        )}
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

function HealthSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-6 w-48 rounded bg-(--bg-alt)" />
      <div className="rounded-[14px] border border-border bg-(--surface) p-6 h-48" />
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 min-w-35 rounded-[12px] border border-borderbg-(--surface) p-4 h-20"
          />
        ))}
      </div>
    </div>
  );
}

export default function PlatformHealthPage() {
  const { data: health, isLoading, isError } = usePlatformHealth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) return <HealthSkeleton />;

  if (isError || !health) {
    return (
      <div className="rounded-[10px] border p-4 font-mono text-[12px] border-(--red) text-(--red) bg-(--red-bg)">
        ⚠ Failed to load platform health data.
      </div>
    );
  }

  const {
    system,
    platform,
    machine_health_distribution: dist,
    alerts,
    processing_tasks: tasks,
    services,
  } = health;
  const distTotal = dist.healthy + dist.warning + dist.critical;
  const alertTypes = Object.entries(alerts.by_type);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-sans text-[20px] font-bold text-(--text)">
          Platform Health
        </h2>
        <p className="font-sans text-[13px] text-(--text-secondary) mt-1">
          Computed{" "}
          {new Date(health.computed_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="flex gap-6 flex-wrap items-center rounded-[14px] border border-border bg-(--surface) p-6 shadow-(--card-shadow)">
        <PlatformHealthRing
          score={health.health_score}
          label={health.health_level}
        />
        <div className="flex-1 min-w-60">
          <div className="flex gap-8 flex-wrap mb-5">
            <div>
              <p className="font-mono text-[9px] tracking-widest text-(--text-muted)">
                UPTIME
              </p>
              <p className="font-mono text-[20px] font-bold text-(--green)">
                {formatUptime(system.uptime_seconds)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-widest text-(--text-muted)">
                AVG LATENCY
              </p>
              <p
                className={`font-mono text-[20px] font-bold ${system.api_avg_latency_ms < 100 ? "text-(--green)" : "text-(--amber)"}`}
              >
                {system.api_avg_latency_ms.toFixed(0)}ms
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-widest text-(--text-muted)">
                P95 LATENCY
              </p>
              <p
                className={`font-mono text-[20px] font-bold ${system.api_p95_latency_ms < 300 ? "text-(--green)" : "text-(--amber)"}`}
              >
                {system.api_p95_latency_ms.toFixed(0)}ms
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-widest text-(--text-muted)">
                ERROR RATE
              </p>
              <p
                className={`font-mono text-[20px] font-bold ${system.api_error_rate_pct < 1 ? "text-(--green)" : "text-(--red)"}`}
              >
                {system.api_error_rate_pct.toFixed(2)}%
              </p>
            </div>
          </div>

          <p className="font-mono text-[9px] tracking-widest text-(--text-muted) mb-2">
            MACHINE HEALTH DISTRIBUTION
          </p>
          {distTotal > 0 ? (
            <>
              <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                {dist.healthy > 0 && (
                  <div
                    className="rounded-full bg-(--green)"
                    style={{ flex: dist.healthy }}
                  />
                )}
                {dist.warning > 0 && (
                  <div
                    className="rounded-full bg-(--amber)"
                    style={{ flex: dist.warning }}
                  />
                )}
                {dist.critical > 0 && (
                  <div
                    className="rounded-full bg-(--red)"
                    style={{ flex: dist.critical }}
                  />
                )}
              </div>
              <div className="flex gap-4 mt-2 flex-wrap">
                <span className="font-mono text-[10px] text-(--green)">
                  ● {dist.healthy} Healthy
                </span>
                <span className="font-mono text-[10px] text-(--amber)">
                  ● {dist.warning} Warning
                </span>
                <span className="font-mono text-[10px] text-(--red)">
                  ● {dist.critical} Critical
                </span>
              </div>
            </>
          ) : (
            <p className="font-mono text-[10px] text-(--text-muted)">
              No machine data yet
            </p>
          )}
        </div>
      </div>

      {/* Platform metrics */}
      <div className="flex gap-3 flex-wrap">
        <MetricTile
          label="TOTAL MILLS"
          value={platform.total_mills}
          colorClass="text-(--cyan)"
          sub={`${platform.mills_with_baseline} with baseline`}
        />
        <MetricTile
          label="TOTAL MACHINES"
          value={platform.total_machines}
          colorClass="text-(--violet)"
        />
        <MetricTile
          label="TOTAL USERS"
          value={platform.total_users}
          colorClass="text-(--text)"
        />
        <MetricTile
          label="OPEN ALERTS"
          value={alerts.total_open}
          colorClass={alerts.total_open > 0 ? "text-(--red)" : "text-(--green)"}
        />
      </div>

      {/* Mill activity */}
      <div className="flex gap-3 flex-wrap">
        <MetricTile
          label="ACTIVE MILLS (48H)"
          value={platform.active_mills_48h}
          colorClass="text-(--green)"
        />
        <MetricTile
          label="INACTIVE MILLS (48H)"
          value={platform.inactive_mills_48h}
          colorClass={
            platform.inactive_mills_48h > 0
              ? "text-(--amber)"
              : "text-(--text-muted)"
          }
        />
        <MetricTile
          label="TOTAL REQUESTS"
          value={system.api_total_requests.toLocaleString()}
          colorClass="text-(--text-secondary)"
        />
      </div>

      {/* Alerts by type */}
      {alertTypes.length > 0 && (
        <div className="rounded-[14px] border border-border bg-(--surface) p-5 shadow-(--card-shadow)">
          <p className="font-mono text-[10px] tracking-widest text-(--text-muted) mb-4">
            OPEN ALERTS BY TYPE
          </p>
          <div className="flex gap-3 flex-wrap">
            {alertTypes.map(([type, count]) => (
              <div
                key={type}
                className="flex-1 min-w-30 text-center py-3 rounded-[10px] bg-(--bg-alt)"
              >
                <p className="font-mono text-[22px] font-bold text-(--amber)">
                  {count}
                </p>
                <p className="font-mono text-[8px] tracking-widest text-(--text-muted) mt-1">
                  {type.replace(/_/g, " ").toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task pipeline */}
      <div className="rounded-[14px] border border-border bg-(--surface) p-5 shadow-(--card-shadow)">
        <p className="font-mono text-[10px] tracking-widest text-(--text-muted) mb-4">
          PROCESSING TASKS
        </p>
        <div className="flex gap-3 flex-wrap">
          <PipelineCard
            label="PENDING"
            value={tasks.pending}
            colorClass="text-(--amber)"
          />
          <PipelineCard
            label="STUCK"
            value={tasks.stuck}
            colorClass={
              tasks.stuck > 0 ? "text-(--red)" : "text-(--text-muted)"
            }
          />
          <PipelineCard
            label="COMPLETED 24H"
            value={tasks.completed_24h}
            colorClass="text-(--green)"
          />
          <PipelineCard
            label="FAILED 24H"
            value={tasks.failed_24h}
            colorClass={
              tasks.failed_24h > 0 ? "text-(--red)" : "text-(--text-muted)"
            }
          />
        </div>
      </div>

      {/* Service statuses */}
      <div className="rounded-[14px] border border-borderbg-(--surface) p-5 shadow-(--card-shadow)">
        <p className="font-mono text-[10px] tracking-widest text-(--text-muted) mb-2">
          SERVICES
        </p>
        <ServiceRow
          name="DATABASE"
          status={services.database.status}
          detail={`${services.database.latency_ms.toFixed(1)}ms`}
        />
        <ServiceRow name="SENTRY" status={services.sentry.status} />
        <ServiceRow
          name="IOT GATEWAY"
          status={services.iot_gateway.status}
          detail={`${services.iot_gateway.data_points_last_hour.toLocaleString()} pts/hr`}
        />
      </div>
    </div>
  );
}
