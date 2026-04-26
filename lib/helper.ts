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

export const getHealthLabel = (score: number): string =>
  score >= 80 ? "Healthy" : score >= 60 ? "Moderate" : "Critical";

export const getCategoryColor = (category: string): string => {
  const lower = category.toLowerCase();
  if (lower === "good") return "var(--green)";
  if (lower === "risk") return "var(--red)";
  return "var(--amber)";
};

export const getInsightStyle = (insight: string): string => {
  const lower = insight.toLowerCase();
  if (lower.includes("optimal") || lower.includes("efficient"))
    return "bg-(--green-bg) text-(--green) border-(--green)";
  if (lower.includes("slight") || lower.includes("drift"))
    return "bg-(--amber-bg) text-(--amber) border-(--amber)";
  if (lower.includes("high") || lower.includes("spike") || lower.includes("critical"))
    return "bg-(--red-bg) text-(--red) border-(--red)";
  return "bg-(--amber-bg) text-(--amber) border-(--amber)";
};

export const getInsightIcon = (insight: string): string => {
  const lower = insight.toLowerCase();
  if (lower.includes("optimal") || lower.includes("efficient")) return "✓";
  if (lower.includes("high") || lower.includes("critical")) return "⚠";
  return "◈";
};