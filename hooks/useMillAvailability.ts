"use client";

import { useState, useEffect, useRef } from "react";
import { authApi } from "@/lib/database/api";

export type AvailabilityState =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "error";

export function useMillAvailability(millId: string, enabled: boolean) {
  const [state, setState] = useState<AvailabilityState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    const trimmed = millId.trim();

    if (!enabled || trimmed.length === 0) {
      setState("idle");
      return;
    }

    setState("checking");
    const mySeq = ++seq.current;

    timer.current = setTimeout(async () => {
      try {
        const res = await authApi.checkMillAvailable(trimmed);
        // Ignore out-of-order responses
        if (mySeq !== seq.current) return;
        setState(res.available ? "available" : "taken");
      } catch {
        if (mySeq !== seq.current) return;
        setState("error");
      }
    }, 500);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [millId, enabled]);

  return state;
}
