"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUploadOperational,
  useUploadBaselineInitial,
  useUploadBaselineUpdate,
  useTaskStatus,
} from "@/hooks/useUploads";
import { queryKeys } from "@/lib/database/queryKeys";
import type { ProcessingStatus } from "@/lib/database/type";

type UploadMode = "operational" | "baseline-initial" | "baseline-update";

interface UploadZoneProps {
  onComplete?: () => void;
}

const MODE_CONFIG: Record<
  UploadMode,
  { label: string; description: string; endpoint: string }
> = {
  operational: {
    label: "Operational Data",
    description: "Upload daily sensor readings CSV — processed in background",
    endpoint: "POST /api/v1/upload",
  },
  "baseline-initial": {
    label: "Initial Baseline",
    description: "Establish first-time baseline readings for machines",
    endpoint: "POST /api/v1/baseline/upload",
  },
  "baseline-update": {
    label: "Baseline Update",
    description: "Incrementally refine existing machine baselines",
    endpoint: "POST /api/v1/baseline/update",
  },
};

function StatusBadge({ status }: { status: ProcessingStatus | "IDLE" | "UPLOADING" }) {
  const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
    COMPLETED:  { label: "COMPLETED",  color: "var(--green)",      bg: "var(--green-bg)",  border: "var(--green)"  },
    PROCESSING: { label: "PROCESSING", color: "var(--cyan)",       bg: "var(--cyan-bg)",   border: "var(--cyan)"   },
    PENDING:    { label: "QUEUED",     color: "var(--amber)",      bg: "var(--amber-bg)",  border: "var(--amber)"  },
    FAILED:     { label: "FAILED",     color: "var(--red)",        bg: "var(--red-bg)",    border: "var(--red)"    },
    UPLOADING:  { label: "UPLOADING",  color: "var(--cyan)",       bg: "var(--cyan-bg)",   border: "var(--cyan)"   },
    IDLE:       { label: "READY",      color: "var(--text-muted)", bg: "var(--bg-alt)",    border: "var(--border)" },
  };

  const s = map[status];
  return (
    <span
      className="font-mono text-[9px] font-semibold tracking-[0.06em] px-2 py-0.5 rounded-full"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {s.label}
    </span>
  );
}

