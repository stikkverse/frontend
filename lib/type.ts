export type UserRole = "admin" | "manager";

export interface UserRegister {
  email: string;
  password: string;
  full_name: string;
  mill_name: string;
  mill_tag: string;
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
  full_name: string;
  role: UserRole;
  mill_id: string;
  mill_name: string;
  is_verified: boolean;
  created_at: string;
}

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

// Dashboard
export type BearingRisk = "HIGH" | "WARNING" | "NORMAL";
export type MachineStatus = "RUNNING" | "IDLE";

export interface DashboardSummary {
  mill_id: string;
  mill_name: string;
  date: string;
  total_excess_co2_kg: number;
  avoidable_cost_usd: number;
  machines_total: number;
  machines_running: number;
  machines_idle: number;
  last_updated: string;
}

export interface DashboardMachine {
  machine_id: string;
  health_score: number;
  bearing_risk: BearingRisk;
  excess_co2_today_kg: number;
  status: MachineStatus;
  last_reading_at: string;
}

export interface MachineSpec {
  machine_id: string;
  machine_type: string;
  rated_power_kw: number;
  energy_source_type: string;
}

export interface MachineTrendPoint {
  date: string;
  health_score: number;
  excess_co2_kg: number;
  bearing_risk: BearingRisk;
}

export interface MachineTrends {
  machine_id: string;
  range: string;
  data_points: MachineTrendPoint[];
}

// Alerts
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

// Data / Uploads
export type ProcessingStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

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

// Mill Summary
export interface MillSummaryParams {
  millId: string;
  startDate?: string;
  endDate?: string;
  machineId?: string;
}

export interface ReferenceMetrics {
  baseline_mean: number;
  baseline_std: number;
  baseline_p95: number;
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

// MillSummary
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

// Admin
export interface UserCreate {
  email: string;
  password: string;
  role: UserRole;
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
// UI navigation
export interface TabItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}
