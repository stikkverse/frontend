import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { UserCreate, UserListItem, PendingApprovalItem } from "@/lib/type";

/** GET /api/v1/auth/me → reshaped with a convenient mill_id */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.team.currentUser(),
    queryFn: async () => {
      const user = await teamApi.getCurrentUser();
      return {
        ...user,
        mill_id:
          user.mills?.[0]?.mill_id ?? localStorage.getItem("mill_id") ?? "",
        mill_name: user.mills?.[0]?.mill_id ?? "",
      };
    },
    staleTime: 10 * 60_000,
  });
}

/** GET /api/v1/admin/users */
export function useMembers() {
  return useQuery({
    queryKey: queryKeys.team.members(),
    queryFn: (): Promise<UserListItem[]> => teamApi.getMembers(),
    staleTime: 60_000,
  });
}

/** POST /api/v1/admin/users */
export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreate) => teamApi.createMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.members() });
    },
  });
}

/** DELETE /api/v1/admin/users/{id} */
export function useRevokeMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => teamApi.revokeMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.members() });
    },
  });
}

/** GET /api/v1/admin/pending-approvals */
export function usePendingApprovals() {
  return useQuery({
    queryKey: queryKeys.team.pendingApprovals(),
    queryFn: (): Promise<PendingApprovalItem[]> =>
      teamApi.getPendingApprovals(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/** DELETE /api/v1/admin/pending-approvals/{id} */
export function useRejectApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: number) => teamApi.rejectApproval(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.team.pendingApprovals(),
      });
    },
  });
}
