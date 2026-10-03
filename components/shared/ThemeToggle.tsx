"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import type { ThemePreference } from "@/lib/context/ThemeContext";

const OPTIONS: { pref: ThemePreference; Icon: typeof Sun; label: string }[] = [
  { pref: "light", Icon: Sun, label: "Light mode" },
  { pref: "system", Icon: Monitor, label: "System theme" },
  { pref: "dark", Icon: Moon, label: "Dark mode" },
];

const ThemeToggle = () => {
  const { preference, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-[10px] border border-(--border) bg-(--bg-alt)">
      {OPTIONS.map(({ pref, Icon, label }) => {
        const isActive = preference === pref;
        return (
          <button
            key={pref}
            onClick={() => setTheme(pref)}
            aria-label={label}
            className={[
              "flex items-center justify-center w-7 h-7 rounded-[7px] transition-all duration-200",
              isActive
                ? "bg-(--cyan-bg) text-(--cyan) shadow-[0_0_8px_var(--cyan-glow)]"
                : "bg-transparent text-(--text-muted)",
            ].join(" ")}
          >
            <Icon size={14} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;