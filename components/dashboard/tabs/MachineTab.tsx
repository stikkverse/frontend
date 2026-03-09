"use client";

import { useState, useMemo } from "react";
import type { DashboardData } from "@/lib/type";
import SearchBar from "../SearchBar";
import MachineCard from "../MachineCard";

interface MachinesTabProps {
  data: DashboardData;
}

export default function MachinesTab({ data }: MachinesTabProps) {
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    if (!search.trim()) return data.machines;
    const q = search.toUpperCase();
    return data.machines.filter(
      (m) =>
        m.machine_id.toUpperCase().includes(q) ||
        m.bearing_risk.includes(q) ||
        m.status.includes(q),
    );
  }, [data.machines, search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-sans text-[20px] font-bold text-dash-text m-0">
            Machine Health Board
          </h2>
          <p className="font-sans text-[13px] text-dash-text-secondary mt-1">
            Real-time vitals for {data.machines.length} monitored units — search by ID, status, or risk level
          </p>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 font-mono text-[13px] text-dash-text-muted">
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
    </div>
  );
}