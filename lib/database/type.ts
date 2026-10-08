// Auth
export type UserRole = "superadmin" | "admin" | "manager" | "member";

export interface VerifyEmailRequest {
  token: string;
}

export type SignupIntent = "create" | "join";

export interface UserRegister {
  email: string;
  password: string;
  mill_id: string;
  role?: UserRole | null;
  intent: SignupIntent;
}

export type RegisterOutcome = "account_created" | "approval_queued";

export interface RegisterResponse {
  status: string;
  api_key: string | null;
  message: string;
  outcome: RegisterOutcome | null;
}

export interface MillAvailableResponse {
  mill_id: string;
  available: boolean;
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

export interface MillInfo {
  mill_id: string;
  api_key: string;
  has_baseline: boolean;
}

// GET /api/v1/auth/me → UserProfile
export interface CurrentUser {
  id: number;
  email: string;
  role: string;
  created_at: string;
  mills: MillInfo[];
  // convenience — derived from mills[0]
  mill_id?: string;
  mill_name?: string;
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

// Dashboard
export type BearingRisk = "HIGH" | "WARNING" | "NORMAL";
export type MachineStatus = "RUNNING" | "IDLE";

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

// MachineSummaryResponse — from GET /api/v1/dashboard/machines
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

// MachineTrendResponse — from GET /api/v1/dashboard/machines/{id}/trends
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

export type MachineTrends = MachineTrendPoint[];

// Alerts
export type AlertStatus = "active" | "acknowledged" | "resolved";

// AlertItem — actual schema from spec
export interface Alert {
  id: number;
  machine_id: string | null;
  type: AlertType;
  message: string;
  timestamp: string | null;
  status: AlertStatus;
  acknowledged_at: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
  resolution_category: string | null;
}

// Updated enum values to match spec exactly
export type ResolutionCategory =
  | "hardware_fixed"
  | "software_fix"
  | "false_alarm"
  | "maintenance"
  | "other";

export interface AlertResolvePayload {
  resolution_note?: string | null;
  resolution_category?: ResolutionCategory | null;
}

// Data / Uploads
export type ProcessingStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

// UploadHistoryItem — from GET /api/v1/data/history
export interface UploadHistoryItem {
  mill_id: string;
  filename: string;
  timestamp: string; // field name is timestamp, not uploaded_at
  status: string;
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
// GET /api/v1/mill/{mill_id}/summary → MillSummaryResponse
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

// MachineAnalytics
export interface MillMachine {
  machine_id: string;
  name: string;
  total_co2_kg: number;
  total_energy_kwh: number;
  run_hours: number;
  avg_current_A: number;
  reference_metrics: ReferenceMetrics;
  health_score: number;
  health_score_breakdown: Record<string, unknown>;
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

// Admin
export interface UserCreate {
  email: string;
  password: string;
  role?: "admin" | "manager" | "member";
}

export interface UserListItem {
  id: number;
  email: string;
  role: string;
  mill_count: number;
  created_at: string;
}

export interface CreateUserResponse {
  status: string;
  user_id: number;
}

export interface PendingApprovalItem {
  id: number;
  mill_id: string;
  email: string;
  role: string;
  created_at: string;
  expires_at: string;
}

export interface StatusMessage {
  status: string;
  message: string;
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

// ═══════════════════════════════════════════
// Superadmin — matches PlatformHealthResponse, MillActivityItem, AlertOverviewItem
// ═══════════════════════════════════════════

export interface SystemMetrics {
  uptime_seconds: number;
  started_at: string;
  api_avg_latency_ms: number;
  api_p95_latency_ms: number;
  api_total_requests: number;
  api_error_rate_pct: number;
}

export interface PlatformMetrics {
  total_users: number;
  total_mills: number;
  mills_with_baseline: number;
  total_machines: number;
  active_mills_48h: number;
  inactive_mills_48h: number;
}

export interface MachineHealthDistribution {
  healthy: number;
  warning: number;
  critical: number;
}

export interface AlertsSummary {
  total_open: number;
  by_type: Record<string, number>;
}

export interface ProcessingTasksSummary {
  pending: number;
  completed_24h: number;
  failed_24h: number;
  stuck: number;
}

export interface DatabaseStatus {
  status: string;
  latency_ms: number;
}

export interface SentryStatus {
  status: string;
}

export interface IotGatewayStatus {
  status: string;
  data_points_last_hour: number;
}

export interface ServiceStatuses {
  database: DatabaseStatus;
  sentry: SentryStatus;
  iot_gateway: IotGatewayStatus;
}

export interface PlatformHealthResponse {
  health_score: number;
  health_level: string;
  computed_at: string;
  system: SystemMetrics;
  platform: PlatformMetrics;
  machine_health_distribution: MachineHealthDistribution;
  alerts: AlertsSummary;
  processing_tasks: ProcessingTasksSummary;
  services: ServiceStatuses;
}

export interface AlertOverviewItem {
  id: number;
  mill_id?: string | null;
  machine_id?: string | null;
  type: string;
  message: string;
  timestamp: string;
  owner_email: string;
}

// Returned by GET /superadmin/alerts/overview?group_by=mill
export interface MillAlertsOverviewItem {
  mill_id?: string | null;
  owner_email: string;
  open_alerts: number;
  alerts: AlertOverviewItem[];
}

export interface UserProfile {
  id: number;
  email: string;
  role: string;
  created_at: string;
  mills: MillInfo[];
}

export interface MachineActivityItem {
  machine_id: string;
  health_score: number;
  bearing_risk: string;
  total_co2_kg: number;
  excess_co2_kg: number;
  total_energy_kwh: number;
  run_hours: number;
  last_data_date: string;
  open_alerts: number;
}

export interface MillActivityItem {
  mill_id: string;
  owner_email: string;
  has_baseline: boolean;
  machine_count: number;
  last_data_date?: string | null;
  days_since_last_data?: number | null;
  avg_health_score_7d?: number | null;
  open_alerts: number;
  status: string;
  machines: MachineActivityItem[];
}

// ===========Alert============

export type AlertType = "DATA_GAP" | "WARNING" | "CO2_INCREASE";

export interface AlertActionResponse {
  status: string;
  alert: Alert;
}
