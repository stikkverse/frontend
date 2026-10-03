"use client";

import type { MillActivityItem } from "@/lib/database/type";
import { healthClass, riskClass } from "../../../lib/superadmin/millsfilter";

const MACHINE_COLUMNS = [
  "MACHINE",
  "HEALTH",
  "BEARING RISK",
  "OPEN ALERTS",
  "EXCESS CO₂",
  "ENERGY",
  "RUN HRS",
  "LAST DATA",
];

export default function MachineSubRow({ mill }: { mill: MillActivityItem }) {
  if (mill.machines.length === 0) {
    return (
      <tr className="bg-(--bg-alt)">
        <td
          colSpan={9}
          className="px-10 py-4 font-mono text-[11px] text-(--text-muted)"
        >
          No machine-level data for this mill
        </td>
      </tr>
    );
  }
  return (
    <tr className="bg-(--bg-alt)">
      <td colSpan={9} className="px-4 py-3">
        <div className="overflow-x-auto rounded-[8px] border border-border bg-(--surface)">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                {MACHINE_COLUMNS.map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[9px] tracking-[0.12em] text-(--text-muted) px-3 py-2 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mill.machines.map((mc, i) => (
                <tr
                  key={`${mc.machine_id}-${i}`}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="font-mono text-[12px] font-semibold px-3 py-2 text-(--text) whitespace-nowrap">
                    {mc.machine_id}
                  </td>
                  <td
                    className={`font-mono text-[14px] font-bold px-3 py-2 ${healthClass(mc.health_score)}`}
                  >
                    {mc.health_score.toFixed(0)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full border font-mono text-[9px] font-semibold tracking-[0.06em] ${riskClass(mc.bearing_risk)}`}
                    >
                      {mc.bearing_risk}
                    </span>
                  </td>
                  <td
                    className={`font-mono text-[12px] font-semibold px-3 py-2 ${mc.open_alerts > 0 ? "text-(--red)" : "text-(--text-muted)"}`}
                  >
                    {mc.open_alerts}
                  </td>
                  <td className="font-mono text-[11px] px-3 py-2 text-(--text-secondary) whitespace-nowrap">
                    {mc.excess_co2_kg.toFixed(1)} kg
                  </td>
                  <td className="font-mono text-[11px] px-3 py-2 text-(--text-secondary) whitespace-nowrap">
                    {mc.total_energy_kwh.toFixed(0)} kWh
                  </td>
                  <td className="font-mono text-[11px] px-3 py-2 text-(--text-secondary)">
                    {mc.run_hours.toFixed(1)}
                  </td>
                  <td className="font-mono text-[11px] px-3 py-2 text-(--text-muted) whitespace-nowrap">
                    {mc.last_data_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
}
