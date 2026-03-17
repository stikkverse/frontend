"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-[10px] border border-(--border) bg-(--bg-alt)">
      {/* Light mode */}
      <button
        onClick={() => isDark && toggleTheme()}
        aria-label="Switch to light mode"
        className="flex items-center justify-center w-7 h-7 rounded-[7px] transition-all duration-200"
        style={{
          background: !isDark ? "var(--cyan-bg)" : "transparent",
          color: !isDark ? "var(--cyan)" : "var(--text-muted)",
          boxShadow: !isDark ? "0 0 8px var(--cyan-glow)" : "none",
        }}
      >
        <Sun size={14} strokeWidth={2} />
      </button>

      {/* Dark mode */}
      <button
        onClick={() => !isDark && toggleTheme()}
        aria-label="Switch to dark mode"
        className="flex items-center justify-center w-7 h-7 rounded-[7px] transition-all duration-200"
        style={{
          background: isDark ? "var(--cyan-bg)" : "transparent",
          color: isDark ? "var(--cyan)" : "var(--text-muted)",
          boxShadow: isDark ? "0 0 8px var(--cyan-glow)" : "none",
        }}
      >
        <Moon size={14} strokeWidth={2} />
      </button>
    </div>
  );
}