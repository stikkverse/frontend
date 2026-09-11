"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  UserPlus,
  Trash2,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useCurrentUser,
  useMembers,
  useCreateMember,
  useRevokeMember,
  usePendingApprovals,
  useRejectApproval,
} from "@/hooks/useTeam";
import { createMemberSchema, type CreateMemberValues } from "@/lib/schema";
import RequireManageUsers from "@/components/dashboard/RouteGuard";
import Pagination from "@/components/ui/pagination";
import type { UserListItem, PendingApprovalItem } from "@/lib/type";

const ROWS_PER_PAGE = 8;

function roleStyle(role: string): { color: string; bg: string } {
  switch (role.toLowerCase()) {
    case "superadmin":
      return { color: "var(--violet)", bg: "var(--violet-bg)" };
    case "admin":
      return { color: "var(--cyan)", bg: "var(--cyan-bg)" };
    case "manager":
      return { color: "var(--amber)", bg: "var(--amber-bg)" };
    default:
      return { color: "var(--text-muted)", bg: "var(--bg-alt)" };
  }
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CreateMemberForm() {
  const { mutate: createMember, isPending } = useCreateMember();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CreateMemberValues>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: { email: "", password: "", role: "member" },
  });

  const onSubmit = (values: CreateMemberValues) => {
    createMember(values, {
      onSuccess: () => {
        toast.success(`${values.role} account created for ${values.email}`);
        form.reset({ email: "", password: "", role: "member" });
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { detail?: string } } };
        toast.error(
          err.response?.data?.detail ?? "Could not create user. Try again.",
        );
      },
    });
  };

  return (
    <div className="rounded-[14px] border border-border bg-(--surface) shadow-(--card-shadow) p-5">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus size={15} className="text-(--cyan)" />
        <p className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
          ADD TEAM MEMBER
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <input
                {...field}
                type="email"
                placeholder="colleague@company.com"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-(--bg-alt) text-(--text) font-mono text-[12px] outline-none focus:border-(--cyan) transition-colors duration-200"
              />
              {fieldState.invalid && (
                <p className="font-mono text-[10px] text-(--red) mt-1">
                  {fieldState.error?.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="flex gap-3">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex-1">
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Initial password"
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-(--bg-alt) text-(--text) font-mono text-[12px] outline-none focus:border-(--cyan) transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--cyan) transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {fieldState.invalid && (
                  <p className="font-mono text-[10px] text-(--red) mt-1">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <select
                {...field}
                className="w-32 shrink-0 px-3 rounded-lg border border-border bg-(--bg-alt) text-(--text) font-mono text-[12px] outline-none focus:border-(--cyan) cursor-pointer"
              >
                <option value="member">MEMBER</option>
                <option value="manager">MANAGER</option>
              </select>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="font-mono text-[11px] font-semibold tracking-[0.06em] px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-(--cyan) bg-(--cyan-bg) text-(--cyan) hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "CREATING..." : "CREATE MEMBER"}
        </button>

        <p className="font-mono text-[9px] text-(--text-muted) leading-relaxed">
          Members get read-only access. Managers can upload data and resolve
          alerts. The person signs in directly at the login page with this email
          and password — no registration needed. Share the password securely;
          they can reset it later.
        </p>
      </form>
    </div>
  );
}

function MemberRow({
  member,
  onRevoke,
  isRevoking,
}: {
  member: UserListItem;
  onRevoke: (id: number) => void;
  isRevoking: boolean;
}) {
  const rs = roleStyle(member.role);
  return (
    <tr className="border-t border-border transition-colors duration-150 hover:bg-(--surface-hover)">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 border"
            style={{
              background: rs.bg,
              color: rs.color,
              borderColor: rs.color,
            }}
          >
            {member.email[0].toUpperCase()}
          </div>
          <span className="font-mono text-[12px] font-medium text-(--text)">
            {member.email}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full border"
          style={{ color: rs.color, background: rs.bg, borderColor: rs.color }}
        >
          {member.role.toUpperCase()}
        </span>
      </td>
      <td className="font-mono text-[11px] px-4 py-3 text-(--text-muted)">
        {formatDate(member.created_at)}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onRevoke(member.id)}
          disabled={isRevoking}
          className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.06em] px-2.5 py-1 rounded-md cursor-pointer transition-colors duration-200 border border-(--red) bg-(--red-bg) text-(--red) hover:opacity-80 disabled:opacity-50"
        >
          <Trash2 size={11} /> REVOKE
        </button>
      </td>
    </tr>
  );
}

function PendingRow({
  req,
  onReject,
  isRejecting,
}: {
  req: PendingApprovalItem;
  onReject: (id: number) => void;
  isRejecting: boolean;
}) {
  const rs = roleStyle(req.role);
  return (
    <tr className="border-t border-border transition-colors duration-150 hover:bg-(--surface-hover)">
      <td className="font-mono text-[12px] px-4 py-3 text-(--text)">
        {req.email}
      </td>
      <td className="px-4 py-3">
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full border"
          style={{ color: rs.color, background: rs.bg, borderColor: rs.color }}
        >
          {req.role.toUpperCase()}
        </span>
      </td>
      <td className="font-mono text-[11px] px-4 py-3 text-(--text-muted)">
        Expires {formatDate(req.expires_at)}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onReject(req.id)}
          disabled={isRejecting}
          className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.06em] px-2.5 py-1 rounded-md cursor-pointer transition-colors duration-200 border border-(--red) bg-(--red-bg) text-(--red) hover:opacity-80 disabled:opacity-50"
        >
          <Trash2 size={11} /> REJECT
        </button>
      </td>
    </tr>
  );
}

