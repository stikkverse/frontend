"use client";

import { useState } from "react";
import Link from "next/link";
import AuthInput from "./AuthInput";
import { validateEmail, validatePassword } from "@/lib/authValidation";

interface FormState  { email: string; password: string; }
interface FormErrors { email: string; password: string; }

export default function LoginForm() {
  const [form,      setForm]      = useState<FormState>({ email: "", password: "" });
  const [errors,    setErrors]    = useState<FormErrors>({ email: "", password: "" });
  const [loading,   setLoading]   = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validate = (): boolean => {
    const next: FormErrors = {
      email:    validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        [field]: field === "email" ? validateEmail(value) : validatePassword(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
  };

  return (
    <div className="relative w-full rounded-[20px] border border-(--border) bg-(--surface) shadow-card p-9">
      <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="mb-2">
          <h2 className="font-sans text-[26px] font-bold text-(--text)">
            Sign in
          </h2>
          <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
            Welcome back — access your mill dashboard
          </p>
        </div>

        <AuthInput
          label="COMPANY EMAIL"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          label="PASSWORD"
          isPassword
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3.5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest
            border border-(--cyan) transition-all duration-200 cursor-pointer
            bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)]
            disabled:bg-(--cyan-bg) disabled:text-(--cyan) disabled:shadow-none disabled:cursor-not-allowed
          "
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <p className="text-center font-sans text-[13px] text-(--text-secondary)">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-(--cyan) hover:text-(--tab-active) transition-colors duration-200"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}