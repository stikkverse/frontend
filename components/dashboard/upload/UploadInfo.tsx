"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadZone from "./UploadZone";

const CSV_COLUMNS = [
  { name: "timestamp", type: "ISO 8601", example: "2026-03-12T00:00:00Z", description: "Reading timestamp (UTC)" },
  { name: "mill_id", type: "string", example: "B", description: "Your mill identifier" },
  { name: "machine_id", type: "string", example: "1BK1", description: "Unique machine tag" },
  { name: "current_A", type: "float", example: "15.38", description: "Current draw in Amperes" },
  { name: "motor_state", type: "enum", example: "RUNNING", description: "RUNNING or OFF" },
];

interface UploadInfoProps {
  onTaskCreated?: (filename: string, taskId: string) => void;
}

export default function UploadInfo({ onTaskCreated }: UploadInfoProps) {
  const [open, setOpen] = useState(false);

  const handleComplete = () => {
    try {
      const taskId = sessionStorage.getItem("latest_task_id");
      const filename = sessionStorage.getItem("latest_filename");
      if (taskId && filename && onTaskCreated) {
        onTaskCreated(filename, taskId);
      }
    } catch { /* ignore */ }
    setOpen(false);
  };

  return (
    <div className="rounded-[14px] border overflow-hidden border-border bg-(--surface) shadow-(--card-shadow)">
      <div className="p-5 pb-0">
        <div className="flex items-center gap-2 mb-3">
          <FileSpreadsheet size={16} className="text-(--cyan)" />
          <p className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
            CSV FORMAT GUIDE
          </p>
        </div>
        <p className="font-sans text-[13px] text-(--text-secondary) leading-relaxed mb-4">
          Start your upload with Baseline data, followed by operational data, all in CSV format.
        </p>
      </div>

      <div className="px-5">
        <div className="rounded-lg border overflow-hidden border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--bg-alt)">
                <th className="font-mono text-[9px] tracking-widest text-(--text-muted) px-3 py-2">COLUMN</th>
                <th className="font-mono text-[9px] tracking-widest text-(--text-muted) px-3 py-2">TYPE</th>
                <th className="font-mono text-[9px] tracking-widest text-(--text-muted) px-3 py-2 hidden md:table-cell">EXAMPLE</th>
                <th className="font-mono text-[9px] tracking-widest text-(--text-muted) px-3 py-2 hidden lg:table-cell">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {CSV_COLUMNS.map((col) => (
                <tr key={col.name} className="border-t border-border">
                  <td className="font-mono text-[11px] font-semibold text-(--cyan) px-3 py-2">{col.name}</td>
                  <td className="font-mono text-[10px] text-(--text-muted) px-3 py-2">{col.type}</td>
                  <td className="font-mono text-[10px] text-(--text-secondary) px-3 py-2 hidden md:table-cell">{col.example}</td>
                  <td className="font-sans text-[11px] text-(--text-muted) px-3 py-2 hidden lg:table-cell">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-5">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 transition-all duration-200 gap-2">
              <Upload size={14} />
              UPLOAD CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Select your upload type and drop your CSV file below
            </DialogDescription>
            <div className="mt-4">
              <UploadZone onComplete={handleComplete} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}