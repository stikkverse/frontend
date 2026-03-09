export type BearingRisk = "HIGH" | "WARNING" | "NORMAL";
export type MachineStatus = "RUNNING" | "IDLE";
export type ThemeMode = "dark" | "light";

export interface Machine {
  machine_id: string;
  health_score: number;
  bearing_risk: BearingRisk;
  excess_co2_today_kg: number;
  status: MachineStatus;
}

export interface DashboardData {
  mill_id: string;
  last_updated: string;
  total_excess_co2_kg: number;
  avoidable_cost_usd: number;
  machines: Machine[];
  api_key: string;
  upload_count_7d: number;
  last_upload: string;
}

export interface Theme {
  bg: string;
  bgAlt: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  green: string;
  greenBg: string;
  greenGlow: string;
  amber: string;
  amberBg: string;
  amberGlow: string;
  red: string;
  redBg: string;
  redGlow: string;
  cyan: string;
  cyanBg: string;
  cyanGlow: string;
  accentGradient: string;
  tabActive: string;
  tabActiveBg: string;
  searchBg: string;
  shadow: string;
  cardShadow: string;
  gridColor: string;
  scanlineColor: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
}