import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

/** GET /api/v1/dashboard/summary — optional date param (defaults to today) */
export function useDashboardSummary(date?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(date),
    queryFn: () => dashboardApi.getSummary(date),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

/** GET /api/v1/dashboard/machines */
export function useDashboardMachines() {
  return useQuery({
    queryKey: queryKeys.dashboard.machines(),
    queryFn: dashboardApi.getMachines,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

/** GET /api/v1/dashboard/machine-specs */
export function useMachineSpecs() {
  return useQuery({
    queryKey: queryKeys.dashboard.machineSpecs(),
    queryFn: dashboardApi.getMachineSpecs,
    staleTime: 30 * 60_000, // specs rarely change
  });
}

/** GET /api/v1/dashboard/machines/{machine_id}/trends?range={range} */
export function useMachineTrends(machineId: string, range: string = "7d") {
  return useQuery({
    queryKey: queryKeys.dashboard.machineTrends(machineId, range),
    queryFn: () => dashboardApi.getMachineTrends(machineId, range),
    enabled: Boolean(machineId),
    staleTime: 5 * 60_000,
  });
}