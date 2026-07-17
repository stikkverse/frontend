"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Factory, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavTab {
  value: string;
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
  badge?: number;
}

interface SuperadminNavProps {
  alertCount?: number;
}

export default function SuperadminNav({ alertCount = 0 }: SuperadminNavProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");

  const activeTab = segments.includes("mills")
    ? "mills"
    : segments.includes("alerts")
      ? "alerts"
      : "health";

  const tabs: NavTab[] = [
    {
      value: "health",
      href: "/superadmin",
      label: "Platform Health",
      icon: ShieldCheck,
      color: "#34d399",
    },
    {
      value: "mills",
      href: "/superadmin/mills",
      label: "Mills Activity",
      icon: Factory,
      color: "#22d3ee",
    },
    {
      value: "alerts",
      href: "/superadmin/alerts",
      label: "Alerts Overview",
      icon: AlertTriangle,
      color: "#fbbf24",
      badge: alertCount,
    },
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
              <Link
                href={tab.href}
                className="no-underline flex items-center gap-1.5"
              >
                <Icon
                  size={15}
                  style={{
                    color: tab.color,
                    filter: isActive
                      ? `drop-shadow(0 0 6px ${tab.color})`
                      : "none",
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
