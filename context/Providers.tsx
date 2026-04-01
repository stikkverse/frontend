"use client";

import { useState, useEffect } from "react";
import { ThemeContext } from "@/lib/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const STORAGE_KEY = "fs-theme";

type ThemePreference = "dark" | "light" | "system";

function getInitialPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as ThemePreference) ?? "system";
}

function resolveIsDark(pref: ThemePreference): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [isDark, setIsDark] = useState<boolean>(true);
  // One QueryClient per component instance — correct SSR-safe pattern.
  // The module-level `const client` was removed to avoid shadowing this.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10_000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  useEffect(() => {
    const pref = getInitialPreference();
    setPreference(pref);
    setIsDark(resolveIsDark(pref));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
    localStorage.setItem(STORAGE_KEY, preference);
  }, [isDark, preference]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (preference === "system") setIsDark(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  const setTheme = (pref: ThemePreference) => {
    setPreference(pref);
    setIsDark(resolveIsDark(pref));
  };

  return (
    <ThemeContext.Provider value={{ isDark, preference, setTheme }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeContext.Provider>
  );
};

export default Providers;