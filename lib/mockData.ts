import type {
  DashboardSummary,
  DashboardMachine,
  MachineSpec,
  MachineTrends,
  Alert,
  UploadHistoryItem,
  Baseline,
  CurrentUser,
  TeammateResponse,
  InvitationResponse,
} from "@/lib/type";

// ═══════════════════════════════════════════
// GET /api/v1/auth/me
// ═══════════════════════════════════════════
export const MOCK_CURRENT_USER: CurrentUser = {
  id: 1,
  email: "mgr@millb.com",
  full_name: "Amara Okonkwo",
  role: "OWNER",
  mill_id: "B",
  mill_name: "Sapele Processing Mill",
  is_verified: true,
  created_at: "2026-01-15T10:00:00Z",
};

// ═══════════════════════════════════════════
// GET /api/v1/dashboard/summary
// ═══════════════════════════════════════════
export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  mill_id: "B",
  mill_name: "Sapele Processing Mill",
  date: "2026-02-11",
  total_excess_co2_kg: 76.26,
  avoidable_cost_usd: 47.66,
  machines_total: 6,
  machines_running: 5,
  machines_idle: 1,
  last_updated: "2026-02-11T08:00:00Z",
};

// ═══════════════════════════════════════════
// GET /api/v1/dashboard/machines
// ═══════════════════════════════════════════
export const MOCK_DASHBOARD_MACHINES: DashboardMachine[] = [
  { machine_id: "1BK1", health_score: 82.5, bearing_risk: "NORMAL",  excess_co2_today_kg: 9.86,  status: "RUNNING", last_reading_at: "2026-02-11T07:58:00Z" },
  { machine_id: "AC1",  health_score: 64.2, bearing_risk: "HIGH",    excess_co2_today_kg: 22.3,  status: "RUNNING", last_reading_at: "2026-02-11T07:59:00Z" },
  { machine_id: "PMP3", health_score: 91.0, bearing_risk: "NORMAL",  excess_co2_today_kg: 0.0,   status: "IDLE",    last_reading_at: "2026-02-10T18:00:00Z" },
  { machine_id: "CMP2", health_score: 73.8, bearing_risk: "WARNING", excess_co2_today_kg: 14.2,  status: "RUNNING", last_reading_at: "2026-02-11T07:57:00Z" },
  { machine_id: "DRL5", health_score: 55.3, bearing_risk: "HIGH",    excess_co2_today_kg: 28.7,  status: "RUNNING", last_reading_at: "2026-02-11T07:55:00Z" },
  { machine_id: "FAN4", health_score: 96.1, bearing_risk: "NORMAL",  excess_co2_today_kg: 1.2,   status: "RUNNING", last_reading_at: "2026-02-11T07:59:00Z" },
];

// ═══════════════════════════════════════════
// GET /api/v1/dashboard/machine-specs
// ═══════════════════════════════════════════
export const MOCK_MACHINE_SPECS: MachineSpec[] = [
  { machine_id: "1BK1", machine_type: "Ball Mill",    rated_power_kw: 250, energy_source_type: "electric" },
  { machine_id: "AC1",  machine_type: "Air Compressor", rated_power_kw: 75,  energy_source_type: "electric" },
  { machine_id: "PMP3", machine_type: "Coolant Pump",   rated_power_kw: 15,  energy_source_type: "electric" },
  { machine_id: "CMP2", machine_type: "Compressor",     rated_power_kw: 110, energy_source_type: "electric" },
  { machine_id: "DRL5", machine_type: "Drill Press",    rated_power_kw: 45,  energy_source_type: "electric" },
  { machine_id: "FAN4", machine_type: "Exhaust Fan",    rated_power_kw: 30,  energy_source_type: "electric" },
];

