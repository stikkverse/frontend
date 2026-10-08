import { useQuery } from "@tanstack/react-query";
import superadminAxios from "@/lib/superadmin/superadminAxios";
import type {
  PlatformHealthResponse,
  MillActivityItem,
  AlertOverviewItem,
  MillAlertsOverviewItem,
} from "@/lib/database/type";

export type MillSortKey =
  | "mill_id"
  | "owner_email"
  | "machine_count"
  | "last_data_date"
  | "avg_health_score_7d"
  | "open_alerts"
  | "status";

export type SortOrder = "asc" | "desc";

const SA_KEYS = {
  health: () => ["superadmin", "health"] as const,
  millsActivity: (sortBy: MillSortKey, order: SortOrder) =>
    ["superadmin", "mills-activity", sortBy, order] as const,
  alertsOverview: () => ["superadmin", "alerts-overview"] as const,
  alertsByMill: () => ["superadmin", "alerts-by-mill"] as const,
};

export function usePlatformHealth() {
  return useQuery<PlatformHealthResponse>({
    queryKey: SA_KEYS.health(),
    queryFn: async () => {
      const { data } = await superadminAxios.get("/api/v1/superadmin/health");
      return data;
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useMillsActivity(
  sortBy: MillSortKey = "status",
  order: SortOrder = "desc",
) {
  return useQuery<MillActivityItem[]>({
    queryKey: SA_KEYS.millsActivity(sortBy, order),
    queryFn: async () => {
      const { data } = await superadminAxios.get(
        "/api/v1/superadmin/mills/activity",
        { params: { sort_by: sortBy, order } },
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useAlertsOverview() {
  return useQuery<AlertOverviewItem[]>({
    queryKey: SA_KEYS.alertsOverview(),
    queryFn: async () => {
      const { data } = await superadminAxios.get(
        "/api/v1/superadmin/alerts/overview",
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: 20_000,
    refetchInterval: 20_000,
  });
}

export function useMillAlertsOverview() {
  return useQuery<MillAlertsOverviewItem[]>({
    queryKey: SA_KEYS.alertsByMill(),
    queryFn: async () => {
      const { data } = await superadminAxios.get(
        "/api/v1/superadmin/alerts/overview",
        { params: { group_by: "mill" } },
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: 20_000,
    refetchInterval: 20_000,
  });
}
