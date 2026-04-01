"use client";

import { useState } from "react";
import {
  useTeammates,
  useInvitations,
  useSendInvitation,
  useResendInvitation,
  useRevokeInvitation,
  useCurrentUser,
} from "@/hooks/useTeam";
import type { TeammateResponse, InvitationResponse, UserRole } from "@/lib/type";

function roleStyle(role: UserRole) {
  switch (role) {
    case "OWNER":
      return { color: "var(--cyan)", bg: "var(--cyan-bg)" };
    case "ADMIN":
      return { color: "var(--amber)", bg: "var(--amber-bg)" };
    case "MANAGER":
      return { color: "var(--green)", bg: "var(--green-bg)" };
    case "MEMBER":
    default:
      return { color: "var(--text-muted)", bg: "var(--bg-alt)" };
  }
}

function RowSkeleton({ cols }: { cols: number }) {
  return (
    <tr style={{ borderTop: "1px solid var(--border)" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-24 rounded bg-(--bg-alt) animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function TeammateRow({
  teammate,
  currentUserId,
}: {
  teammate: TeammateResponse;
  currentUserId?: number;
}) {
  const rs = roleStyle(teammate.role);
  const isCurrentUser = teammate.id === currentUserId;

  return (
    <tr
      className="transition-colors duration-150"
      style={{ borderTop: "1px solid var(--border)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0"
            style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.color}` }}
          >
            {teammate.email[0].toUpperCase()}
          </div>
          <p className="font-mono text-[12px] font-medium" style={{ color: "var(--text)" }}>
            {teammate.email}
            {isCurrentUser && (
              <span
                className="ml-2 font-mono text-[8px] tracking-widest px-1.5 py-0.5 rounded"
                style={{ color: "var(--cyan)", background: "var(--cyan-bg)" }}
              >
                YOU
              </span>
            )}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full"
          style={{ color: rs.color, background: rs.bg, border: `1px solid ${rs.color}` }}
        >
          {teammate.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className="font-mono text-[9px] tracking-[0.08em] px-2 py-0.5 rounded-full"
          style={{
            color: teammate.is_verified ? "var(--green)" : "var(--amber)",
            background: teammate.is_verified ? "var(--green-bg)" : "var(--amber-bg)",
          }}
        >
          {teammate.is_verified ? "VERIFIED" : "PENDING"}
        </span>
      </td>
      <td className="font-mono text-[11px] px-4 py-3" style={{ color: "var(--text-muted)" }}>
        {new Date(teammate.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
    </tr>
  );
}

function InvitationRow({
  invitation,
  onRevoke,
  onResend,
  isRevoking,
  isResending,
}: {
  invitation: InvitationResponse;
  onRevoke: (id: number) => void;
  onResend: (id: number) => void;
  isRevoking: boolean;
  isResending: boolean;
}) {
  const rs = roleStyle(invitation.role);
  const isExpired = new Date(invitation.expires_at) < new Date();

  return (
    <tr
      className="transition-colors duration-150"
      style={{ borderTop: "1px solid var(--border)", opacity: isExpired ? 0.5 : 1 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td className="font-mono text-[12px] px-4 py-3" style={{ color: "var(--text)" }}>
        {invitation.email}
      </td>
      <td className="px-4 py-3">
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full"
          style={{ color: rs.color, background: rs.bg, border: `1px solid ${rs.color}` }}
        >
          {invitation.role}
        </span>
      </td>
      <td
        className="font-mono text-[10px] px-4 py-3"
        style={{ color: isExpired ? "var(--red)" : "var(--text-muted)" }}
      >
        {isExpired
          ? "EXPIRED"
          : `Expires ${new Date(invitation.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onResend(invitation.id)}
            disabled={isResending}
            className="font-mono text-[9px] tracking-[0.06em] px-2.5 py-1 rounded-md cursor-pointer transition-colors duration-200 disabled:opacity-50"
            style={{ background: "var(--cyan-bg)", border: "1px solid var(--cyan)", color: "var(--cyan)" }}
          >
            {isResending ? "..." : "RESEND"}
          </button>
          <button
            onClick={() => onRevoke(invitation.id)}
            disabled={isRevoking}
            className="font-mono text-[9px] tracking-[0.06em] px-2.5 py-1 rounded-md cursor-pointer transition-colors duration-200 disabled:opacity-50"
            style={{ background: "var(--red-bg)", border: "1px solid var(--red)", color: "var(--red)" }}
          >
            {isRevoking ? "..." : "REVOKE"}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function TeamPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: teammates = [], isLoading: teammatesLoading } = useTeammates();
  const { data: invitations = [], isLoading: invitationsLoading } = useInvitations();

  const { mutate: sendInvite, isPending: isSending } = useSendInvitation();
  const { mutate: resend, isPending: isResending } = useResendInvitation();
  const { mutate: revoke, isPending: isRevoking } = useRevokeInvitation();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MANAGER" | "MEMBER">("MEMBER");
  const [sentFlash, setSentFlash] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail) return;
    sendInvite(
      { email: inviteEmail, role: inviteRole },
      {
        onSuccess: () => {
          setInviteEmail("");
          setSentFlash(true);
          setTimeout(() => setSentFlash(false), 3000);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-sans text-[20px] font-bold m-0" style={{ color: "var(--text)" }}>
          Team Management
        </h2>
        <p className="font-sans text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
          {teammatesLoading
            ? "Loading team…"
            : `${teammates.length} team member${teammates.length !== 1 ? "s" : ""}${currentUser ? ` in ${currentUser.mill_name}` : ""}`}
        </p>
      </div>

      {/* Invite form */}
      <div
        className="rounded-[14px] border p-5 max-w-[600px]"
        style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--card-shadow)" }}
      >
        <p className="font-mono text-[10px] tracking-[0.14em] mb-3" style={{ color: "var(--text-muted)" }}>
          INVITE TEAMMATE
        </p>
        <div className="flex gap-2 flex-wrap">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border font-mono text-[12px] outline-none transition-colors duration-200"
            style={{ borderColor: "var(--border)", background: "var(--bg-alt)", color: "var(--text)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as "MANAGER" | "MEMBER")}
            className="px-3 py-2 rounded-lg border font-mono text-[11px] outline-none cursor-pointer"
            style={{ borderColor: "var(--border)", background: "var(--bg-alt)", color: "var(--text)" }}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="MANAGER">MANAGER</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={!inviteEmail || isSending}
            className="font-mono text-[11px] font-semibold tracking-[0.06em] px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: sentFlash ? "var(--green)" : "var(--cyan-bg)",
              border: `1px solid ${sentFlash ? "var(--green)" : "var(--cyan)"}`,
              color: sentFlash ? "#fff" : "var(--cyan)",
            }}
          >
            {isSending ? "SENDING…" : sentFlash ? "✓ SENT" : "SEND INVITE"}
          </button>
        </div>
      </div>

      {/* Active Members */}
      <div>
        <h3 className="font-sans text-base font-semibold mb-3" style={{ color: "var(--text)" }}>
          Active Members
        </h3>
        <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {["MEMBER", "ROLE", "STATUS", "JOINED"].map((h) => (
                  <th key={h} className="font-mono text-[10px] tracking-[0.12em] px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teammatesLoading
                ? Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} cols={4} />)
                : teammates.map((t) => (
                    <TeammateRow key={t.id} teammate={t} currentUserId={currentUser?.id} />
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Invitations */}
      {(invitationsLoading || invitations.length > 0) && (
        <div>
          <h3 className="font-sans text-base font-semibold mb-3" style={{ color: "var(--text)" }}>
            Pending Invitations
          </h3>
          <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-alt)" }}>
                  {["EMAIL", "ROLE", "EXPIRES", "ACTIONS"].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invitationsLoading
                  ? Array.from({ length: 2 }).map((_, i) => <RowSkeleton key={i} cols={4} />)
                  : invitations.map((inv) => (
                      <InvitationRow
                        key={inv.id}
                        invitation={inv}
                        onRevoke={revoke}
                        onResend={resend}
                        isRevoking={isRevoking}
                        isResending={isResending}
                      />
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}