// ═══════════════════════════════════════════
// GET /api/v1/dashboard/machines/{id}/trends
// ═══════════════════════════════════════════
export const MOCK_MACHINE_TRENDS: Record<string, MachineTrends> = {
  "AC1": {
    machine_id: "AC1",
    range: "7d",
    data_points: [
      { date: "2026-02-05", health_score: 71.4, excess_co2_kg: 18.2, bearing_risk: "WARNING" },
      { date: "2026-02-06", health_score: 69.8, excess_co2_kg: 19.5, bearing_risk: "WARNING" },
      { date: "2026-02-07", health_score: 68.1, excess_co2_kg: 20.1, bearing_risk: "WARNING" },
      { date: "2026-02-08", health_score: 66.5, excess_co2_kg: 21.0, bearing_risk: "HIGH" },
      { date: "2026-02-09", health_score: 65.9, excess_co2_kg: 21.7, bearing_risk: "HIGH" },
      { date: "2026-02-10", health_score: 64.8, excess_co2_kg: 22.0, bearing_risk: "HIGH" },
      { date: "2026-02-11", health_score: 64.2, excess_co2_kg: 22.3, bearing_risk: "HIGH" },
    ],
  },
  "DRL5": {
    machine_id: "DRL5",
    range: "7d",
    data_points: [
      { date: "2026-02-05", health_score: 62.1, excess_co2_kg: 24.3, bearing_risk: "WARNING" },
      { date: "2026-02-06", health_score: 60.4, excess_co2_kg: 25.1, bearing_risk: "HIGH" },
      { date: "2026-02-07", health_score: 59.2, excess_co2_kg: 26.0, bearing_risk: "HIGH" },
      { date: "2026-02-08", health_score: 57.8, excess_co2_kg: 27.2, bearing_risk: "HIGH" },
      { date: "2026-02-09", health_score: 56.5, excess_co2_kg: 27.9, bearing_risk: "HIGH" },
      { date: "2026-02-10", health_score: 55.9, excess_co2_kg: 28.3, bearing_risk: "HIGH" },
      { date: "2026-02-11", health_score: 55.3, excess_co2_kg: 28.7, bearing_risk: "HIGH" },
    ],
  },
};

// ═══════════════════════════════════════════
// GET /api/v1/alerts/
// ═══════════════════════════════════════════
export const MOCK_ALERTS: Alert[] = [
  {
    id: 1,
    machine_id: "AC1",
    alert_type: "BEARING_RISK",
    severity: "HIGH",
    message: "Bearing vibration exceeds threshold — risk trending upward over 4 days",
    created_at: "2026-02-11T06:30:00Z",
    acknowledged: false,
    acknowledged_at: null,
    acknowledged_by: null,
  },
  {
    id: 2,
    machine_id: "DRL5",
    alert_type: "BEARING_RISK",
    severity: "HIGH",
    message: "Bearing risk elevated — health score dropped below 60",
    created_at: "2026-02-10T14:15:00Z",
    acknowledged: false,
    acknowledged_at: null,
    acknowledged_by: null,
  },
  {
    id: 3,
    machine_id: "CMP2",
    alert_type: "EXCESS_CO2",
    severity: "WARNING",
    message: "Excess CO₂ output above 10 kg for 3 consecutive days",
    created_at: "2026-02-10T09:00:00Z",
    acknowledged: true,
    acknowledged_at: "2026-02-10T10:30:00Z",
    acknowledged_by: "mgr@millb.com",
  },
  {
    id: 4,
    machine_id: "AC1",
    alert_type: "HEALTH_SCORE",
    severity: "WARNING",
    message: "Health score declined 7 points in the last 7 days",
    created_at: "2026-02-09T12:00:00Z",
    acknowledged: true,
    acknowledged_at: "2026-02-09T14:00:00Z",
    acknowledged_by: "mgr@millb.com",
  },
];

