// ═══════════════════════════════════════════
// Auth — unchanged
// ═══════════════════════════════════════════
export type UserRole = "superadmin" | "admin" | "manager";

export interface UserRegister {
  email: string;
  password: string;
  mill_id: string;
  role?: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  api_key: string | null;
  mill_id: string | null;
}

export interface CurrentUser {
  id: number;
  email: string;
  full_name?: string;
  role: UserRole;
  mill_id: string;
  mill_name?: string;
  is_verified?: boolean;
  created_at?: string;
}

// Teammate & Invitation — kept for auth flows
export interface TeammateResponse {
  id: number;
  email: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
}

export interface TeammateInvite {
  email: string;
  role: UserRole;
}

export interface TeammateUpdate {
  role: UserRole;
}

export interface InvitationResponse {
  id: number;
  email: string;
  role: UserRole;
  expires_at: string;
  is_accepted: boolean;
  created_at: string;
}


// ═══════════════════════════════════════════
// Dashboard
// GET /api/v1/dashboard/summary → DashboardSummaryResponse
// GET /api/v1/dashboard/machines → MachineSummaryResponse[]
// ═══════════════════════════════════════════
export type BearingRisk = "HIGH" | "WARNING" | "NORMAL";
export type MachineStatus = "RUNNING" | "IDLE";

// Updated to match DashboardSummaryResponse schema exactly
export interface DashboardSummary {
  total_energy_kwh: number;
  total_co2_kg: number;
  machine_count: number;
  active_alerts_count: number;
  date: string | null;
}

export interface AvailabilityMetrics {
  data_coverage_hours: number | null;
  data_availability_pct: number | null;
  gap_count: number | null;
  max_gap_minutes: number | null;
  avg_sampling_interval_minutes: number | null;
}

export interface ReferenceMetrics {
  baseline_mean: number;
  baseline_std: number;
  baseline_p95: number;
}

// Updated to match MachineSummaryResponse schema exactly
export interface DashboardMachine {
  machine_id: string;
  energy_consumption: number;
  carbon_emissions: number;
  avg_current: number;
  run_hours: number;
  reference_metrics: ReferenceMetrics;
  health_score: number;
  health_score_breakdown: Record<string, unknown>;
  status: string;
  availability: AvailabilityMetrics;
}

export interface MachineSpec {
  [machine_id: string]: {
    name: string;
  };
}

// Updated to match MachineTrendResponse schema exactly
export interface MachineTrendPoint {
  date: string;
  energy_kwh: number;
  carbon_kg: number;
  avg_current: number;
  run_hours: number;
  health_score: number;
  data_coverage_hours: number | null;
  data_availability_pct: number | null;
  gap_count: number | null;
  max_gap_minutes: number | null;
  rolling_7d_current: number | null;
  rolling_30d_current: number | null;
}

// Trends endpoint now returns an array directly, not a wrapper object
export type MachineTrends = MachineTrendPoint[];

// ═══════════════════════════════════════════
// Alerts
// GET /api/v1/alerts/         — active + acknowledged only
// GET /api/v1/alerts/history  — resolved only
// PATCH /api/v1/alerts/{id}/acknowledge
// PATCH /api/v1/alerts/{id}/resolve
// ═══════════════════════════════════════════
export type AlertSeverity = "HIGH" | "WARNING" | "INFO";

export interface Alert {
  id: number;
  machine_id: string;
  alert_type: string;
  severity: AlertSeverity;
  message: string;
  created_at: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
}

// Updated enum values to match spec exactly
export type ResolutionCategory =
  | "hardware_fixed"
  | "software_fix"        // was software_fixed
  | "false_alarm"
  | "maintenance"          // was maintenance_scheduled
  | "other";

export interface AlertResolvePayload {
  resolution_note?: string | null;
  resolution_category?: ResolutionCategory | null;
}

export type AlertStatus = "active" | "acknowledged" | "resolved";

// ═══════════════════════════════════════════
// Data / Uploads
// ═══════════════════════════════════════════
export type ProcessingStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface UploadHistoryItem {
  id: number;
  filename: string;
  uploaded_at: string;
  records_processed: number;
  total_records: number;
  status: ProcessingStatus;
  uploaded_by: string;
}

export interface UploadResponse {
  task_id: string;
  message: string;
  estimated_initial_seconds: number;
}

export interface TaskResponse {
  task_id: string;
  status: ProcessingStatus;
  progress: number;
  message: string | null;
  estimated_seconds_remaining: number | null;
  records_processed: number;
  total_records: number;
}

export interface Baseline {
  machine_id: string;
  mean_current: number;
  std_current: number;
  p95_current: number;
  updated_at: string;
}

export interface BaselineUpdate {
  mean_current: number;
  std_current: number;
  p95_current: number;
}

// ═══════════════════════════════════════════
// Mill Summary
// GET /api/v1/mill/{mill_id}/summary
// ═══════════════════════════════════════════
export interface MillSummaryParams {
  millId: string;
  startDate?: string;
  endDate?: string;
  machineId?: string;
}

export interface HealthScoreBreakdown {
  load_penalty: number;
  peak_penalty: number;
  drift_penalty: number;
  category: string;
}

export interface MillMachine {
  machine_id: string;
  name: string;
  total_co2_kg: number;
  total_energy_kwh: number;
  run_hours: number;
  avg_current_A: number;
  reference_metrics: ReferenceMetrics;
  health_score: number;
  health_score_breakdown: HealthScoreBreakdown;
  bearing_risk: BearingRisk;
  excess_co2_kg: number;
  insights: string[];
}

export interface SummaryMetrics {
  total_energy_kwh: number;
  total_co2_kg: number;
  total_excess_co2_kg: number;
  avoidable_cost_usd: number;
}

export interface MillSummaryDetail {
  mill_id: string;
  db_connected: boolean;
  last_updated: string;
  summary_metrics: SummaryMetrics;
  machines: MillMachine[];
}

export interface MillSummary {
  mill_id: string;
  start_date: string;
  end_date: string;
  total_excess_co2_kg: number;
  avoidable_cost_usd: number;
  machines: {
    machine_id: string;
    total_excess_co2_kg: number;
    avg_health_score: number;
    readings_count: number;
  }[];
}

// ═══════════════════════════════════════════
// Admin
// ═══════════════════════════════════════════
export interface UserCreate {
  email: string;
  password: string;
  role?: UserRole;
}

export interface MillCreate {
  mill_id: string;
  user_id?: number | null;
  email?: string | null;
}

export interface StatsUpdate {
  health_score: number;
  bearing_risk: string;
  message: string;
}

// ═══════════════════════════════════════════
// UI navigation
// ═══════════════════════════════════════════
export interface TabItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}