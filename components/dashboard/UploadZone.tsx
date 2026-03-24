"use client";

import { useState, useRef, useCallback } from "react";
import type { ProcessingStatus } from "@/lib/type";

type UploadMode = "operational" | "baseline-initial" | "baseline-update";

interface UploadState {
  file: File | null;
  status: ProcessingStatus | "IDLE";
  progress: number;
  recordsProcessed: number;
  totalRecords: number;
  message: string | null;
  taskId: string | null;
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

function StatusBadge({ status }: { status: ProcessingStatus | "IDLE" }) {
  const map: Record<string, { label: string; classes: string }> = {
    COMPLETED: {
      label: "COMPLETED",
      classes: "text-(--green) bg-(--green-bg) border border-(--green)",
    },
    PROCESSING: {
      label: "PROCESSING",
      classes: "text-(--cyan) bg-(--cyan-bg) border border-(--cyan)",
    },
    PENDING: {
      label: "QUEUED",
      classes: "text-(--amber) bg-(--amber-bg) border border-(--amber)",
    },
    FAILED: {
      label: "FAILED",
      classes: "text-(--red) bg-(--red-bg) border border-(--red)",
    },
    IDLE: {
      label: "READY",
      classes: "text-(--text-muted) bg-(--bg-alt) border border-(--border)",
    },
  };

  const s = map[status];

  return (
    <span
      className={`font-mono text-[9px] font-semibold tracking-[0.06em] px-2 py-0.5 rounded-full ${s.classes}`}
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
  status: ProcessingStatus | "IDLE";
}) {
  const barColor =
    status === "COMPLETED"
      ? "bg-(--green)"
      : status === "FAILED"
        ? "bg-(--red)"
        : "bg-(--cyan)";

  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden bg-border">
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function UploadZone() {
  const [mode, setMode] = useState<UploadMode>("operational");
  const [dragOver, setDragOver] = useState(false);
  const [upload, setUpload] = useState<UploadState>({
    file: null,
    status: "IDLE",
    progress: 0,
    recordsProcessed: 0,
    totalRecords: 0,
    message: null,
    taskId: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const config = MODE_CONFIG[mode];

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      setUpload((prev) => ({
        ...prev,
        file: null,
        status: "IDLE",
        message: "Only .csv files are accepted",
      }));
      return;
    }
    setUpload({
      file,
      status: "IDLE",
      progress: 0,
      recordsProcessed: 0,
      totalRecords: 0,
      message: `${file.name} ready to upload (${(file.size / 1024).toFixed(1)} KB)`,
      taskId: null,
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const simulateUpload = () => {
    if (!upload.file) return;

    const totalRecords = Math.floor(Math.random() * 1000) + 500;
    setUpload((prev) => ({
      ...prev,
      status: "PENDING",
      progress: 0,
      totalRecords,
      recordsProcessed: 0,
      taskId: `task_${Date.now()}`,
      message: "Queued for processing...",
    }));

    setTimeout(() => {
      setUpload((prev) => ({
        ...prev,
        status: "PROCESSING",
        message: "Processing records...",
      }));

      let processed = 0;
      const interval = setInterval(() => {
        processed += Math.floor(Math.random() * 120) + 40;
        if (processed >= totalRecords) {
          processed = totalRecords;
          clearInterval(interval);
          setUpload((prev) => ({
            ...prev,
            status: "COMPLETED",
            progress: 100,
            recordsProcessed: totalRecords,
            message: `Successfully processed ${totalRecords.toLocaleString()} records`,
          }));
        } else {
          setUpload((prev) => ({
            ...prev,
            progress: Math.round((processed / totalRecords) * 100),
            recordsProcessed: processed,
            message: `Processing... ${processed.toLocaleString()} / ${totalRecords.toLocaleString()} records`,
          }));
        }
      }, 400);
    }, 800);
  };

  const reset = () => {
    setUpload({
      file: null,
      status: "IDLE",
      progress: 0,
      recordsProcessed: 0,
      totalRecords: 0,
      message: null,
      taskId: null,
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  const isProcessing =
    upload.status === "PENDING" || upload.status === "PROCESSING";
  const isDone = upload.status === "COMPLETED" || upload.status === "FAILED";

  return (
    <div className="rounded-[14px] border border-border bg-(--surface) overflow-hidden shadow-(--card-shadow)">
      <div className="flex gap-1 p-1.5 border-b border-border bg-(--bg-alt)">
        {(Object.keys(MODE_CONFIG) as UploadMode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              if (!isProcessing) {
                setMode(m);
                reset();
              }
            }}
            disabled={isProcessing}
            className={[
              "font-mono text-[10px] tracking-[0.06em] px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              mode === m
                ? "bg-(--tab-active-bg) text-(--tab-active) font-semibold"
                : "bg-transparent text-(--text-muted) font-normal",
            ].join(" ")}
          >
            {MODE_CONFIG[m].label}
          </button>
        ))}
      </div>

      <div className="p-5">
        <p className="font-sans text-[12px] text-(--text-muted) mb-4">
          {config.description}
          <span className="ml-2 font-mono text-[9px] px-1.5 py-0.5 rounded bg-(--bg-alt) text-(--text-muted) border border-border">
            {config.endpoint}
          </span>
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!isProcessing) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!isProcessing && !upload.file) inputRef.current?.click();
          }}
          className={[
            "relative rounded-xl border-2 border-dashed transition-all duration-200 text-center cursor-pointer",
            dragOver
              ? "border-(--cyan) bg-(--cyan-bg)"
              : upload.file
                ? "border-(--border-light) bg-(--bg-alt)"
                : "border-border bg-(--bg-alt)",
            upload.file ? "p-5" : "px-5 py-9",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleInputChange}
            className="hidden"
          />

          {!upload.file && (
            <>
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center bg-(--cyan-bg) border-[1.5px] border-(--cyan)">
                <span className="text-lg text-(--cyan)">↑</span>
              </div>
              <p className="font-sans text-[13px] font-medium text-(--text) mb-1">
                Drop your CSV file here
              </p>
              <p className="font-mono text-[10px] text-(--text-muted)">
                or click to browse — .csv files only
              </p>
            </>
          )}
          {upload.file && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-[10px] font-bold bg-(--cyan-bg) text-(--cyan) border border-(--cyan)">
                    CSV
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] font-medium text-(--text) truncate">
                      {upload.file.name}
                    </p>
                    <p className="font-mono text-[10px] text-(--text-muted)">
                      {(upload.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={upload.status} />
                  {!isProcessing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reset();
                      }}
                      className="font-mono text-[9px] px-2 py-1 rounded cursor-pointer transition-colors duration-150 text-(--text-muted) bg-transparent border border-border hover:border-(--text-muted)"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {(isProcessing || isDone) && (
                <div>
                  <ProgressBar
                    progress={upload.progress}
                    status={upload.status}
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="font-mono text-[10px] text-(--text-muted)">
                      {upload.message}
                    </p>
                    <p
                      className={[
                        "font-mono text-[10px] font-semibold",
                        upload.status === "COMPLETED"
                          ? "text-(--green)"
                          : upload.status === "FAILED"
                            ? "text-(--red)"
                            : "text-(--cyan)",
                      ].join(" ")}
                    >
                      {upload.progress}%
                    </p>
                  </div>
                </div>
              )}
              {upload.taskId && (
                <p className="font-mono text-[9px] text-(--text-muted)">
                  Task: {upload.taskId}
                </p>
              )}
              {upload.status === "IDLE" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    simulateUpload();
                  }}
                  className="w-full py-2 rounded-lg font-mono text-[11px] font-semibold tracking-[0.08em] cursor-pointer transition-all duration-200 hover:opacity-90 border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_16px_var(--cyan-glow)]"
                >
                  UPLOAD &amp; PROCESS
                </button>
              )}

              {isDone && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="w-full py-2 rounded-lg font-mono text-[11px] font-semibold tracking-[0.08em] cursor-pointer transition-all duration-200 bg-(--bg-alt) border border-border text-(--text-secondary) hover:border-(--text-muted)"
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
