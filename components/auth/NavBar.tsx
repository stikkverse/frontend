"use client";

import React, { useState, useEffect } from "react";
import ThemeToggle from "../shared/ThemeToggle";
import Logo from "../shared/Logo";

const NavBar = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 lg:w-[80%] md:w-[80%] w-[90%] mx-auto py-4">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
      <Logo size={50} showWordmark />
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
};

export default NavBar;
