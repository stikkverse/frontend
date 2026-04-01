import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import type { MillCreate, StatsUpdate, UserCreate } from "@/lib/type";
import { queryKeys } from "@/lib/queryKeys";

/** GET /api/v1/admin/users */
export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: adminApi.listUsers,
    staleTime: 2 * 60_000,
  });
}

/** POST /api/v1/admin/users */
export function useAdminCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreate) => adminApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
  });
}

/** PUT /api/v1/admin/users/{user_id}/reset-password */
export function useAdminResetPassword() {
  return useMutation({
    mutationFn: ({
      userId,
      password,
    }: {
      userId: number;
      password: string;
    }) => adminApi.resetUserPassword(userId, { password }),
  });
}

/** GET /api/v1/admin/mills */
export function useAdminMills() {
  return useQuery({
    queryKey: queryKeys.admin.mills(),
    queryFn: adminApi.listMills,
    staleTime: 5 * 60_000,
  });
}

/** POST /api/v1/admin/mills */
export function useAdminCreateMill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MillCreate) => adminApi.createMill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.mills() });
    },
  });
}

/** GET /api/v1/admin/uploads */
export function useAdminUploadHistory() {
  return useQuery({
    queryKey: queryKeys.admin.uploads(),
    queryFn: adminApi.getGlobalUploadHistory,
    staleTime: 60_000,
  });
}

/** PUT /api/v1/admin/stats/{stats_id} */
export function useAdminCorrectStats() {
  return useMutation({
    mutationFn: ({
      statsId,
      payload,
    }: {
      statsId: number;
      payload: StatsUpdate;
    }) => adminApi.correctMachineStats(statsId, payload),
  });
}