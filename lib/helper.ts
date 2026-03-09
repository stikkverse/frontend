import type { BearingRisk } from "./type";

export const getRiskColor = (risk: BearingRisk): string =>
  risk === "HIGH" ? "var(--red)" : risk === "WARNING" ? "var(--amber)" : "var(--green)";

export const getRiskGlow = (risk: BearingRisk): string =>
  risk === "HIGH" ? "var(--red-glow)" : risk === "WARNING" ? "var(--amber-glow)" : "var(--green-glow)";

export const getRiskBg = (risk: BearingRisk): string =>
  risk === "HIGH" ? "var(--red-bg)" : risk === "WARNING" ? "var(--amber-bg)" : "var(--green-bg)";

export const getHealthColor = (score: number): string =>
  score >= 80 ? "var(--green)" : score >= 60 ? "var(--amber)" : "var(--red)";

export const getCO2Color = (kg: number): string =>
  kg > 15 ? "var(--red)" : kg > 5 ? "var(--amber)" : "var(--green)";