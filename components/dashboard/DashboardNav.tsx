"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiDashboard2Fill } from "react-icons/ri";
import { GiGears } from "react-icons/gi";
import { IoWarning } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import { HiUsers } from "react-icons/hi2";
import type { IconType } from "react-icons";

interface NavTab {
  value: string;
  href: string;
  label: string;
  icon: IconType;
  color: string;
  badge?: number;
}

interface DashboardNavProps {
  alertCount?: number;
}

export default function DashboardNav({ alertCount = 0 }: DashboardNavProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");

  const activeTab = segments.includes("machines") ? "machines"
    : segments.includes("alerts") ? "alerts"
    : segments.includes("api") ? "api"
    : segments.includes("team") ? "team"
    : "overview";

  const tabs: NavTab[] = [
    { value: "overview", href: "/dashboard",          label: "Overview",      icon: RiDashboard2Fill, color: "#22d3ee" },
    { value: "machines", href: "/dashboard/machines", label: "Machines",      icon: GiGears,          color: "#a78bfa" },
    { value: "alerts",   href: "/dashboard/alerts",   label: "Alerts",        icon: IoWarning,        color: "#fbbf24", badge: alertCount },
    { value: "api",      href: "/dashboard/api",      label: "API & Uploads", icon: FiUploadCloud,    color: "#34d399" },
    { value: "team",     href: "/dashboard/team",     label: "Team",          icon: HiUsers,          color: "#f472b6" },
  ];

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="w-full py-5 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              asChild
              className="py-4 shrink-0"
            >
              <Link href={tab.href} className="no-underline flex items-center gap-1.5">
                <Icon
                  size={15}
                  style={{
                    color: tab.color,
                    filter: isActive ? `drop-shadow(0 0 6px ${tab.color})` : "none",
                    transition: "filter 0.2s ease",
                  }}
                />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge != null && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-[10px] font-mono text-[11px] font-bold border text-(--red) bg-(--red-bg) border-(--red)">
                    {tab.badge}
                  </span>
                )}
              </Link>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}