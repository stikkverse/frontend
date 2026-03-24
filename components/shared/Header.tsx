"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="mb-7 w-full ">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-3.5">
          <div
            className="w-9.5 h-9.5 rounded-[10px] flex items-center justify-center font-mono text-base font-bold shrink-0"
            style={{
              background: "var(--cyan-bg)",
              border: "1.5px solid var(--cyan)",
              color: "var(--cyan)",
            }}
          >
            FS
          </div>
          <div>
            <p
              className="font-mono text-[9px] tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              FACTORYSENSE.AI
            </p>
            <h1 className="font-sans text-[22px] font-bold leading-tight text-dash-text">
              Mill 
              <span className="font-normal text-[18px] text-dash-text-muted">
                — Vitals Monitor
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-dash-text-muted">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                background: "var(--green)",
                boxShadow: "0 0 6px var(--green)",
              }}
            />
            LIVE —{" "}
            {now.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
