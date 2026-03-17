"use client";

import { useState, useEffect } from "react";
import { MOCK_DATA } from "@/lib/mockData";
import type { DashboardData, TabItem } from "@/lib/type";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import MachinesTab from "@/components/dashboard/tabs/MachineTab";
import ApiTab from "@/components/dashboard/tabs/ApiTab";

type ActiveTab = "overview" | "machines" | "api";

const buildTabs = (highRiskCount: number): TabItem[] => [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "machines", label: "Machines", icon: "⚙", badge: highRiskCount },
  { id: "api", label: "API & Uploads", icon: "⟡" },
];

export default function Dashboard() {
  const [data] = useState<DashboardData>(MOCK_DATA);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const highRiskCount = data.machines.filter(
    (m) => m.bearing_risk === "HIGH",
  ).length;
  const tabs = buildTabs(highRiskCount);

  useEffect(() => {
    const tm = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(tm);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-dash-bg text-dash-text transition-[background,color] duration-300">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px),
                            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="fixed left-0 right-0 h-1 pointer-events-none z-1 animate-scanline"
        style={{
          background:
            "linear-gradient(transparent, var(--scanline-color), transparent)",
        }}
      />

      <div className="relative z-2 px-5 pt-7 pb-12 w-[90%] mx-auto min-h-screen flex flex-col">
        <div
          className="transition-all duration-700"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(-12px)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Header
            data={data}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as ActiveTab)}
          />
        </div>

        <div
          className="transition-all duration-500 my-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(10px)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            transitionDelay: "150ms",
          }}
        >
          {activeTab === "overview" && <OverviewTab data={data} />}
          {activeTab === "machines" && <MachinesTab data={data} />}
          {activeTab === "api" && <ApiTab data={data} />}
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
