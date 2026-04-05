"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/lib/schema";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      toast.success("Signed in successfully");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(
        err.response?.data?.detail ?? "Invalid credentials. Please try again.",
      );
    }
  };

  return (
    <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9">
      <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />
      <div className="mb-7">
        <h2 className="font-sans text-[26px] font-bold text-(--text)">
          Sign in
        </h2>
        <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
          Welcome back — access your mill dashboard
        </p>
      </div>

      <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                  COMPANY EMAIL
                </FieldLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  className="bg-(--bg-alt) border-border text-(--text) font-mono text-[13px] rounded-[10px] focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5"
                />
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="font-mono text-[10px] tracking-[0.06em] text-(--red)"
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                  PASSWORD
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="bg-(--bg-alt) border-border text-(--text) font-mono text-[13px] rounded-[10px] pr-10 focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--cyan) transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff size={15} strokeWidth={2} />
                    ) : (
                      <Eye size={15} strokeWidth={2} />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="font-mono text-[10px] tracking-[0.06em] text-(--red)"
                  />
                )}
              </Field>
            )}
          />

          <div className="flex justify-end -mt-2">
            <Link
              href="/forgot-password"
              className="font-mono text-[10px] tracking-[0.06em] text-(--text-muted) hover:text-(--cyan) transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            form="login-form"
            disabled={isSubmitting}
            className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
          </Button>

          <p className="text-center font-sans text-[13px] text-(--text-secondary)">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-(--cyan) hover:text-(--tab-active) transition-colors duration-200"
            >
              Create one
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  );
}