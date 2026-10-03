"use client";

import { useAuth } from "@/lib/auth/authContext";
import { getPermissions, type Permissions } from "@/lib/database/permissions";

export function usePermissions(): Permissions {
  const { user } = useAuth();
  return getPermissions(user?.role);
}
