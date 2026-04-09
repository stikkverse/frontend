"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/authContext";

export default function Header() {
  const [now, setNow] = useState<Date | null>(null);
  const { user, logout } = useAuth();

   useEffect(() => {
    setNow(new Date()); // set initial value on client only
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-7 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-9.5 h-9.5 rounded-[10px] flex items-center justify-center font-mono text-base font-bold shrink-0 bg-(--cyan-bg) border-[1.5px] border-(--cyan) text-(--cyan)">
            FS
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-(--cyan)">
              FACTORYSENSE.AI
            </p>
            <h1 className="font-sans text-[22px] font-bold leading-tight text-(--text)">
              {user?.mill_name ?? "Dashboard"}{" "}
              {user?.mill_id && (
                <span className="font-normal text-[16px] text-(--text-muted)">
                  — Mill {user.mill_id}
                </span>
              )}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-(--text-muted)">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-(--green) shadow-[0_0_6px_var(--green)]" />
            LIVE —{" "}
            {now
              ? now.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </div>
          <ThemeToggle />
          <button
            onClick={logout}
            className="font-mono text-[10px] tracking-[0.08em] px-3 py-1.5 rounded-lg border border-(--border) text-(--text-muted) hover:text-(--red) hover:border-(--red) transition-colors duration-200 cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}