"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/lib/authContext";

export default function RequireManageUsers({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const { canManageUsers } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !canManageUsers) {
      router.replace("/dashboard");
    }
  }, [isLoading, canManageUsers, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-mono text-[12px] text-(--text-muted) tracking-[0.1em] animate-pulse">
          CHECKING ACCESS...
        </p>
      </div>
    );
  }

  if (!canManageUsers) return null;

  return <>{children}</>;
}
