"use client";

import { MOCK_UPLOAD_HISTORY, MOCK_BASELINES, MOCK_CURRENT_USER } from "@/lib/mockData";
import ApiKeyPanel from "@/components/dashboard/ApiKeyPanel";
import type { ProcessingStatus } from "@/lib/type";
import UploadZone from "@/components/dashboard/UploadZone";

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

export default function ApiPage() {
  const uploads = MOCK_UPLOAD_HISTORY;
  const baselines = MOCK_BASELINES;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUploads = uploads.filter((u) => new Date(u.uploaded_at) >= sevenDaysAgo);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-sans text-[20px] font-bold m-0" style={{ color: "var(--text)" }}>
          API Access &amp; Data Uploads
        </h2>
        <p className="font-sans text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          Manage your API key, review upload history, and monitor baselines for {MOCK_CURRENT_USER.mill_name}
        </p>
      </div>
      <div className="flex justify-between lg:flex-row md:flex-row flex-col">
      <div className="lg:w-[47%] md:w-[47%] w-full">
        <ApiKeyPanel
          apiKey="fsa_B_8f3d9a2c4e1b7f6d"
          uploadCount={recentUploads.length}
          lastUpload={uploads[0]?.uploaded_at.split("T")[0] ?? "—"}
        />
      </div>
       <div className="lg:w-[47%] md:w-[47%] w-full">
        <h3 className="font-sans text-base font-semibold mb-3 text-(--text)">
          Upload Data
        </h3>
        <div className="max-w-150">
          <UploadZone />
        </div>
      </div>
      </div>
      <div>
        <h3 className="font-sans text-base font-semibold mb-3" style={{ color: "var(--text)" }}>
          Upload History
        </h3>
        <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {["FILENAME", "UPLOADED", "RECORDS", "STATUS", "BY"].map((h) => (
                  <th key={h} className="font-mono text-[10px] tracking-[0.12em] px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploads.map((u) => {
                const s = statusStyle(u.status);
                return (
                  <tr
                    key={u.id}
                    className="transition-colors duration-150"
                    style={{ borderTop: "1px solid var(--border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--text)" }}>
                      {u.filename}
                    </td>
                    <td className="font-mono text-[11px] px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                      {new Date(u.uploaded_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--text)" }}>
                      {u.records_processed.toLocaleString()}{" "}
                      <span style={{ color: "var(--text-muted)" }}>/ {u.total_records.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full"
                        style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}` }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="font-mono text-[11px] px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {u.uploaded_by}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
                  <th key={h} className="font-mono text-[10px] tracking-[0.12em] px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {baselines.map((b) => (
                <tr
                  key={b.machine_id}
                  className="transition-colors duration-150"
                  style={{ borderTop: "1px solid var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="font-mono text-[13px] font-semibold px-4 py-3" style={{ color: "var(--text)" }}>
                    {b.machine_id}
                  </td>
                  <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--cyan)" }}>
                    {b.mean_current.toFixed(1)}
                  </td>
                  <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    ±{b.std_current.toFixed(1)}
                  </td>
                  <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {b.p95_current.toFixed(1)}
                  </td>
                  <td className="font-mono text-[11px] px-4 py-3" style={{ color: "var(--text-muted)" }}>
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
