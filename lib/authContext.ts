"use client";

import { createContext, useContext } from "react";
import type { CurrentUser } from "@/lib/type";

interface AuthContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  verifysignup: (data: {
    email: string;
    password: string;
    full_name: string;
    mill_name: string;
    mill_tag: string;
  }) => Promise<void>;
  signup: (data: {
  email: string;
  password: string;
  mill_id: string;
  role: "OWNER" | "MANAGER" | "MEMBER" | "ADMIN";
}) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used inside <AuthContext.Provider>");
  return ctx;
};