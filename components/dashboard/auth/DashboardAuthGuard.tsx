"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/authContext";

export default function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--bg)">
        <p className="font-mono text-[12px] tracking-[0.2em] text-(--text-muted) animate-pulse">
          VERIFYING SESSION...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
