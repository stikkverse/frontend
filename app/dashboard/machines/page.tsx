"use client";

import { useState, useMemo } from "react";
import { MOCK_DASHBOARD_MACHINES, MOCK_MACHINE_SPECS } from "@/lib/mockData";
import SearchBar from "@/components/dashboard/SearchBar";
import MachineCard from "@/components/dashboard/MachineCard";

export default function MachinesPage() {
  const machines = MOCK_DASHBOARD_MACHINES;
  const specs = MOCK_MACHINE_SPECS;
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
          <h2
            className="font-sans text-[20px] font-bold m-0"
            style={{ color: "var(--text)" }}
          >
            Machine Health Board
          </h2>
          <p
            className="font-sans text-[13px] mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Real-time vitals for {machines.length} monitored units — search by
            ID, type, status, or risk
          </p>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {filtered.length === 0 ? (
        <div
          className="text-center py-12 font-mono text-[13px]"
          style={{ color: "var(--text-muted)" }}
        >
          No machines matching &quot;{search}&quot;
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          }}
        >
          {filtered.map((machine, i) => (
            <MachineCard key={machine.machine_id} machine={machine} index={i} />
          ))}
        </div>
      )}
      <div className="mt-4">
        <h3
          className="font-sans text-base font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Machine Specifications
        </h3>
        <div
          className="overflow-x-auto rounded-[12px] border"
          style={{ borderColor: "var(--border)" }}
        >
          <table
            className="w-full text-left"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ background: "var(--bg-alt)" }}>
                <th
                  className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  MACHINE ID
                </th>
                <th
                  className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  TYPE
                </th>
                <th
                  className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  RATED POWER
                </th>
                <th
                  className="font-mono text-[10px] tracking-[0.12em] px-4 py-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  ENERGY SOURCE
                </th>
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <tr
                  key={s.machine_id}
                  className="transition-colors duration-150"
                  style={{ borderTop: "1px solid var(--border)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    className="font-mono text-[13px] font-semibold px-4 py-3"
                    style={{ color: "var(--text)" }}
                  >
                    {s.machine_id}
                  </td>
                  <td
                    className="font-sans text-[13px] px-4 py-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.machine_type}
                  </td>
                  <td
                    className="font-mono text-[13px] px-4 py-3"
                    style={{ color: "var(--text)" }}
                  >
                    {s.rated_power_kw}{" "}
                    <span style={{ color: "var(--text-muted)" }}>kW</span>
                  </td>
                  <td
                    className="font-mono text-[10px] tracking-[0.08em] uppercase px-4 py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
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
