"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavTab {
  value: string;
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

interface DashboardNavProps {
  alertCount?: number;
}

export default function DashboardNav({ alertCount = 0 }: DashboardNavProps) {
  const pathname = usePathname();

  const segment = pathname.split("/").pop() ?? "overview";
  const activeTab = ["overview", "machines", "alerts", "api", "team"].includes(segment)
    ? segment
    : "overview";

  const tabs: NavTab[] = [
    { value: "overview", href: "/dashboard",          label: "Overview",      icon: "◈" },
    { value: "machines", href: "/dashboard/machines", label: "Machines",      icon: "⚙" },
    { value: "alerts",   href: "/dashboard/alerts",   label: "Alerts",        icon: "⚡", badge: alertCount },
    { value: "api",      href: "/dashboard/api",      label: "API & Uploads", icon: "⟡" },
    { value: "team",     href: "/dashboard/team",     label: "Team",          icon: "◎" },
  ];

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="w-full py-5 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            asChild
            className="py-4 shrink-0"
          >
            <Link href={tab.href} className="no-underline">
              <span className="mr-0 sm:mr-1.5">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge != null && tab.badge > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-[10px] font-mono text-[11px] font-bold border text-(--red) bg-(--red-bg) border-(--red)">
                  {tab.badge}
                </span>
              )}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}