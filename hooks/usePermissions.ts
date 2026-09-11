"use client";

import { useAuth } from "@/lib/authContext";
import { getPermissions, type Permissions } from "@/lib/permissions";

export function usePermissions(): Permissions {
  const { user } = useAuth();
  return getPermissions(user?.role);
}