function ProgressBar({
  progress,
  status,
}: {
  progress: number;
  status: ProcessingStatus | "IDLE" | "UPLOADING";
}) {
  const color =
    status === "COMPLETED"
      ? "var(--green)"
      : status === "FAILED"
        ? "var(--red)"
        : "var(--cyan)";
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${progress}%`, background: color }}
      />
    </div>
  );
}

export default function UploadZone({ onComplete }: UploadZoneProps) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<UploadMode>("operational");
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadOperational    = useUploadOperational();
  const uploadBaselineInitial = useUploadBaselineInitial();
  const uploadBaselineUpdate  = useUploadBaselineUpdate();

  const { data: taskStatus } = useTaskStatus(taskId);

  const activeMutation =
    mode === "operational"
      ? uploadOperational
      : mode === "baseline-initial"
        ? uploadBaselineInitial
        : uploadBaselineUpdate;

  const isDone =
    taskStatus?.status === "COMPLETED" || taskStatus?.status === "FAILED";

  const currentStatus: ProcessingStatus | "IDLE" | "UPLOADING" =
    taskStatus?.status ?? (isUploading ? "UPLOADING" : "IDLE");

  const progress =
    taskStatus?.status === "COMPLETED"
      ? 100
      : taskStatus
        ? Math.round(taskStatus.progress)
        : isUploading
          ? uploadProgress
          : 0;

  const message =
    taskStatus?.message ?? (isUploading ? "Sending file to server…" : null);

  const config = MODE_CONFIG[mode];

  // When task completes — refresh dashboard data and notify parent
  useEffect(() => {
    if (taskStatus?.status === "COMPLETED") {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.machines() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.history() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.baselines() });
    }
  }, [taskStatus?.status, queryClient]);

  const handleFile = useCallback((f: File) => {
    if (!f.name.endsWith(".csv")) {
      setFileError("Only .csv files are accepted");
      return;
    }
    setFileError(null);
    setFile(f);
    setTaskId(null);
    setUploadProgress(0);
    setIsUploading(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const onProgress = (pct: number) => setUploadProgress(pct);
    const opts = { file, onProgress };

    const onSuccess = (data: {
      task_id: string;
      message: string;
      estimated_initial_seconds: number;
    }) => {
      setIsUploading(false);
      if (data.task_id) {
        setTaskId(data.task_id);
        // Save both task_id and filename so the history table can poll this task
        sessionStorage.setItem("latest_task_id", data.task_id);
        if (file) sessionStorage.setItem("latest_filename", file.name);
      }
    };

    const onError = () => setIsUploading(false);

    if (mode === "operational")
      uploadOperational.mutate(opts, { onSuccess, onError });
    else if (mode === "baseline-initial")
      uploadBaselineInitial.mutate(opts, { onSuccess, onError });
    else
      uploadBaselineUpdate.mutate(opts, { onSuccess, onError });
  };

  const reset = () => {
    setFile(null);
    setTaskId(null);
    setUploadProgress(0);
    setFileError(null);
    setIsUploading(false);
    uploadOperational.reset();
    uploadBaselineInitial.reset();
    uploadBaselineUpdate.reset();
    if (inputRef.current) inputRef.current.value = "";
  };

  const isLocked = isUploading || activeMutation.isPending;

  return (
    <div
      className="rounded-[14px] border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--card-shadow)" }}
    >
      {/* Mode tabs */}
      <div
        className="flex gap-1 p-1.5 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-alt)" }}
      >
        {(Object.keys(MODE_CONFIG) as UploadMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { if (!isLocked) { setMode(m); reset(); } }}
            disabled={isLocked}
            className="font-mono text-[10px] tracking-[0.06em] px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: mode === m ? "var(--tab-active-bg)" : "transparent",
              color: mode === m ? "var(--tab-active)" : "var(--text-muted)",
              fontWeight: mode === m ? 600 : 400,
            }}
          >
            {MODE_CONFIG[m].label}
          </button>
        ))}
      </div>

      <div className="p-5">
        <p className="font-sans text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>
          {config.description}
          <span
            className="ml-2 font-mono text-[9px] px-1.5 py-0.5 rounded border"
            style={{ background: "var(--bg-alt)", color: "var(--text-muted)", borderColor: "var(--border)" }}
          >
            {config.endpoint}
          </span>
        </p>

        {fileError && (
          <p className="font-mono text-[11px] mb-3" style={{ color: "var(--red)" }}>
            ⚠ {fileError}
          </p>
        )}

        {activeMutation.isError && (
          <p className="font-mono text-[11px] mb-3" style={{ color: "var(--red)" }}>
            ⚠{" "}
            {(activeMutation.error as { response?: { data?: { detail?: string } } })
              ?.response?.data?.detail ?? "Upload failed. Please try again."}
          </p>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); if (!isLocked) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => { if (!isLocked && !file) inputRef.current?.click(); }}
          className="relative rounded-xl border-2 border-dashed transition-all duration-200 text-center cursor-pointer"
          style={{
            borderColor: dragOver ? "var(--cyan)" : file ? "var(--border)" : "var(--border)",
            background: dragOver ? "var(--cyan-bg)" : "var(--bg-alt)",
            padding: file ? "20px" : "36px 20px",
          }}
        >
          <input ref={inputRef} type="file" accept=".csv" onChange={handleInputChange} className="hidden" />

          {!file && (
            <>
              <div
                className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center border-[1.5px]"
                style={{ background: "var(--cyan-bg)", borderColor: "var(--cyan)" }}
              >
                <span className="text-lg" style={{ color: "var(--cyan)" }}>↑</span>
              </div>
              <p className="font-sans text-[13px] font-medium mb-1" style={{ color: "var(--text)" }}>
                Drop your CSV file here
              </p>
              <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                or click to browse — .csv files only
              </p>
            </>
          )}

          {file && (
            <div className="flex flex-col gap-3">
              <div className="">
                <div className="">
                  <div className="flex items-center justify-between">
                    <p className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold border bg-cyan-bg text-(--cyan) border-(--cyan)">CSV</p>
                    <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={currentStatus} />
                  {!isLocked && !taskId && (
                    <button
                      onClick={(e) => { e.stopPropagation(); reset(); }}
                      className="font-mono text-[9px] p-2 rounded cursor-pointer transition-colors duration-150 border text-text-muted bg-transparent border-border"
                    >
                      ✕
                    </button>
                  )}
                </div>
                  </div>

                    <div className="my-2">
                    <p className="font-mono text-[12px] font-medium break-all" style={{ color: "var(--text)" }}>
                      {file.name}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  
                </div>
                
              </div>

              {(isUploading || taskId) && (
                <div>
                  <ProgressBar progress={progress} status={currentStatus} />
                  <div className="flex justify-between mt-1.5">
                    <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {message}
                      {taskStatus && taskStatus.total_records > 0 &&
                        ` — ${taskStatus.records_processed.toLocaleString()} / ${taskStatus.total_records.toLocaleString()} records`}
                    </p>
                    <p
                      className="font-mono text-[10px] font-semibold"
                      style={{
                        color:
                          currentStatus === "COMPLETED"
                            ? "var(--green)"
                            : currentStatus === "FAILED"
                              ? "var(--red)"
                              : "var(--cyan)",
                      }}
                    >
                      {progress}%
                    </p>
                  </div>
                </div>
              )}

              {taskId && (
                <p className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
                  Task: {taskId}
                </p>
              )}

              {taskStatus?.status === "COMPLETED" && (
                <p className="font-mono text-[11px] font-semibold" style={{ color: "var(--green)" }}>
                  ✓ {taskStatus.records_processed.toLocaleString()} records processed — dashboard updated
                </p>
              )}

              {taskStatus?.status === "FAILED" && (
                <p className="font-mono text-[11px]" style={{ color: "var(--red)" }}>
                  ⚠ {taskStatus.message?.split("\n")[0] ?? "Processing failed"}
                </p>
              )}

              {currentStatus === "IDLE" && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  className="w-full py-2 rounded-lg font-mono text-[11px] font-semibold tracking-[0.08em] cursor-pointer transition-all duration-200 hover:opacity-90 border"
                  style={{
                    borderColor: "var(--cyan)",
                    background: "linear-gradient(135deg, var(--cyan), #818cf8)",
                    color: "white",
                    boxShadow: "0 0 16px var(--cyan-glow)",
                  }}
                >
                  UPLOAD &amp; PROCESS
                </button>
              )}

              {isDone && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onComplete) onComplete();
                    reset();
                  }}
                  className="w-full py-2 rounded-lg font-mono text-[11px] font-semibold tracking-[0.08em] cursor-pointer transition-all duration-200 border"
                  style={{
                    background: "var(--bg-alt)",
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  UPLOAD ANOTHER FILE
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}