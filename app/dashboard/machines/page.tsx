"use client";

import { useState, useMemo, useEffect } from "react";
import { useMillMachines } from "@/hooks/useMillSummary";
import SearchBar from "@/components/dashboard/SearchBar";
import MachineCard from "@/components/dashboard/MachineCard";

function CardSkeleton() {
  return (
    <div
      className="rounded-[14px] border animate-pulse overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="h-0.75 bg-(--bg-alt)" />
      <div className="px-5 pt-4 pb-5">
        <div className="h-5 w-20 rounded bg-(--bg-alt) mb-3" />
        <div className="h-3 w-32 rounded bg-(--bg-alt) mb-4" />
        <div className="flex gap-4">
          <div className="w-[90px] h-[90px] rounded-full bg-(--bg-alt) shrink-0" />
          <div className="flex-1 pt-2">
            <div className="h-3 w-28 rounded bg-(--bg-alt) mb-2" />
            <div className="h-7 w-16 rounded bg-(--bg-alt)" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MachinesPage() {
  const { data: machines = [], isLoading, isError } = useMillMachines();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  console.log(machines)

useEffect(() => {
  setMounted(true);
}, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return machines;
    const q = search.toUpperCase();
    return machines.filter(
      (m) =>
        m.machine_id.toUpperCase().includes(q) ||
        m.name.toUpperCase().includes(q) ||
        m.bearing_risk.includes(q) ||
        m.health_score_breakdown.category.toUpperCase().includes(q),
    );
  }, [machines, search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-sans text-[20px] font-bold m-0 text-(--text)">
            Machine Health Board
          </h2>
          {!mounted || isLoading ? (
            <div className="h-4 w-64 rounded bg-(--bg-alt) animate-pulse mt-1" />
          ) : (
            <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
              Real-time vitals for {machines.length} monitored units — search by ID, name, or risk
            </p>
          )}
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {isError && (
        <div className="rounded-[10px] border p-4 font-mono text-[12px] border-(--red) text-(--red) bg-(--red-bg)">
          ⚠ Failed to load machine data. Retrying automatically…
        </div>
      )}

      {!mounted || isLoading ? (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 font-mono text-[13px] text-(--text-muted)">
          {search
            ? `No machines matching "${search}"`
            : "No machine data available — upload a baseline CSV to get started"}
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}
        >
          {filtered.map((machine, i) => (
            <MachineCard key={machine.machine_id} machine={machine} index={i} />
          ))}
        </div>
      )}

      {/* Machine Specifications Table */}
      {!isLoading && machines.length > 0 && (
        <div className="mt-4">
          <h3 className="font-sans text-base font-semibold mb-3 text-(--text)">
            Machine Specifications
          </h3>
          <div className="overflow-x-auto rounded-[12px] border border-(--border)">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-(--bg-alt)">
                  {["MACHINE ID", "NAME", "ENERGY (kWh)", "AVG CURRENT (A)", "RUN HOURS", "EXCESS CO₂ (kg)"].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] px-4 py-3 text-(--text-muted)">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {machines.map((m) => (
                  <tr
                    key={m.machine_id}
                    className="transition-colors duration-150 border-t border-(--border) hover:bg-(--surface-hover)"
                  >
                    <td className="font-mono text-[13px] font-semibold px-4 py-3 text-(--text)">{m.machine_id}</td>
                    <td className="font-sans text-[12px] px-4 py-3 text-(--text-secondary)">{m.name}</td>
                    <td className="font-mono text-[13px] px-4 py-3 text-(--cyan)">{m.total_energy_kwh.toFixed(2)}</td>
                    <td className="font-mono text-[13px] px-4 py-3 text-(--text)">
                      {m.avg_current_A.toFixed(2)} <span className="text-(--text-muted)">A</span>
                    </td>
                    <td className="font-mono text-[13px] px-4 py-3 text-(--text)">
                      {m.run_hours.toFixed(1)} <span className="text-(--text-muted)">h</span>
                    </td>
                    <td className="font-mono text-[13px] px-4 py-3 text-(--amber)">{m.excess_co2_kg.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}