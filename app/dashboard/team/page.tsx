"use client";

import { useState } from "react";
import {
  MOCK_TEAMMATES,
  MOCK_INVITATIONS,
  MOCK_CURRENT_USER,
} from "@/lib/mockData";
import type {
  TeammateResponse,
  InvitationResponse,
  UserRole,
} from "@/lib/type";

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

function TeammateRow({ teammate }: { teammate: TeammateResponse }) {
  const rs = roleStyle(teammate.role);
  const isCurrentUser = teammate.id === MOCK_CURRENT_USER.id;

  return (
    <tr
      className="transition-colors duration-150"
      style={{ borderTop: "1px solid var(--border)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--surface-hover)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0"
            style={{
              background: rs.bg,
              color: rs.color,
              border: `1px solid ${rs.color}`,
            }}
          >
            {teammate.email[0].toUpperCase()}
          </div>
          <div>
            <p
              className="font-mono text-[12px] font-medium"
              style={{ color: "var(--text)" }}
            >
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
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full"
          style={{
            color: rs.color,
            background: rs.bg,
            border: `1px solid ${rs.color}`,
          }}
        >
          {teammate.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className="font-mono text-[9px] tracking-[0.08em] px-2 py-0.5 rounded-full"
          style={{
            color: teammate.is_verified ? "var(--green)" : "var(--amber)",
            background: teammate.is_verified
              ? "var(--green-bg)"
              : "var(--amber-bg)",
          }}
        >
          {teammate.is_verified ? "VERIFIED" : "PENDING"}
        </span>
      </td>
      <td
        className="font-mono text-[11px] px-4 py-3"
        style={{ color: "var(--text-muted)" }}
      >
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
}: {
  invitation: InvitationResponse;
  onRevoke: (id: number) => void;
  onResend: (id: number) => void;
}) {
  const rs = roleStyle(invitation.role);
  const isExpired = new Date(invitation.expires_at) < new Date();

  return (
    <tr
      className="transition-colors duration-150"
      style={{
        borderTop: "1px solid var(--border)",
        opacity: isExpired ? 0.5 : 1,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--surface-hover)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td
        className="font-mono text-[12px] px-4 py-3"
        style={{ color: "var(--text)" }}
      >
        {invitation.email}
      </td>
      <td className="px-4 py-3">
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full"
          style={{
            color: rs.color,
            background: rs.bg,
            border: `1px solid ${rs.color}`,
          }}
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
            className="font-mono text-[9px] tracking-[0.06em] px-2.5 py-1 rounded-md cursor-pointer transition-colors duration-200"
            style={{
              background: "var(--cyan-bg)",
              border: "1px solid var(--cyan)",
              color: "var(--cyan)",
            }}
          >
            RESEND
          </button>
          <button
            onClick={() => onRevoke(invitation.id)}
            className="font-mono text-[9px] tracking-[0.06em] px-2.5 py-1 rounded-md cursor-pointer transition-colors duration-200"
            style={{
              background: "var(--red-bg)",
              border: "1px solid var(--red)",
              color: "var(--red)",
            }}
          >
            REVOKE
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function TeamPage() {
  const [teammates] = useState<TeammateResponse[]>(MOCK_TEAMMATES);
  const [invitations, setInvitations] =
    useState<InvitationResponse[]>(MOCK_INVITATIONS);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MANAGER" | "MEMBER">("MEMBER");
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newInvite: InvitationResponse = {
      id: Date.now(),
      email: inviteEmail,
      role: inviteRole,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_accepted: false,
      created_at: new Date().toISOString(),
    };
    setInvitations((prev) => [newInvite, ...prev]);
    setInviteEmail("");
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
  };

  const handleRevoke = (id: number) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResend = (id: number) => {
    setInvitations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              expires_at: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            }
          : i,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2
          className="font-sans text-[20px] font-bold m-0"
          style={{ color: "var(--text)" }}
        >
          Team Management
        </h2>
        <p
          className="font-sans text-[13px] mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {teammates.length} team member{teammates.length !== 1 ? "s" : ""} in{" "}
          {MOCK_CURRENT_USER.mill_name}
        </p>
      </div>
      <div
        className="rounded-[14px] border p-5 max-w-[600px]"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <p
          className="font-mono text-[10px] tracking-[0.14em] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          INVITE TEAMMATE
        </p>
        <div className="flex gap-2 flex-wrap">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border font-mono text-[12px] outline-none transition-colors duration-200"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-alt)",
              color: "var(--text)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <select
            value={inviteRole}
            onChange={(e) =>
              setInviteRole(e.target.value as "MANAGER" | "MEMBER")
            }
            className="px-3 py-2 rounded-lg border font-mono text-[11px] outline-none cursor-pointer"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-alt)",
              color: "var(--text)",
            }}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="MANAGER">MANAGER</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={!inviteEmail}
            className="font-mono text-[11px] font-semibold tracking-[0.06em] px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: inviteSent ? "var(--green)" : "var(--cyan-bg)",
              border: `1px solid ${inviteSent ? "var(--green)" : "var(--cyan)"}`,
              color: inviteSent ? "#fff" : "var(--cyan)",
            }}
          >
            {inviteSent ? "✓ SENT" : "SEND INVITE"}
          </button>
        </div>
      </div>
      <div>
        <h3
          className="font-sans text-base font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Active Members
        </h3>
        <div
          className="overflow-x-auto rounded-[12px] border"
          style={{ borderColor: "var(--border)" }}
        >
          <table
            className="w-full text-left"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {["MEMBER", "ROLE", "STATUS", "JOINED"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teammates.map((t) => (
                <TeammateRow key={t.id} teammate={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {invitations.length > 0 && (
        <div>
          <h3
            className="font-sans text-base font-semibold mb-3"
            style={{ color: "var(--text)" }}
          >
            Pending Invitations
          </h3>
          <div
            className="overflow-x-auto rounded-[12px] border"
            style={{ borderColor: "var(--border)" }}
          >
            <table
              className="w-full text-left"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ background: "var(--bg-alt)" }}>
                  {["EMAIL", "ROLE", "EXPIRES", "ACTIONS"].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <InvitationRow
                    key={inv.id}
                    invitation={inv}
                    onRevoke={handleRevoke}
                    onResend={handleResend}
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
