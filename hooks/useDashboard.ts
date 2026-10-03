import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/database/api";
import { queryKeys } from "@/lib/database/queryKeys";
import type { DashboardSummary, DashboardMachine, MachineSpec } from "@/lib/database/type";

const EMPTY_SUMMARY: DashboardSummary = {
  total_energy_kwh: 0,
  total_co2_kg: 0,
  machine_count: 0,
  active_alerts_count: 0,
  date: null,
};

/**
 * GET /api/v1/dashboard/summary?date={date}
 * @param date optional YYYY-MM-DD, defaults to today on backend
 */
export function useDashboardSummary(date?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(date),
    queryFn: () => dashboardApi.getSummary(date),
    placeholderData: EMPTY_SUMMARY,
    refetchInterval: 60_000,
    staleTime: 30_000,
    select: (data) => data ?? EMPTY_SUMMARY,
  });
}

/**GET /api/v1/dashboard/machines*/
export function useDashboardMachines() {
  return useQuery({
    queryKey: queryKeys.dashboard.machines(),
    queryFn: dashboardApi.getMachines,
    placeholderData: [] as DashboardMachine[],
    refetchInterval: 30_000,
    staleTime: 15_000,
    select: (data) => (Array.isArray(data) ? data : []),
  });
}

/**GET /api/v1/dashboard/machine-specs*/
export function useMachineSpecs() {
  return useQuery({
    queryKey: queryKeys.dashboard.machineSpecs(),
    queryFn: dashboardApi.getMachineSpecs,
    placeholderData: [] as MachineSpec[],
    staleTime: 30 * 60_000,
    select: (data) =>
      Array.isArray(data)
        ? data
        : Object.values(data as Record<string, MachineSpec>),
  });
}

/**GET /api/v1/dashboard/machines/{machine_id}/trends?range={range}*/
export function useMachineTrends(machineId: string, range: string = "7d") {
  return useQuery({
    queryKey: queryKeys.dashboard.machineTrends(machineId, range),
    queryFn: () => dashboardApi.getMachineTrends(machineId, range),
    enabled: Boolean(machineId),
    staleTime: 5 * 60_000,
    select: (data) => (Array.isArray(data) ? data : []),
  });
}