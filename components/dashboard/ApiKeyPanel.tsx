"use client";

import { useState } from "react";

interface ApiKeyPanelProps {
  apiKey: string;
  uploadCount: number;
  lastUpload: string;
}

export default function ApiKeyPanel({ apiKey, uploadCount, lastUpload }: ApiKeyPanelProps) {
  const [copied,   setCopied]   = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);

  const handleCopy = (): void => {
    navigator.clipboard.writeText(apiKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[14px] border border-dash-border bg-dash-surface p-[22px_24px] shadow-card">
        <p className="font-mono text-[10px] tracking-[0.14em] text-dash-text-muted mb-3.5">
          YOUR API KEY
        </p>

        <div className="flex items-center gap-2 rounded-[10px] border border-dash-border bg-dash-bg-alt p-3 flex-wrap">
          <span
            className="w-1.75 h-1.75 rounded-full shrink-0"
            style={{ background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan-glow)" }}
          />
          <code className="font-mono text-[13px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-30 text-dash-cyan">
            {revealed ? apiKey : "fsa_B_••••••••••••"}
          </code>
          <div className="flex gap-1.5">
            <button
              onClick={() => setRevealed(!revealed)}
              className="font-mono text-[10px] tracking-[0.05em] px-2.5 py-1.25 rounded-md border border-dash-border bg-transparent text-dash-text-secondary cursor-pointer"
            >
              {revealed ? "HIDE" : "REVEAL"}
            </button>
            <button
              onClick={handleCopy}
              className="font-mono text-[10px] font-semibold tracking-[0.05em] px-3 py-1.25 rounded-md cursor-pointer transition-all duration-200"
              style={{
                background: copied ? "var(--green)" : "var(--cyan-bg)",
                border: `1px solid ${copied ? "var(--green)" : "var(--cyan)"}`,
                color: copied ? "#fff" : "var(--cyan)",
              }}
            >
              {copied ? "✓ COPIED" : "COPY"}
            </button>
          </div>
        </div>

        <p className="font-sans text-[12px] text-dash-text-muted mt-2.5 leading-relaxed">
          Share this key with your mill operator to enable CSV data uploads via the API.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[14px] border border-dash-border bg-dash-surface p-[18px_22px] shadow-card">
          <p className="font-mono text-[9px] tracking-[0.14em] text-dash-text-muted mb-1.5">
            UPLOADS (LAST 7 DAYS)
          </p>
          <p className="font-mono text-[28px] font-bold text-dash-text">{uploadCount}</p>
        </div>
        <div className="rounded-[14px] border border-dash-border bg-dash-surface p-[18px_22px] shadow-card">
          <p className="font-mono text-[9px] tracking-[0.14em] text-dash-text-muted mb-1.5">
            LAST UPLOAD
          </p>
          <p className="font-mono text-base font-semibold text-dash-text mt-1.5">{lastUpload}</p>
        </div>
      </div>
    </div>
  );
}