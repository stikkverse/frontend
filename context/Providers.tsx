"use client";

import { useState, useEffect } from "react";
import { ThemeContext } from "@/lib/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark((v) => !v) }}>
      {children}
    </ThemeContext.Provider>
  );
}