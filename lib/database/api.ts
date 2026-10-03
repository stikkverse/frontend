import axiosInstance from "./axiosInstance";
import type {
  Alert,
  AlertResolvePayload,
  Baseline,
  BaselineUpdate,
  CurrentUser,
  DashboardMachine,
  DashboardSummary,
  MachineSpec,
  MachineTrends,
  MillCreate,
  MillInfo,
  MillSummaryParams,
  StatsUpdate,
  TaskResponse,
  UserListItem,
  CreateUserResponse,
  PendingApprovalItem,
  StatusMessage,
  UploadHistoryItem,
  UploadResponse,
  UserCreate,
  UserRegister,
  RegisterResponse,
  MillAvailableResponse,
} from "./type";

// Auth — public endpoints (no api-key / no bearer required)
export const authApi = {
  /** POST /api/v1/auth/register */
  register: async (payload: UserRegister): Promise<RegisterResponse> => {
    const { data } = await axiosInstance.post<RegisterResponse>(
      "/api/v1/auth/register",
      payload,
    );
    return data;
  },

  /** GET /api/v1/auth/mill-available?mill_id=X */
  checkMillAvailable: async (
    millId: string,
  ): Promise<MillAvailableResponse> => {
    const { data } = await axiosInstance.get<MillAvailableResponse>(
      "/api/v1/auth/mill-available",
      {
        params: { mill_id: millId },
      },
    );
    return data;
  },

  /** POST /api/v1/auth/verify-email */
  verifyEmail: async (
    token: string,
  ): Promise<{ status: string; message: string }> => {
    const { data } = await axiosInstance.post("/api/v1/auth/verify-email", {
      token,
    });
    return data;
  },

  /** POST /api/v1/auth/approve-mill-access */
  approveMillAccess: async (
    token: string,
  ): Promise<{ status: string; message: string }> => {
    const { data } = await axiosInstance.post(
      "/api/v1/auth/approve-mill-access",
      { token },
    );
    return data;
  },

  /** POST /api/v1/auth/forgot-password */
  forgotPassword: async (
    email: string,
  ): Promise<{ status: string; message: string }> => {
    const { data } = await axiosInstance.post("/api/v1/auth/forgot-password", {
      email,
    });
    return data;
  },

  /** POST /api/v1/auth/reset-password */
  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<{ status: string; message: string }> => {
    const { data } = await axiosInstance.post("/api/v1/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return data;
  },

  /** POST /api/v1/auth/magic-link */
  requestMagicLink: async (
    email: string,
  ): Promise<{ status: string; message: string }> => {
    const { data } = await axiosInstance.post("/api/v1/auth/magic-link", {
      email,
    });
    return data;
  },

  /** POST /api/v1/auth/magic-login → returns Token */
  magicLogin: async (
    token: string,
  ): Promise<{
    access_token: string;
    api_key: string | null;
    mill_id: string | null;
  }> => {
    const { data } = await axiosInstance.post("/api/v1/auth/magic-login", {
      token,
    });
    return data;
  },
};

export const dashboardApi = {
  /** GET /api/v1/dashboard/summary?date={date} */
  getSummary: async (date?: string): Promise<DashboardSummary> => {
    const { data } = await axiosInstance.get<DashboardSummary>(
      "/api/v1/dashboard/summary",
      { params: date ? { date } : undefined },
    );
    return data;
  },

  /** GET /api/v1/dashboard/machines */
  getMachines: async (): Promise<DashboardMachine[]> => {
    const { data } = await axiosInstance.get<DashboardMachine[]>(
      "/api/v1/dashboard/machines",
    );
    return data;
  },

  /** GET /api/v1/dashboard/machine-specs */
  getMachineSpecs: async (): Promise<MachineSpec[]> => {
    const { data } = await axiosInstance.get<MachineSpec[]>(
      "/api/v1/dashboard/machine-specs",
    );
    return data;
  },

  /** GET /api/v1/dashboard/machines/{machine_id}/trends?range={range}*/
  getMachineTrends: async (
    machineId: string,
    range: string = "7d",
  ): Promise<MachineTrends> => {
    const { data } = await axiosInstance.get<MachineTrends>(
      `/api/v1/dashboard/machines/${machineId}/trends`,
      { params: { range } },
    );
    return data;
  },
};

// Alerts   — x-api-key secured
export const alertsApi = {
  /** GET /api/v1/alerts/ — active + acknowledged alerts only */
  getAlerts: async (): Promise<Alert[]> => {
    const { data } = await axiosInstance.get<Alert[]>("/api/v1/alerts/");
    return data;
  },

  /** GET /api/v1/alerts/history — resolved alerts only */
  getAlertHistory: async (params?: {
    machine_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<Alert[]> => {
    const { data } = await axiosInstance.get<Alert[]>(
      "/api/v1/alerts/history",
      {
        params,
      },
    );
    return data;
  },

  /** PATCH /api/v1/alerts/{alert_id}/acknowledge */
  acknowledgeAlert: async (alertId: number): Promise<void> => {
    await axiosInstance.patch(`/api/v1/alerts/${alertId}/acknowledge`);
  },

  /** PATCH /api/v1/alerts/{alert_id}/resolve*/
  resolveAlert: async (
    alertId: number,
    payload: AlertResolvePayload,
  ): Promise<void> => {
    await axiosInstance.patch(`/api/v1/alerts/${alertId}/resolve`, payload);
  },
};

export const uploadsApi = {
  /** GET /api/v1/data/history */
  getHistory: async (): Promise<UploadHistoryItem[]> => {
    const { data } = await axiosInstance.get<UploadHistoryItem[]>(
      "/api/v1/data/history",
    );
    return data;
  },

  /** POST /api/v1/upload */
  uploadOperational: async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadResponse> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await axiosInstance.post<UploadResponse>(
      "/api/v1/upload",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      },
    );
    return data;
  },

  /** POST /api/v1/baseline/upload */
  uploadBaselineInitial: async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadResponse> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await axiosInstance.post<UploadResponse>(
      "/api/v1/baseline/upload",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      },
    );
    return data;
  },

  /** POST /api/v1/baseline/update */
  uploadBaselineUpdate: async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadResponse> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await axiosInstance.post<UploadResponse>(
      "/api/v1/baseline/update",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      },
    );
    return data;
  },

  /** GET /api/v1/task/{task_id} */
  getTaskStatus: async (taskId: string): Promise<TaskResponse> => {
    const { data } = await axiosInstance.get<TaskResponse>(
      `/api/v1/task/${taskId}`,
    );
    return data;
  },

  /** GET /api/v1/baseline */
  getBaselines: async (): Promise<Baseline[]> => {
    const { data } = await axiosInstance.get<Baseline[]>("/api/v1/baseline");
    return data;
  },

  /** DELETE /api/v1/baseline */
  deleteAllBaselines: async (): Promise<void> => {
    await axiosInstance.delete("/api/v1/baseline");
  },

  /** GET /api/v1/baseline/history */
  getBaselineHistory: async (): Promise<unknown[]> => {
    const { data } = await axiosInstance.get<unknown[]>(
      "/api/v1/baseline/history",
    );
    return data;
  },

  /** GET /api/v1/baseline/{machine_id}/history */
  getMachineBaselineHistory: async (machineId: string): Promise<unknown[]> => {
    const { data } = await axiosInstance.get<unknown[]>(
      `/api/v1/baseline/${machineId}/history`,
    );
    return data;
  },

  /** PUT /api/v1/baseline/{machine_id} */
  updateBaselineManual: async (
    machineId: string,
    payload: BaselineUpdate,
  ): Promise<void> => {
    await axiosInstance.put(`/api/v1/baseline/${machineId}`, payload);
  },

  /** DELETE /api/v1/baseline/{machine_id} */
  deleteBaseline: async (machineId: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/baseline/${machineId}`);
  },

  /** DELETE /api/v1/operational — delete ALL mill operational data */
  deleteAllOperational: async (): Promise<void> => {
    await axiosInstance.delete("/api/v1/operational");
  },

  /** GET /api/v1/mill/{mill_id}/summary */
  getMillInfo: async ({
    millId,
    startDate,
    endDate,
    machineId,
  }: MillSummaryParams): Promise<MillInfo> => {
    const { data } = await axiosInstance.get<MillInfo>(
      `/api/v1/mill/${millId}/summary`,
      {
        params: {
          ...(startDate && { start_date: startDate }),
          ...(endDate && { end_date: endDate }),
          ...(machineId && { machine_id: machineId }),
        },
      },
    );
    return data;
  },
};

// Auth / Team
export const teamApi = {
  /** GET /api/v1/auth/me → UserProfile */
  getCurrentUser: async (): Promise<CurrentUser> => {
    const { data } = await axiosInstance.get<CurrentUser>("/api/v1/auth/me");
    return data;
  },

  /** GET /api/v1/admin/users → users this admin created */
  getMembers: async (): Promise<UserListItem[]> => {
    const { data } = await axiosInstance.get<UserListItem[]>(
      "/api/v1/admin/users",
    );
    return data;
  },

  /** POST /api/v1/admin/users */
  createMember: async (payload: UserCreate): Promise<CreateUserResponse> => {
    const { data } = await axiosInstance.post<CreateUserResponse>(
      "/api/v1/admin/users",
      payload,
    );
    return data;
  },

  /** DELETE /api/v1/admin/users/{user_id} — revoke access */
  revokeMember: async (userId: number): Promise<StatusMessage> => {
    const { data } = await axiosInstance.delete<StatusMessage>(
      `/api/v1/admin/users/${userId}`,
    );
    return data;
  },

  /** GET /api/v1/admin/pending-approvals */
  getPendingApprovals: async (): Promise<PendingApprovalItem[]> => {
    const { data } = await axiosInstance.get<PendingApprovalItem[]>(
      "/api/v1/admin/pending-approvals",
    );
    return data;
  },

  /** DELETE /api/v1/admin/pending-approvals/{request_id} — reject */
  rejectApproval: async (requestId: number): Promise<StatusMessage> => {
    const { data } = await axiosInstance.delete<StatusMessage>(
      `/api/v1/admin/pending-approvals/${requestId}`,
    );
    return data;
  },
};

// Admin
export const adminApi = {
  listMills: async (): Promise<unknown[]> => {
    const { data } = await axiosInstance.get<unknown[]>("/api/v1/admin/mills");
    return data;
  },
  createMill: async (payload: MillCreate): Promise<void> => {
    await axiosInstance.post("/api/v1/admin/mills", payload);
  },
  getGlobalUploadHistory: async (): Promise<unknown[]> => {
    const { data } = await axiosInstance.get<unknown[]>(
      "/api/v1/admin/uploads",
    );
    return data;
  },
  correctMachineStats: async (
    statsId: number,
    payload: StatsUpdate,
  ): Promise<void> => {
    await axiosInstance.put(`/api/v1/admin/stats/${statsId}`, payload);
  },
};
