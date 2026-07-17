import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { TeammateInvite, TeammateResponse, InvitationResponse } from "@/lib/type";


/**GET /api/v1/auth/me → UserProfile*/
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.team.currentUser(),
    queryFn: async () => {
      const user = await teamApi.getCurrentUser();
      return {
        ...user,
        
        mill_id: user.mills?.[0]?.mill_id ?? localStorage.getItem("mill_id") ?? "",
        mill_name: user.mills?.[0]?.mill_id ?? "",
      };
    },
    staleTime: 10 * 60_000,
  });
}

export function useTeammates() {
  return useQuery({
    queryKey: queryKeys.team.teammates(),
    queryFn: (): Promise<TeammateResponse[]> => teamApi.getTeammates(),
    staleTime: 60_000,
  });
}

/** GET /api/v1/auth/invitations → InvitationResponse[] */
export function useInvitations() {
  return useQuery({
    queryKey: queryKeys.team.invitations(),
    queryFn: (): Promise<InvitationResponse[]> => teamApi.getInvitations(),
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

/** POST /api/v1/auth/invitations/{id}/resend */
export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teamApi.resendInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.invitations() });
    },
  });
}

/** DELETE /api/v1/auth/invitations/{id} */
export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teamApi.revokeInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.invitations() });
    },
  });
}