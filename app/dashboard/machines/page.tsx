"use client";

import { useState, useMemo } from "react";
import { useDashboardMachines, useMachineSpecs } from "@/hooks/useDashboard";
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
  const machines = Array.isArray(machinesData) ? machinesData : [];
  const { data: specsData, isLoading: specsLoading } = useMachineSpecs();
  const specs = Array.isArray(specsData) ? specsData : [];

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

      {/* Machine Specifications Table */}
      <div className="mt-4">
        <h3 className="font-sans text-base font-semibold mb-3" style={{ color: "var(--text)" }}>
          Machine Specifications
        </h3>
        <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                {["MACHINE ID", "TYPE", "RATED POWER", "ENERGY SOURCE"].map((h) => (
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
              {specsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 w-24 rounded bg-(--bg-alt) animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
                : specs.map((s) => (
                  <tr
                    key={s.machine_id}
                    className="transition-colors duration-150"
                    style={{ borderTop: "1px solid var(--border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="font-mono text-[13px] font-semibold px-4 py-3" style={{ color: "var(--text)" }}>
                      {s.machine_id}
                    </td>
                    <td className="font-sans text-[13px] px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                      {s.machine_type}
                    </td>
                    <td className="font-mono text-[13px] px-4 py-3" style={{ color: "var(--text)" }}>
                      {s.rated_power_kw} <span style={{ color: "var(--text-muted)" }}>kW</span>
                    </td>
                    <td className="font-mono text-[10px] tracking-[0.08em] uppercase px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {s.energy_source_type}
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