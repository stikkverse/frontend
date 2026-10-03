"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/auth/authContext";
import Logo from "./Logo";

export default function Header() {
  const [now, setNow] = useState<Date | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
  const init = setTimeout(() => setNow(new Date()), 0);
  const interval = setInterval(() => setNow(new Date()), 60_000);
  return () => { clearTimeout(init); clearInterval(interval); };
}, []);

  return (
    <div className="mb-7 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <Logo size={50} showWordmark />
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
            className="font-mono text-[10px] tracking-[0.08em] px-3 py-1.5 rounded-lg border border-border text-(--text-muted) hover:text-(--red) hover:border-(--red) transition-colors duration-200 cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
