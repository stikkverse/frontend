"use client";

import { createContext, useContext } from "react";
import type { CurrentUser, UserRegister, RegisterResponse } from "@/lib/type";

interface AuthContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginWithToken: (
    accessToken: string,
    apiKey?: string | null,
    millId?: string | null,
  ) => Promise<void>;
  signup: (data: UserRegister) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used inside <AuthContext.Provider>");
  return ctx;
};
