import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertsApi } from "@/lib/database/api";
import { queryKeys } from "@/lib/database/queryKeys";
import type { Alert, AlertResolvePayload } from "@/lib/database/type";

// Module-level set so acknowledged IDs survive React Query refetches
const acknowledgedIds = new Set<number>();

/**databa
 * GET /api/v1/alerts/
 * Returns AlertItem[] — active + acknowledged only.
 * Each alert has a `status` field: "active" | "acknowledged" | "resolved"
 */
export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts.all(),
    queryFn: alertsApi.getAlerts,
    placeholderData: [] as Alert[],
    refetchInterval: 20_000,
    staleTime: 10_000,
    // Preserve local acknowledged state across refetches
    select: (data): Alert[] =>
      data.map((a) =>
        acknowledgedIds.has(a.id)
          ? {
              ...a,
              status: "acknowledged" as const,
              acknowledged_at: a.acknowledged_at ?? new Date().toISOString(),
            }
          : a,
      ),
  });
}

/**
 * GET /api/v1/alerts/history
 * Returns AlertItem[] — resolved alerts only.
 */
export function useAlertHistory(params?: {
  machine_id?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["alerts", "history", params],
    queryFn: () => alertsApi.getAlertHistory(params),
    placeholderData: [] as Alert[],
    staleTime: 30_000,
  });
}

/**
 * PATCH /api/v1/alerts/{alert_id}/acknowledge
 * Sets alert.status = "acknowledged"
 */
export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: number) => alertsApi.acknowledgeAlert(alertId),

    onMutate: async (alertId: number) => {
      acknowledgedIds.add(alertId);

      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.all() });
      const previous = queryClient.getQueryData<Alert[]>(queryKeys.alerts.all());

      queryClient.setQueryData<Alert[]>(queryKeys.alerts.all(), (old = []) =>
        old.map((a) =>
          a.id === alertId
            ? { ...a, status: "acknowledged" as const, acknowledged_at: new Date().toISOString() }
            : a,
        ),
      );

      return { previous };
    },

    onError: (_err, alertId, context) => {
      acknowledgedIds.delete(alertId);
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.alerts.all(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all() });
    },
  });
}

/**
 * PATCH /api/v1/alerts/{alert_id}/resolve
 * Removes alert from active feed — backend moves it to history.
 */
export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertId,
      payload,
    }: {
      alertId: number;
      payload: AlertResolvePayload;
    }) => alertsApi.resolveAlert(alertId, payload),

    onMutate: async ({ alertId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.all() });
      const previous = queryClient.getQueryData<Alert[]>(queryKeys.alerts.all());

      // Remove from active feed immediately
      queryClient.setQueryData<Alert[]>(
        queryKeys.alerts.all(),
        (old = []) => old.filter((a) => a.id !== alertId),
      );
      acknowledgedIds.delete(alertId);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.alerts.all(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all() });
      queryClient.invalidateQueries({ queryKey: ["alerts", "history"] });
    },
  });
}

/** Count of active (unacknowledged) alerts for nav badge */
export function useUnacknowledgedCount(): number {
  const { data = [] } = useAlerts();
  return data.filter((a) => a.status === "active").length;
}