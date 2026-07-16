"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSuperadminAuth } from "@/lib/superadmin/superadminContext";
import { useAlertsOverview } from "@/hooks/useSuperadmin";
import SuperadminNav from "@/components/superadmin/SuperadminNav";
import BackgroundGrid from "@/components/shared/BackgroundGrid";
import SuperadminHeader from "@/components/superadmin/SuperadminHeader";

export default function SuperadminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useSuperadminAuth();
  const { data: alerts = [] } = useAlertsOverview();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/superadmin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const tm = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(tm);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg)">
        <p className="font-mono text-[12px] text-(--text-muted) tracking-[0.1em] animate-pulse">
          LOADING COMMAND CENTER...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative h-screen overflow-hidden transition-[background,color] duration-300 bg-(--bg) text-(--text)">
      <BackgroundGrid />

      <div className="relative z-2 px-5 pt-7 pb-6 w-[90%] mx-auto h-full flex flex-col">
        {/* Fixed header + nav */}
        <div
          className="shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(-12px)",
          }}
        >
          <SuperadminHeader />
          <SuperadminNav alertCount={alerts.length} />
        </div>
        <div
          className="flex-1 min-h-0 mt-8 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-500"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(10px)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            transitionDelay: "150ms",
          }}
        >
          {children}
        </div>
        <div className="shrink-0 pt-4 text-center font-mono text-[9px] tracking-[0.12em] text-(--text-muted)">
          STIKKVERSE COMMAND CENTER — SUPERADMIN ONLY
        </div>
      </div>
    </div>
  );
}
