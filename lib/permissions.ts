import type { UserRole } from "@/lib/type";

export const ROLE_RANK: Record<UserRole, number> = {
  member: 1,
  manager: 2,
  admin: 3,
  superadmin: 4,
};

export function normalizeRole(role: string | undefined | null): UserRole {
  const r = (role ?? "").toLowerCase();
  if (
    r === "superadmin" ||
    r === "admin" ||
    r === "manager" ||
    r === "member"
  ) {
    return r;
  }

  return "member";
}

export interface Permissions {
  role: UserRole;
  canRead: boolean;
  canWrite: boolean; 
  canManageUsers: boolean; 
}

export function getPermissions(role: string | undefined | null): Permissions {
  const normalized = normalizeRole(role);
  const rank = ROLE_RANK[normalized];
  return {
    role: normalized,
    canRead: true,
    canWrite: rank >= ROLE_RANK.manager,
    canManageUsers: rank >= ROLE_RANK.admin,
  };
}
