export const queryKeys = {
  //  Dashboard
  dashboard: {
    summary: (date?: string) => ["dashboard", "summary", date ?? "today"] as const,
    machines: () => ["dashboard", "machines"] as const,
    machineSpecs: () => ["dashboard", "machine-specs"] as const,
    machineTrends: (machineId: string, range: string) =>
      ["dashboard", "trends", machineId, range] as const,
  },

  // Alerts 
  alerts: {
    all: () => ["alerts"] as const,
  },

  // Data / Uploads 
  uploads: {
    history: () => ["data", "history"] as const,
    task: (taskId: string) => ["data", "task", taskId] as const,
    baselines: () => ["data", "baselines"] as const,
    baselineHistory: () => ["data", "baseline-history"] as const,
    machineBaselineHistory: (machineId: string) =>
      ["data", "baseline-history", machineId] as const,
    millSummary: (millId: string, startDate?: string, endDate?: string, machineId?: string) =>
      ["data", "mill-summary", millId, startDate, endDate, machineId] as const,
  },

  // Auth / Team 
  team: {
    currentUser: () => ["auth", "me"] as const,
    teammates: () => ["auth", "teammates"] as const,
    invitations: () => ["auth", "invitations"] as const,
  },

  // Admin
  admin: {
    users: () => ["admin", "users"] as const,
    mills: () => ["admin", "mills"] as const,
    uploads: () => ["admin", "uploads"] as const,
  },
};