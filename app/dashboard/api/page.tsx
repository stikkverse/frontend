"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import {
  useUploadHistory,
  useBaselines,
  useTaskStatus,
} from "@/hooks/useUploads";
import { useCurrentUser } from "@/hooks/useTeam";
import ApiKeyPanel from "@/components/dashboard/ApiKeyPanel";
import UploadInfoCard from "@/components/dashboard/UploadInfo";
import type { ProcessingStatus, UploadHistoryItem } from "@/lib/type";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import Pagination from "@/components/ui/pagination";

const UPLOADS_PER_PAGE = 6;
const BASELINES_PER_PAGE = 6;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

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
    case "COMPLETED":
      return { color: "var(--green)", bg: "var(--green-bg)" };
    case "PROCESSING":
      return { color: "var(--cyan)", bg: "var(--cyan-bg)" };
    case "PENDING":
      return { color: "var(--amber)", bg: "var(--amber-bg)" };
    case "FAILED":
      return { color: "var(--red)", bg: "var(--red-bg)" };
  }
}

function TableRowSkeleton({ cols }: { cols: number }) {
  return (
    <tr className="border-t border-(--border)">
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
      style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}`,
      }}
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
    try {
      sessionStorage.setItem("task_id_map", JSON.stringify(ref.current));
    } catch { /* ignore */ }
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

export default function ApiPage() {
  const { data: uploads = [], isLoading: uploadsLoading } = useUploadHistory();
  const { data: baselines = [], isLoading: baselinesLoading } = useBaselines();
  const { data: currentUser } = useCurrentUser();
  const { getTaskId, setTaskId } = useTaskIdMap();

  const [uploadsPage, setUploadsPage] = useState(1);
  const [baselinesPage, setBaselinesPage] = useState(1);

  const apiKey =
    typeof window !== "undefined"
      ? (localStorage.getItem("api_key") ?? "")
      : "";

  const sevenDaysAgo = useRef(new Date(Date.now() - SEVEN_DAYS_MS)).current;

  const recentUploads = uploads.filter((u) => {
    if (!u.uploaded_at) return false;
    const d = new Date(u.uploaded_at);
    return !isNaN(d.getTime()) && d >= sevenDaysAgo;
  });

  const raw = uploads[0]?.uploaded_at;
  const lastUploadDate = raw
    ? (() => {
        const d = new Date(raw);
        return isNaN(d.getTime()) ? "—" : raw.split("T")[0];
      })()
    : "—";

  const uploadsTotalPages = Math.max(1, Math.ceil(uploads.length / UPLOADS_PER_PAGE));
  const paginatedUploads = useMemo(
    () => uploads.slice((uploadsPage - 1) * UPLOADS_PER_PAGE, uploadsPage * UPLOADS_PER_PAGE),
    [uploads, uploadsPage],
  );

  const baselinesTotalPages = Math.max(1, Math.ceil(baselines.length / BASELINES_PER_PAGE));
  const paginatedBaselines = useMemo(
    () => baselines.slice((baselinesPage - 1) * BASELINES_PER_PAGE, baselinesPage * BASELINES_PER_PAGE),
    [baselines, baselinesPage],
  );

  useEffect(() => {
    if (uploadsPage > uploadsTotalPages) setUploadsPage(1);
  }, [uploadsTotalPages, uploadsPage]);

  useEffect(() => {
    if (baselinesPage > baselinesTotalPages) setBaselinesPage(1);
  }, [baselinesTotalPages, baselinesPage]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-sans text-[20px] font-bold m-0 text-(--text)">
          API Access &amp; Data Uploads
        </h2>
        <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
          Manage your API key, review upload history, and monitor baselines
          {currentUser ? ` for ${currentUser.mill_id}` : ""}
        </p>
      </div>
      <div className="flex justify-between lg:flex-row md:flex-row flex-col gap-6">
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
            <UploadInfoCard
              onTaskCreated={(filename, taskId) => {
                if (taskId && filename) setTaskId(filename, taskId);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans text-base font-semibold text-(--text)">
            Upload History
          </h3>
          {!uploadsLoading && uploads.length > 0 && (
            <span className="font-mono text-[10px] text-(--text-muted)">
              {uploads.length} total uploads
            </span>
          )}
        </div>
        <div className="overflow-x-auto rounded-[12px] border border-border bg-(--bg)">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--bg-alt)">
                {["FILENAME", "UPLOADED", "STATUS"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-[0.12em] px-4 py-3 text-(--text-muted)"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploadsLoading ? (
                Array.from({ length: UPLOADS_PER_PAGE }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={3} />
                ))
              ) : uploads.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center font-mono text-[12px] text-(--text-muted)"
                  >
                    No uploads yet
                  </td>
                </tr>
              ) : (
                paginatedUploads.map((u: UploadHistoryItem, i: number) => (
                  <tr
                    key={`${u.filename}-${(uploadsPage - 1) * UPLOADS_PER_PAGE + i}`}
                    className="border-t border-border transition-colors duration-150 hover:bg-(--surface-hover)"
                  >
                    <td className="font-mono text-[12px] px-4 py-3 text-(--text)">
                      {u.filename}
                    </td>
                    <td className="font-mono text-[11px] px-4 py-3 text-(--text-secondary)">
                      {formatDate(u.uploaded_at)}
                    </td>
                    <td className="px-4 py-3">
                      <LiveStatusCell
                        taskId={getTaskId(u.filename)}
                        storedStatus={u.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!uploadsLoading && uploads.length > UPLOADS_PER_PAGE && (
          <Pagination
            currentPage={uploadsPage}
            totalPages={uploadsTotalPages}
            onPageChange={setUploadsPage}
            className="mt-4"
          />
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-sans text-base font-semibold text-(--text)">
              Current Baselines
            </h3>
            <p className="font-sans text-[12px] mt-1 text-(--text-muted)">
              Baseline current readings used for anomaly detection and health scoring
            </p>
          </div>
          {!baselinesLoading && baselines.length > 0 && (
            <span className="font-mono text-[10px] text-(--text-muted)">
              {baselines.length} machines
            </span>
          )}
        </div>
        <div className="overflow-x-auto rounded-[12px] border border-border bg-(--bg)">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--bg-alt)">
                {["MACHINE", "MEAN CURRENT (A)", "STD DEV (A)", "P95 CURRENT (A)", "LAST UPDATED"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-[0.12em] px-4 py-3 text-(--text-muted)"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baselinesLoading ? (
                Array.from({ length: BASELINES_PER_PAGE }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))
              ) : baselines.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center font-mono text-[12px] text-(--text-muted)"
                  >
                    No baselines established yet
                  </td>
                </tr>
              ) : (
                paginatedBaselines.map((b) => (
                  <tr
                    key={b.machine_id}
                    className="border-t border-border transition-colors duration-150 hover:bg-(--surface-hover)"
                  >
                    <td className="font-mono text-[13px] font-semibold px-4 py-3 text-(--text)">
                      {b.machine_id}
                    </td>
                    <td className="font-mono text-[12px] px-4 py-3 text-(--cyan)">
                      {b.mean_current.toFixed(1)}
                    </td>
                    <td className="font-mono text-[12px] px-4 py-3 text-(--text-secondary)">
                      ±{b.std_current.toFixed(1)}
                    </td>
                    <td className="font-mono text-[12px] px-4 py-3 text-(--text-secondary)">
                      {b.p95_current.toFixed(1)}
                    </td>
                    <td className="font-mono text-[11px] px-4 py-3 text-(--text-muted)">
                      {formatDateShort(b.updated_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!baselinesLoading && baselines.length > BASELINES_PER_PAGE && (
          <Pagination
            currentPage={baselinesPage}
            totalPages={baselinesTotalPages}
            onPageChange={setBaselinesPage}
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
}