"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-11 h-6 rounded-full border border-dash-border shrink-0 transition-all duration-300"
      style={{ background: isDark ? "var(--surface-hover)" : "var(--bg-alt)" }}
    >
      <div
        className="absolute top-0.75 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] transition-all duration-300"
        style={{
          background: isDark ? "var(--cyan)" : "var(--amber)",
          left: isDark ? "22px" : "3px",
          boxShadow: `0 0 8px ${isDark ? "var(--cyan-glow)" : "var(--amber-glow)"}`,
          transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {isDark ? "☽" : "☀"}
      </div>
    </button>
  );
}