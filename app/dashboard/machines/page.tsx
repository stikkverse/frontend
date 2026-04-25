"use client";

import { useState, useMemo } from "react";
import { useDashboardMachines, useMachineSpecs } from "@/hooks/useDashboard";
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
  const { data: machinesData, isLoading: machinesLoading, isError } = useDashboardMachines();
  const machines = useMemo(
    () => (Array.isArray(machinesData) ? machinesData : []),
    [machinesData],
  );

  const { data: specsData } = useMachineSpecs();
  const specs = useMemo(
    () => (Array.isArray(specsData) ? specsData : []),
    [specsData],
  );

  // Detailed per-machine data from mill summary (run_hours, avg_current_A, etc.)
  const { data: millMachines, isLoading: millMachinesLoading } = useMillMachines();

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return machines;
    const q = search.toUpperCase();
    return machines.filter(
      (m) =>
        m.machine_id.toUpperCase().includes(q) ||
        m.bearing_risk.includes(q) ||
        m.status.includes(q) ||
        specs
          .find((s) => s.machine_id === m.machine_id)
          ?.machine_type.toUpperCase()
          .includes(q),
    );
  }, [machines, specs, search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-sans text-[20px] font-bold m-0" style={{ color: "var(--text)" }}>
            Machine Health Board
          </h2>
          {machinesLoading ? (
            <div className="h-4 w-64 rounded bg-(--bg-alt) animate-pulse mt-1" />
          ) : (
            <p className="font-sans text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
              Real-time vitals for {machines.length} monitored units — search by ID, type, status, or risk
            </p>
          )}
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {isError && (
        <div
          className="rounded-[10px] border p-4 font-mono text-[12px]"
          style={{ borderColor: "var(--red)", color: "var(--red)", background: "var(--red-bg)" }}
        >
          ⚠ Failed to load machine data. Retrying automatically…
        </div>
      )}

      {machinesLoading ? (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 font-mono text-[13px]" style={{ color: "var(--text-muted)" }}>
          No machines matching &quot;{search}&quot;
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

      {/* Machine Specifications Table — uses millMachines for detailed fields */}
      <div className="mt-4">
        <h3 className="font-sans text-base font-semibold mb-3" style={{ color: "var(--text)" }}>
          Machine Specifications
        </h3>
        <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {["MACHINE ID", "NAME", "TOTAL ENERGY (kWh)", "AVG CURRENT (A)", "RUN HOURS", "EXCESS CO₂ (kg)"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {millMachinesLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-3 w-24 rounded bg-(--bg-alt) animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : millMachines.length === 0
                  ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center font-mono text-[12px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        No machine data available
                      </td>
                    </tr>
                  )
                  : millMachines.map((m) => (
                    <tr
                      key={m.machine_id}
                      className="transition-colors duration-150"
                      style={{ borderTop: "1px solid var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="font-mono text-[13px] font-semibold px-4 py-3" style={{ color: "var(--text)" }}>
                        {m.machine_id}
                      </td>
                      <td className="font-sans text-[12px] px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                        {m.name}
                      </td>
                      <td className="font-mono text-[13px] px-4 py-3" style={{ color: "var(--cyan)" }}>
                        {m.total_energy_kwh.toFixed(2)}
                      </td>
                      <td className="font-mono text-[13px] px-4 py-3" style={{ color: "var(--text)" }}>
                        {m.avg_current_A.toFixed(2)} <span style={{ color: "var(--text-muted)" }}>A</span>
                      </td>
                      <td className="font-mono text-[13px] px-4 py-3" style={{ color: "var(--text)" }}>
                        {m.run_hours.toFixed(1)} <span style={{ color: "var(--text-muted)" }}>h</span>
                      </td>
                      <td className="font-mono text-[13px] px-4 py-3" style={{ color: "var(--amber)" }}>
                        {m.excess_co2_kg.toFixed(2)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}