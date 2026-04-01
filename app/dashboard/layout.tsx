"use client";

import { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { useUnacknowledgedCount } from "@/hooks/useAlerts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);

  // Live alert count from the API — falls back to 0 while loading
  const unacknowledgedAlerts = useUnacknowledgedCount();

  useEffect(() => {
    const tm = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(tm);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-[background,color] duration-300"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="fixed inset-0 pointer-events-none z-0 gridBg" />
      <div className="fixed left-0 right-0 h-0.75 pointer-events-none z-1 animateLine" />

      <div className="relative z-2 px-5 pt-7 pb-12 w-[90%] mx-auto min-h-screen flex flex-col">
        <div
          className="transition-all duration-700"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(-12px)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Header />
          <DashboardNav alertCount={unacknowledgedAlerts} />
        </div>

        <div
          className="flex-1 mt-8 transition-all duration-500"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(10px)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            transitionDelay: "150ms",
          }}
        >
          {children}
        </div>

        <div className="mt-auto pt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}