"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useSuperadminAuth } from "@/lib/superadmin/superadminContext";
import Logo from "@/components/shared/Logo";

export default function SuperadminHeader() {
  const [now, setNow] = useState<Date | null>(null);
  const { user, logout } = useSuperadminAuth();

  useEffect(() => {
    const init = setTimeout(() => setNow(new Date()), 0);
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => {
      clearTimeout(init);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mb-7 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-3.5 flex-col">
          <Logo size={50} showWordmark />
          <h1 className="font-sans text-[20px] font-bold leading-tight text-(--text)">
            Command Center
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div>
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

            {user && (
              <span className="font-mono text-[10px] text-(--violet) hidden sm:inline">
                {user.email}
              </span>
            )}
          </div>
          <ThemeToggle />

          <button
            onClick={logout}
            className="font-mono text-[10px] tracking-[0.08em] px-3 py-1.5 rounded-lg border border-border text-(--text-muted) hover:text-(--red) hover:border-(--red) transition-colors duration-200 cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