function RowSkeleton({ cols }: { cols: number }) {
  return (
    <tr className="border-t border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-24 rounded bg-(--bg-alt) animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function TeamPageInner() {
  const { data: currentUser } = useCurrentUser();
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: pending = [], isLoading: pendingLoading } =
    usePendingApprovals();
  const { mutate: revoke, isPending: isRevoking } = useRevokeMember();
  const { mutate: reject, isPending: isRejecting } = useRejectApproval();

  const [membersPage, setMembersPage] = useState(1);

  const handleRevoke = (id: number) => {
    revoke(id, {
      onSuccess: () => toast.success("Access revoked"),
      onError: (e: unknown) => {
        const err = e as { response?: { data?: { detail?: string } } };
        toast.error(err.response?.data?.detail ?? "Could not revoke access.");
      },
    });
  };

  const handleReject = (id: number) => {
    reject(id, {
      onSuccess: () => toast.success("Request rejected"),
      onError: (e: unknown) => {
        const err = e as { response?: { data?: { detail?: string } } };
        toast.error(err.response?.data?.detail ?? "Could not reject request.");
      },
    });
  };

  const membersTotalPages = Math.max(
    1,
    Math.ceil(members.length / ROWS_PER_PAGE),
  );
  const paginatedMembers = members.slice(
    (membersPage - 1) * ROWS_PER_PAGE,
    membersPage * ROWS_PER_PAGE,
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-sans text-[20px] font-bold m-0 text-(--text)">
          Team Management
        </h2>
        <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
          {membersLoading
            ? "Loading team…"
            : `${members.length} member${members.length !== 1 ? "s" : ""}${currentUser?.mill_id ? ` in mill ${currentUser.mill_id}` : ""}`}
        </p>
      </div>

      <div className="max-w-140">
        <CreateMemberForm />
      </div>

      {/* Members */}
      <div>
        <h3 className="font-sans text-base font-semibold mb-3 text-(--text)">
          Active Members
        </h3>
        <div className="overflow-x-auto rounded-[12px] border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--bg-alt)">
                {["MEMBER", "ROLE", "JOINED", ""].map((h, i) => (
                  <th
                    key={i}
                    className={`font-mono text-[10px] tracking-[0.12em] px-4 py-3 text-(--text-muted) ${i === 3 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {membersLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <RowSkeleton key={i} cols={4} />
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center font-mono text-[12px] text-(--text-muted)"
                  >
                    No members yet — add one above
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((m) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    onRevoke={handleRevoke}
                    isRevoking={isRevoking}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        {!membersLoading && members.length > ROWS_PER_PAGE && (
          <Pagination
            currentPage={membersPage}
            totalPages={membersTotalPages}
            onPageChange={setMembersPage}
            className="mt-3"
          />
        )}
      </div>

      {/* Pending access requests */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-(--amber)" />
          <h3 className="font-sans text-base font-semibold text-(--text)">
            Pending Access Requests
          </h3>
        </div>
        <div className="rounded-lg border border-border bg-(--bg-alt) px-4 py-3 mb-3 flex items-start gap-2">
          <ShieldCheck size={13} className="text-(--cyan) shrink-0 mt-0.5" />
          <p className="font-sans text-[11px] text-(--text-secondary) leading-relaxed">
            These people requested access to your mill. To{" "}
            <strong>approve</strong>, click the link in the approval email sent
            to you. To <strong>decline</strong>, reject here.
          </p>
        </div>
        <div className="overflow-x-auto rounded-[12px] border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--bg-alt)">
                {["EMAIL", "REQUESTED ROLE", "EXPIRES", ""].map((h, i) => (
                  <th
                    key={i}
                    className={`font-mono text-[10px] tracking-[0.12em] px-4 py-3 text-(--text-muted) ${i === 3 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <RowSkeleton key={i} cols={4} />
                ))
              ) : pending.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center font-mono text-[12px] text-(--text-muted)"
                  >
                    No pending requests
                  </td>
                </tr>
              ) : (
                pending.map((req) => (
                  <PendingRow
                    key={req.id}
                    req={req}
                    onReject={handleReject}
                    isRejecting={isRejecting}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <RequireManageUsers>
      <TeamPageInner />
    </RequireManageUsers>
  );
}
