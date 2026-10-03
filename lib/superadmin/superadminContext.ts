"use client";

import { createContext, useContext } from "react";
import type { UserProfile } from "@/lib/database/type";

interface SuperadminAuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const SuperadminAuthContext = createContext<SuperadminAuthContextValue | null>(null);

export const useSuperadminAuth = (): SuperadminAuthContextValue => {
  const ctx = useContext(SuperadminAuthContext);
  if (!ctx) throw new Error("useSuperadminAuth must be used inside SuperadminAuthProvider");
  return ctx;
};