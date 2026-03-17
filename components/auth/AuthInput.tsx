"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export default function AuthInput({
  label,
  error,
  isPassword = false,
  ...props
}: AuthInputProps) {
  const [revealed, setRevealed] = useState<boolean>(false);
  const inputType = isPassword ? (revealed ? "text" : "password") : props.type ?? "text";
  const hasError  = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] tracking-[0.14em] text-dash-text-muted">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={inputType}
          className="w-full px-4 py-3 rounded-[10px] font-mono text-[13px] text-dash-text bg-dash-bg-alt border outline-none transition-all duration-200"
          style={{
            borderColor: hasError ? "var(--red)" : "var(--border)",
            boxShadow: hasError ? "0 0 0 3px var(--red-bg)" : "none",
          }}
          onFocus={(e) => {
            if (!hasError) e.currentTarget.style.borderColor = "var(--cyan)";
            if (!hasError) e.currentTarget.style.boxShadow = "0 0 0 3px var(--cyan-bg)";
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (!hasError) e.currentTarget.style.borderColor = "var(--border)";
            if (!hasError) e.currentTarget.style.boxShadow = "none";
            props.onBlur?.(e);
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-[0.1em] transition-colors duration-200"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            aria-label={revealed ? "Hide password" : "Show password"}
          >
            {revealed ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p className="font-mono text-[10px] tracking-[0.06em]" style={{ color: "var(--red)" }}>
          {error}
        </p>
      )}
    </div>
  );
}