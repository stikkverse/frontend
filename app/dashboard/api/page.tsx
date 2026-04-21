"use client";

import { useEffect, useRef } from "react";
import { useUploadHistory, useBaselines, useTaskStatus } from "@/hooks/useUploads";
import { useCurrentUser } from "@/hooks/useTeam";
import ApiKeyPanel from "@/components/dashboard/ApiKeyPanel";
import UploadZone from "@/components/dashboard/UploadZone";
import type { ProcessingStatus, UploadHistoryItem } from "@/lib/type";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusStyle(status: ProcessingStatus) {
  switch (status) {
    case "COMPLETED": return { color: "var(--green)", bg: "var(--green-bg)" };
    case "PROCESSING": return { color: "var(--cyan)", bg: "var(--cyan-bg)" };
    case "PENDING": return { color: "var(--amber)", bg: "var(--amber-bg)" };
    case "FAILED": return { color: "var(--red)", bg: "var(--red-bg)" };
  }
}

function TableRowSkeleton({ cols }: { cols: number }) {
  return (
    <tr style={{ borderTop: "1px solid var(--border)" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-20 rounded bg-(--bg-alt) animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function LiveStatusCell({
  taskId,
  storedStatus,
}: {
  taskId: string | null;
  storedStatus: ProcessingStatus;
}) {
  const queryClient = useQueryClient();
  const shouldPoll =
    taskId !== null &&
    (storedStatus === "PENDING" || storedStatus === "PROCESSING");

  const { data: taskData } = useTaskStatus(shouldPoll ? taskId : null);
  const liveStatus = taskData?.status ?? storedStatus;

  useEffect(() => {
    if (taskData?.status === "COMPLETED") {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.machines() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.history() });
    }
  }, [taskData?.status, queryClient]);

  const s = statusStyle(liveStatus);
  return (
    <span
      className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}` }}
    >
      {liveStatus}
      {(liveStatus === "PROCESSING" || liveStatus === "PENDING") && taskData?.progress
        ? ` ${Math.round(taskData.progress)}%`
        : ""}
    </span>
  );
}

function useTaskIdMap() {
  const ref = useRef<Record<string, string>>({});

  const setTaskId = (filename: string, taskId: string) => {
    ref.current[filename] = taskId;
    sessionStorage.setItem("task_id_map", JSON.stringify(ref.current));
  };

  const getTaskId = (filename: string): string | null => {
    if (Object.keys(ref.current).length === 0) {
      try {
        const stored = sessionStorage.getItem("task_id_map");
        if (stored) ref.current = JSON.parse(stored);
      } catch { /* ignore */ }
    }
    return ref.current[filename] ?? null;
  };

  return { setTaskId, getTaskId };
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function ApiPage() {
  const { data: uploads = [], isLoading: uploadsLoading } = useUploadHistory();
  const { data: baselines = [], isLoading: baselinesLoading } = useBaselines();
  const { data: currentUser } = useCurrentUser();
  const { getTaskId, setTaskId } = useTaskIdMap();

  const apiKey =
    typeof window !== "undefined"
      ? (localStorage.getItem("api_key") ?? "")
      : "";

  const sevenDaysAgoRef = useRef(new Date(Date.now() - SEVEN_DAYS_MS));
  const sevenDaysAgo = sevenDaysAgoRef.current;

  const recentUploads = uploads.filter((u) => {
    if (!u.uploaded_at) return false;
    const d = new Date(u.uploaded_at);
    return !isNaN(d.getTime()) && d >= sevenDaysAgo;
  });

  const raw = uploads[0]?.uploaded_at;
  const lastUploadDate = raw
    ? (() => { const d = new Date(raw); return isNaN(d.getTime()) ? "—" : raw.split("T")[0]; })()
    : "—";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-sans text-[20px] font-bold m-0" style={{ color: "var(--text)" }}>
          API Access &amp; Data Uploads
        </h2>
        <p className="font-sans text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          Manage your API key, review upload history, and monitor baselines
          {currentUser ? ` for mill ${currentUser.mill_id}` : ""}
        </p>
      </div>

      <div className="flex justify-between lg:flex-row md:flex-row flex-col">
        <div className="lg:w-[47%] md:w-[47%] w-full">
          <ApiKeyPanel
            apiKey={apiKey}
            uploadCount={recentUploads.length}
            lastUpload={lastUploadDate}
          />
        </div>
        <div className="lg:w-[47%] md:w-[47%] w-full">
          <h3 className="font-sans text-base font-semibold mb-3 text-(--text)">
            Upload Data
          </h3>
          <div className="max-w-150">
            <UploadZone
              onComplete={() => {
                try {
                  const taskId = sessionStorage.getItem("latest_task_id");
                  const filename = sessionStorage.getItem("latest_filename");
                  if (taskId && filename) setTaskId(filename, taskId);
                } catch { /* ignore */ }
              }}
            />
          </div>
        </div>
      </div>

      {/* Upload History */}
      <div>
        <h3 className="font-sans text-base font-semibold mb-3" style={{ color: "var(--text)" }}>
          Upload History
        </h3>
        <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {["FILENAME", "UPLOADED", "STATUS"].map((h) => (
                  <th key={h} className="font-mono text-[10px] tracking-[0.12em] px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploadsLoading
                ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={3} />)
                : uploads.length === 0
                  ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center font-mono text-[12px]" style={{ color: "var(--text-muted)" }}>
                        No uploads yet
                      </td>
                    </tr>
                  )
                  : uploads.map((u: UploadHistoryItem, index: number) => (
                    <tr
                      key={index}
                      className="transition-colors duration-150"
                      style={{ borderTop: "1px solid var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--text)" }}>
                        {u.filename}
                      </td>
                      <td className="font-mono text-[11px] px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                        {formatDate(u.uploaded_at)}
                      </td>
                      <td className="px-4 py-3">
                        <LiveStatusCell taskId={getTaskId(u.filename)} storedStatus={u.status} />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Baselines */}
      <div>
        <h3 className="font-sans text-base font-semibold mb-3" style={{ color: "var(--text)" }}>
          Current Baselines
        </h3>
        <p className="font-sans text-[12px] mb-3" style={{ color: "var(--text-muted)" }}>
          Baseline current readings used for anomaly detection and health scoring
        </p>
        <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {["MACHINE", "MEAN CURRENT (A)", "STD DEV (A)", "P95 CURRENT (A)", "LAST UPDATED"].map((h) => (
                  <th key={h} className="font-mono text-[10px] tracking-[0.12em] px-4 py-3" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baselinesLoading
                ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                : baselines.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center font-mono text-[12px]" style={{ color: "var(--text-muted)" }}>
                        No baselines established yet
                      </td>
                    </tr>
                  )
                  : baselines.map((b) => (
                    <tr
                      key={b.machine_id}
                      className="transition-colors duration-150"
                      style={{ borderTop: "1px solid var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="font-mono text-[13px] font-semibold px-4 py-3" style={{ color: "var(--text)" }}>{b.machine_id}</td>
                      <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--cyan)" }}>{b.mean_current.toFixed(1)}</td>
                      <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--text-secondary)" }}>±{b.std_current.toFixed(1)}</td>
                      <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--text-secondary)" }}>{b.p95_current.toFixed(1)}</td>
                      <td className="font-mono text-[11px] px-4 py-3" style={{ color: "var(--text-muted)" }}>{formatDateShort(b.updated_at)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}