// ═══════════════════════════════════════════
// GET /api/v1/data/history
// ═══════════════════════════════════════════
export const MOCK_UPLOAD_HISTORY: UploadHistoryItem[] = [
  { id: 7, filename: "operational_feb11.csv", uploaded_at: "2026-02-11T07:00:00Z", records_processed: 1440, total_records: 1440, status: "COMPLETED",   uploaded_by: "operator@millb.com" },
  { id: 6, filename: "operational_feb10.csv", uploaded_at: "2026-02-10T07:05:00Z", records_processed: 1440, total_records: 1440, status: "COMPLETED",   uploaded_by: "operator@millb.com" },
  { id: 5, filename: "operational_feb09.csv", uploaded_at: "2026-02-09T07:02:00Z", records_processed: 1440, total_records: 1440, status: "COMPLETED",   uploaded_by: "operator@millb.com" },
  { id: 4, filename: "operational_feb08.csv", uploaded_at: "2026-02-08T07:10:00Z", records_processed: 1440, total_records: 1440, status: "COMPLETED",   uploaded_by: "operator@millb.com" },
  { id: 3, filename: "operational_feb07.csv", uploaded_at: "2026-02-07T07:00:00Z", records_processed: 1438, total_records: 1440, status: "COMPLETED",   uploaded_by: "operator@millb.com" },
  { id: 2, filename: "operational_feb06.csv", uploaded_at: "2026-02-06T07:15:00Z", records_processed: 1440, total_records: 1440, status: "COMPLETED",   uploaded_by: "operator@millb.com" },
  { id: 1, filename: "operational_feb05.csv", uploaded_at: "2026-02-05T07:00:00Z", records_processed: 1440, total_records: 1440, status: "COMPLETED",   uploaded_by: "operator@millb.com" },
];

// ═══════════════════════════════════════════
// GET /api/v1/baseline
// ═══════════════════════════════════════════
export const MOCK_BASELINES: Baseline[] = [
  { machine_id: "1BK1", mean_current: 185.4, std_current: 18.2, p95_current: 214.7, updated_at: "2026-02-01T00:00:00Z" },
  { machine_id: "AC1",  mean_current: 52.8,  std_current: 6.1,  p95_current: 63.2,  updated_at: "2026-02-01T00:00:00Z" },
  { machine_id: "PMP3", mean_current: 9.3,   std_current: 1.2,  p95_current: 11.4,  updated_at: "2026-02-01T00:00:00Z" },
  { machine_id: "CMP2", mean_current: 78.6,  std_current: 9.4,  p95_current: 95.1,  updated_at: "2026-02-01T00:00:00Z" },
  { machine_id: "DRL5", mean_current: 31.2,  std_current: 4.5,  p95_current: 38.9,  updated_at: "2026-02-01T00:00:00Z" },
  { machine_id: "FAN4", mean_current: 21.7,  std_current: 2.8,  p95_current: 26.3,  updated_at: "2026-02-01T00:00:00Z" },
];

// ═══════════════════════════════════════════
// GET /api/v1/auth/teammates
// ═══════════════════════════════════════════
export const MOCK_TEAMMATES: TeammateResponse[] = [
  { id: 1, email: "mgr@millb.com",       role: "OWNER",   is_verified: true,  created_at: "2026-01-15T10:00:00Z" },
  { id: 2, email: "operator@millb.com",   role: "MEMBER",  is_verified: true,  created_at: "2026-01-20T09:00:00Z" },
  { id: 3, email: "lead@millb.com",       role: "MANAGER", is_verified: true,  created_at: "2026-01-22T11:30:00Z" },
];

// ═══════════════════════════════════════════
// GET /api/v1/auth/invitations
// ═══════════════════════════════════════════
export const MOCK_INVITATIONS: InvitationResponse[] = [
  { id: 1, email: "newtech@millb.com",  role: "MEMBER",  expires_at: "2026-02-18T00:00:00Z", is_accepted: false, created_at: "2026-02-11T09:00:00Z" },
  { id: 2, email: "safety@millb.com",   role: "MANAGER", expires_at: "2026-02-20T00:00:00Z", is_accepted: false, created_at: "2026-02-12T14:00:00Z" },
];
