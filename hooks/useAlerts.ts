import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Alert, AlertResolvePayload } from "@/lib/type";

export type ExtendedAlert = Alert & { resolved?: boolean };

const acknowledgedIds = new Set<number>();

/**GET /api/v1/alerts/*/
export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts.all(),
    queryFn: alertsApi.getAlerts,
    placeholderData: [] as Alert[],
    refetchInterval: 20_000,
    staleTime: 10_000,
    // Preserve acknowledged state across refetches
    // in case the backend hasn't persisted yet
    select: (data): Alert[] =>
      data.map((a) =>
        acknowledgedIds.has(a.id)
          ? {
              ...a,
              acknowledged: true,
              acknowledged_at: a.acknowledged_at ?? new Date().toISOString(),
              acknowledged_by: a.acknowledged_by ?? "You",
            }
          : a,
      ),
  });
}

/**GET /api/v1/alerts/history*/
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

/**PATCH /api/v1/alerts/{alert_id}/acknowledge*/
export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: number) => alertsApi.acknowledgeAlert(alertId),

    onMutate: async (alertId: number) => {
      // Persist in module-level set so select() re-applies it on every refetch
      acknowledgedIds.add(alertId);

      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.all() });
      const previous = queryClient.getQueryData<Alert[]>(queryKeys.alerts.all());

      queryClient.setQueryData<Alert[]>(queryKeys.alerts.all(), (old = []) =>
        old.map((a) =>
          a.id === alertId
            ? {
                ...a,
                acknowledged: true,
                acknowledged_at: new Date().toISOString(),
                acknowledged_by: "You",
              }
            : a,
        ),
      );

      return { previous };
    },

    onError: (_err, alertId, context) => {
      // Roll back both the cache and the module-level set
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

/**PATCH /api/v1/alerts/{alert_id}/resolve*/
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

      // Remove from active feed — backend does the same permanently
      queryClient.setQueryData<Alert[]>(
        queryKeys.alerts.all(),
        (old = []) => old.filter((a) => a.id !== alertId),
      );

      // Also clean up from acknowledged set
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

/** Count of unacknowledged active alerts for the nav badge */
export function useUnacknowledgedCount(): number {
  const { data = [] } = useAlerts();
  return data.filter((a) => !a.acknowledged).length;
}