import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { queryKeys } from "@/lib/queryKeys";
import type {
  MillSummaryDetail,
  MillSummaryParams,
  SummaryMetrics,
  MillMachine,
} from "@/lib/type";


export type { MillSummaryDetail, MillSummaryParams, SummaryMetrics, MillMachine };

async function fetchMillSummary({
  millId,
  startDate,
  endDate,
  machineId,
}: MillSummaryParams): Promise<MillSummaryDetail> {
  const { data } = await axiosInstance.get<MillSummaryDetail>(
    `/api/v1/mill/${millId}/summary`,
    {
      params: {
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
        ...(machineId && { machine_id: machineId }),
      },
    },
  );
  return data;
}

export function useMillSummary(params?: Partial<Omit<MillSummaryParams, "millId">>) {
  const millId =
    typeof window !== "undefined"
      ? (localStorage.getItem("mill_id") ?? "")
      : "";

  return useQuery({
    queryKey: queryKeys.uploads.millSummary(
      millId,
      params?.startDate,
      params?.endDate,
      params?.machineId,
    ),
    queryFn: () =>
      fetchMillSummary({
        millId,
        startDate: params?.startDate,
        endDate: params?.endDate,
        machineId: params?.machineId,
      }),
    enabled: Boolean(millId),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function useMillMetrics(params?: Partial<Omit<MillSummaryParams, "millId">>) {
  const { data, ...rest } = useMillSummary(params);
  return { data: data?.summary_metrics ?? null, ...rest };
}

export function useMillMachines(params?: Partial<Omit<MillSummaryParams, "millId">>) {
  const { data, ...rest } = useMillSummary(params);
  return { data: data?.machines ?? [], ...rest };
}