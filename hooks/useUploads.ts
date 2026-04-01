import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadsApi } from "@/lib/api";
import type { BaselineUpdate, MillSummaryParams } from "@/lib/type";
import { queryKeys } from "@/lib/queryKeys";

// ── Upload history ────────────────────────────────────────────────────────────

/** GET /api/v1/data/history */
export function useUploadHistory() {
  return useQuery({
    queryKey: queryKeys.uploads.history(),
    queryFn: uploadsApi.getHistory,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

// ── Upload mutations ──────────────────────────────────────────────────────────

type UploadPayload = { file: File; onProgress?: (pct: number) => void };

/** POST /api/v1/upload */
export function useUploadOperational() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: UploadPayload) =>
      uploadsApi.uploadOperational(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.history() });
    },
  });
}

/** POST /api/v1/baseline/upload */
export function useUploadBaselineInitial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: UploadPayload) =>
      uploadsApi.uploadBaselineInitial(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.baselines() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.history() });
    },
  });
}

/** POST /api/v1/baseline/update */
export function useUploadBaselineUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: UploadPayload) =>
      uploadsApi.uploadBaselineUpdate(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.baselines() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.history() });
    },
  });
}

// ── Task polling ──────────────────────────────────────────────────────────────

/**
 * GET /api/v1/task/{task_id}
 * Polls every 2 s, stops automatically on COMPLETED or FAILED.
 */
export function useTaskStatus(taskId: string | null) {
  return useQuery({
    queryKey: queryKeys.uploads.task(taskId ?? ""),
    queryFn: () => uploadsApi.getTaskStatus(taskId!),
    enabled: Boolean(taskId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "FAILED") return false;
      return 2_000;
    },
    staleTime: 0,
  });
}

// ── Baselines ─────────────────────────────────────────────────────────────────

/** GET /api/v1/baseline */
export function useBaselines() {
  return useQuery({
    queryKey: queryKeys.uploads.baselines(),
    queryFn: uploadsApi.getBaselines,
    staleTime: 5 * 60_000,
  });
}

/** GET /api/v1/baseline/history */
export function useBaselineHistory() {
  return useQuery({
    queryKey: queryKeys.uploads.baselineHistory(),
    queryFn: uploadsApi.getBaselineHistory,
    staleTime: 5 * 60_000,
  });
}

/** GET /api/v1/baseline/{machine_id}/history */
export function useMachineBaselineHistory(machineId: string) {
  return useQuery({
    queryKey: queryKeys.uploads.machineBaselineHistory(machineId),
    queryFn: () => uploadsApi.getMachineBaselineHistory(machineId),
    enabled: Boolean(machineId),
    staleTime: 5 * 60_000,
  });
}

/** PUT /api/v1/baseline/{machine_id} — manual JSON override */
export function useUpdateBaselineManual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      machineId,
      payload,
    }: {
      machineId: string;
      payload: BaselineUpdate;
    }) => uploadsApi.updateBaselineManual(machineId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.baselines() });
    },
  });
}

/** DELETE /api/v1/baseline/{machine_id} */
export function useDeleteBaseline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (machineId: string) => uploadsApi.deleteBaseline(machineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uploads.baselines() });
    },
  });
}

// ── Mill summary ──────────────────────────────────────────────────────────────

/** GET /api/v1/mill/{mill_id}/summary */
export function useMillSummary(params: MillSummaryParams) {
  return useQuery({
    queryKey: queryKeys.uploads.millSummary(
      params.millId,
      params.startDate,
      params.endDate,
      params.machineId,
    ),
    queryFn: () => uploadsApi.getMillSummary(params),
    enabled: Boolean(params.millId),
    staleTime: 5 * 60_000,
  });
}