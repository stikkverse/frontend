"use client";

import { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import DashboardNav from "@/components/dashboard/overview/DashboardNav";
import DashboardAuthGuard from "@/components/dashboard/auth/DashboardAuthGuard";
import { useUnacknowledgedCount } from "@/hooks/useAlerts";

import BackgroundGrid from "@/components/shared/BackgroundGrid";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);
  const activeAlerts = useUnacknowledgedCount();

  useEffect(() => {
    const tm = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(tm);
  }, []);

  return (
    <DashboardAuthGuard>
      <div className="relative h-screen overflow-hidden flex flex-col">
        <BackgroundGrid />

        <div className="relative z-2 px-5 pt-7 pb-6 w-[90%] mx-auto h-full flex flex-col">
          <div
            className="shrink-0 transition-all duration-700"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(-12px)",
              transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <Header />
            <DashboardNav alertCount={activeAlerts} />
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

          <div className="shrink-0 relative z-2">
            <Footer />
          </div>
        </div>
      </div>
    </DashboardAuthGuard>
  );
}
