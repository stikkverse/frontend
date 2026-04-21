"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/lib/authContext";
import axiosInstance from "@/lib/axiosInstance";
import type { CurrentUser } from "@/lib/type";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.get("/api/v1/auth/me");
      setUser(data);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("api_key");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const { data } = await axiosInstance.post("/api/v1/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("access_token", data.access_token);
    if (data.api_key) {
      localStorage.setItem("api_key", data.api_key);
    }

    await fetchUser();
    router.push("/dashboard");
  };

  const verifysignup = async (payload: {
    email: string;
    password: string;
    full_name: string;
    mill_name: string;
    mill_tag: string;
  }) => {
    await axiosInstance.post("/api/v1/auth/register", payload);
  };

  const signup = async (payload: {
    email: string;
    password: string;
    mill_id: string;
    role: "OWNER" | "MANAGER" | "MEMBER" | "ADMIN";
  }) => {
    await axiosInstance.post("/api/v1/auth/register", payload);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/v1/auth/logout");
    } catch {
      // proceed even if server logout fails
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("api_key");
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        verifysignup,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
