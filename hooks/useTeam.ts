import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "@/lib/api";
import type { InvitationResponse, TeammateInvite, TeammateResponse, TeammateUpdate } from "@/lib/type";
import { queryKeys } from "@/lib/queryKeys";

/** GET /api/v1/auth/me */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.team.currentUser(),
    queryFn: teamApi.getCurrentUser,
    staleTime: 10 * 60_000,
  });
}

/** GET /api/v1/auth/teammates */
export function useTeammates() {
  return useQuery({
    queryKey: queryKeys.team.teammates(),
    queryFn: teamApi.getTeammates,
    placeholderData: [] as TeammateResponse[],
    staleTime: 2 * 60_000,
  });
}

/** PUT /api/v1/auth/teammates/{user_id}/role */
export function useUpdateTeammateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: TeammateUpdate;
    }) => teamApi.updateTeammateRole(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.teammates() });
    },
  });
}

/** DELETE /api/v1/auth/teammates/{user_id} */
export function useRemoveTeammate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => teamApi.removeTeammate(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.teammates() });
    },
  });
}

/** GET /api/v1/auth/invitations */
export function useInvitations() {
  return useQuery({
    queryKey: queryKeys.team.invitations(),
    queryFn: teamApi.getInvitations,
    placeholderData: [] as InvitationResponse[],
    staleTime: 60_000,
  });
}

/** POST /api/v1/auth/invite */
export function useSendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TeammateInvite) => teamApi.sendInvitation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.invitations() });
    },
  });
}

/** POST /api/v1/auth/invitations/{invitation_id}/resend */
export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teamApi.resendInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.invitations() });
    },
  });
}

/** DELETE /api/v1/auth/invitations/{invitation_id} */
export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teamApi.revokeInvitation(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.team.invitations() });
      const previous = queryClient.getQueryData(queryKeys.team.invitations());
      queryClient.setQueryData(
        queryKeys.team.invitations(),
        (old: InvitationResponse[] = []) => old.filter((inv) => inv.id !== id),
      );
      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.team.invitations(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.invitations() });
    },
  });
}