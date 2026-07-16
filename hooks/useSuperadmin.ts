import { useQuery } from "@tanstack/react-query";
import superadminAxios from "@/lib/superadmin/superadminAxios";
import type {
  PlatformHealthResponse,
  MillActivityItem,
  AlertOverviewItem,
} from "@/lib/type";

const SA_KEYS = {
  health: () => ["superadmin", "health"] as const,
  millsActivity: () => ["superadmin", "mills-activity"] as const,
  alertsOverview: () => ["superadmin", "alerts-overview"] as const,
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

export function useMillsActivity() {
  return useQuery<MillActivityItem[]>({
    queryKey: SA_KEYS.millsActivity(),
    queryFn: async () => {
      const { data } = await superadminAxios.get(
        "/api/v1/superadmin/mills/activity",
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
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
