import type { DashboardData } from "@/lib/type";

export const MOCK_DATA: DashboardData = {
  mill_id: "B",
  last_updated: "2026-02-11T08:00:00Z",
  total_excess_co2_kg: 32.16,
  avoidable_cost_usd: 20.12,
  machines: [
    { machine_id: "1BK1", health_score: 82.5, bearing_risk: "NORMAL",  excess_co2_today_kg: 9.86,  status: "RUNNING" },
    { machine_id: "AC1",  health_score: 64.2, bearing_risk: "HIGH",    excess_co2_today_kg: 22.3,  status: "RUNNING" },
    { machine_id: "PMP3", health_score: 91.0, bearing_risk: "NORMAL",  excess_co2_today_kg: 0.0,   status: "IDLE"    },
    { machine_id: "CMP2", health_score: 73.8, bearing_risk: "WARNING", excess_co2_today_kg: 14.2,  status: "RUNNING" },
    { machine_id: "DRL5", health_score: 55.3, bearing_risk: "HIGH",    excess_co2_today_kg: 28.7,  status: "RUNNING" },
    { machine_id: "FAN4", health_score: 96.1, bearing_risk: "NORMAL",  excess_co2_today_kg: 1.2,   status: "RUNNING" },
  ],
  api_key: "fsa_B_8f3d9a2c4e1b7f6d",
  upload_count_7d: 7,
  last_upload: "2026-02-11",
};