"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SuperadminAuthContext } from "@/lib/superadmin/superadminContext";
import superadminAxios from "@/lib/superadmin/superadminAxios";
import type { UserProfile } from "@/lib/type";

export default function SuperadminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("sa_access_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await superadminAxios.get("/api/v1/auth/me");

      if (data.role !== "superadmin") {
        localStorage.removeItem("sa_access_token");
        setUser(null);
      } else {
        setUser(data);
      }
    } catch {
      localStorage.removeItem("sa_access_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const { data } = await superadminAxios.post("/api/v1/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("sa_access_token", data.access_token);

    const meResponse = await superadminAxios.get("/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    if (meResponse.data.role !== "superadmin") {
      localStorage.removeItem("sa_access_token");
      throw new Error("Access denied. Superadmin credentials required.");
    }

    setUser(meResponse.data);
    router.push("/superadmin");
  };

  const logout = async () => {
    try {
      await superadminAxios.post("/api/v1/auth/logout");
    } catch {
      // proceed even if server logout fails
    } finally {
      localStorage.removeItem("sa_access_token");
      setUser(null);
      router.push("/superadmin/login");
    }
  };

  return (
    <SuperadminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </SuperadminAuthContext.Provider>
  );
}
