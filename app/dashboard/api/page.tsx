"use client";

import { useUploadHistory, useBaselines } from "@/hooks/useUploads";
import { useCurrentUser } from "@/hooks/useTeam";
import ApiKeyPanel from "@/components/dashboard/ApiKeyPanel";
import UploadInfoCard from "@/components/dashboard/UploadInfo";
import type { ProcessingStatus } from "@/lib/type";

function statusStyle(status: ProcessingStatus) {
  switch (status) {
    case "COMPLETED":
      return { color: "var(--green)", bg: "var(--green-bg)" };
    case "PROCESSING":
    case "PENDING":
      return { color: "var(--amber)", bg: "var(--amber-bg)" };
    case "FAILED":
      return { color: "var(--red)", bg: "var(--red-bg)" };
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

export default function ApiPage() {
  const { data: uploads = [], isLoading: uploadsLoading } = useUploadHistory();
  const { data: baselines = [], isLoading: baselinesLoading } = useBaselines();
  const { data: currentUser } = useCurrentUser();

  const apiKey =
    typeof window !== "undefined"
      ? (localStorage.getItem("api_key") ?? "")
      : "";

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUploads = uploads.filter(
    (u) => new Date(u.timestamp) >= sevenDaysAgo,
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2
          className="font-sans text-[20px] font-bold m-0"
          style={{ color: "var(--text)" }}
        >
          API Access &amp; Data Uploads
        </h2>
        <p
          className="font-sans text-[13px] mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Manage your API key, review upload history, and monitor baselines
          {currentUser ? ` for ${currentUser.mill_name}` : ""}
        </p>
      </div>

      <div className="flex justify-between lg:flex-row md:flex-row flex-col">
        <div className="lg:w-[47%] md:w-[47%] w-full">
          <ApiKeyPanel
            apiKey={apiKey}
            uploadCount={recentUploads.length}
            lastUpload={
              uploads[0]?.timestamp
                ? uploads[0].timestamp.split("T")[0]
                : "—"
            }
          />
        </div>
        <div className="lg:w-[47%] md:w-[47%] w-full">
          <h3 className="font-sans text-base font-semibold mb-3 text-(--text)">
            Upload Data
          </h3>
          <div className="max-w-150">
            <UploadInfoCard />
          </div>
        </div>
      </div>
      <div>
        <h3
          className="font-sans text-base font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Upload History
        </h3>
        <div
          className="overflow-x-auto rounded-[12px] border"
          style={{ borderColor: "var(--border)" }}
        >
          <table
            className="w-full text-left"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {["FILENAME", "UPLOADED", "STATUS"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploadsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={3} />
                  ))
                : uploads.map((u, i) => {
                    const s = statusStyle(u.status);
                    return (
                      <tr
                        key={`${u.filename}-${i}`}
                        className="transition-colors duration-150"
                        style={{ borderTop: "1px solid var(--border)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--surface-hover)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          className="font-mono text-[12px] px-4 py-3"
                          style={{ color: "var(--text)" }}
                        >
                          {u.filename}
                        </td>
                        <td
                          className="font-mono text-[11px] px-4 py-3"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {new Date(u.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full"
                            style={{
                              color: s.color,
                              background: s.bg,
                              border: `1px solid ${s.color}`,
                            }}
                          >
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3
          className="font-sans text-base font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Current Baselines
        </h3>
        <p
          className="font-sans text-[12px] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Baseline current readings used for anomaly detection and health scoring
        </p>
        <div
          className="overflow-x-auto rounded-[12px] border"
          style={{ borderColor: "var(--border)" }}
        >
          <table
            className="w-full text-left"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {[
                  "MACHINE",
                  "MEAN CURRENT (A)",
                  "STD DEV (A)",
                  "P95 CURRENT (A)",
                  "LAST UPDATED",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baselinesLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={5} />
                  ))
                : baselines.map((b) => (
                    <tr
                      key={b.machine_id}
                      className="transition-colors duration-150"
                      style={{ borderTop: "1px solid var(--border)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--surface-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        className="font-mono text-[13px] font-semibold px-4 py-3"
                        style={{ color: "var(--text)" }}
                      >
                        {b.machine_id}
                      </td>
                      <td
                        className="font-mono text-[12px] px-4 py-3"
                        style={{ color: "var(--cyan)" }}
                      >
                        {b.mean_current.toFixed(1)}
                      </td>
                      <td
                        className="font-mono text-[12px] px-4 py-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        ±{b.std_current.toFixed(1)}
                      </td>
                      <td
                        className="font-mono text-[12px] px-4 py-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {b.p95_current.toFixed(1)}
                      </td>
                      <td
                        className="font-mono text-[11px] px-4 py-3"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {new Date(b.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}