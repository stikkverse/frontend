import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Alert } from "@/lib/type";

/** GET /api/v1/alerts/ — polls every 20 s */
export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts.all(),
    queryFn: alertsApi.getAlerts,
    placeholderData: [] as Alert[],
    refetchInterval: 20_000,
    staleTime: 10_000,
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: number) => alertsApi.acknowledgeAlert(alertId),

    onMutate: async (alertId: number) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.all() });
      const previous = queryClient.getQueryData<Alert[]>(queryKeys.alerts.all());

      queryClient.setQueryData<Alert[]>(queryKeys.alerts.all(), (old = []) =>
        old.map((a) =>
          a.id === alertId
            ? {
                ...a,
                acknowledged: true,
                acknowledged_at: new Date().toISOString(),
                acknowledged_by: "current_user",
              }
            : a,
        ),
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.alerts.all(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all() });
    },
  });
}

/** Derived: count of unacknowledged alerts for the nav badge */
export function useUnacknowledgedCount(): number {
  const { data = [] } = useAlerts();
  return data.filter((a) => !a.acknowledged).length;
}