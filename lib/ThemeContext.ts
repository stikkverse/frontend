"use client";

import { createContext, useContext } from "react";

export type ThemePreference = "dark" | "light" | "system";

interface ThemeContextValue {
  isDark: boolean;
  preference: ThemePreference;
  setTheme: (pref: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeContext.Provider>");
  return ctx;
};