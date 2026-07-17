"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useSuperadminAuth } from "@/lib/superadmin/superadminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import BackgroundGrid from "@/components/shared/BackgroundGrid";

const loginSchema = z.object({
  email: z.email("Enter a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function SuperadminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useSuperadminAuth();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values.email, values.password);
      toast.success("Access granted");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      toast.error(
        err.response?.data?.detail ??
          err.message ??
          "Access denied. Check your credentials.",
      );
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-(--bg)">
      <BackgroundGrid />
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div className="relative w-full rounded-[20px] border border-(--border) bg-(--surface) shadow-(--card-shadow) p-9">
          <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--violet),transparent)]" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center font-mono text-sm font-bold shrink-0 bg-(--violet-bg) border-[1.5px] border-(--violet) text-(--violet)">
              SA
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] text-(--violet)">
                STIKKVERSE
              </p>
              <h1 className="font-sans text-[20px] font-bold text-(--text)">
                Command Center
              </h1>
            </div>
          </div>

          <p className="font-sans text-[13px] text-(--text-secondary) mb-6">
            Platform administration access. Superadmin credentials only.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-5">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                      EMAIL
                    </FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="superadmin@stikkverse.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      className="bg-(--bg-alt) border-(--border) text-(--text) font-mono text-[13px] rounded-[10px] focus-visible:ring-(--violet) focus-visible:border-(--violet) py-5"
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
                        placeholder="••••••••"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        className="bg-(--bg-alt) border-(--border) text-(--text) font-mono text-[13px] rounded-[10px] pr-10 focus-visible:ring-(--violet) focus-visible:border-(--violet) py-5"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--violet) transition-colors duration-200"
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--violet) bg-[linear-gradient(135deg,var(--violet),var(--cyan))] text-white shadow-[0_0_24px_var(--violet-glow)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? "VERIFYING..." : "ACCESS COMMAND CENTER"}
              </Button>

              <p className="text-center font-sans text-[13px] text-(--text-secondary)">
                Not a platform admin?{" "}
                <Link
                  href="/"
                  className="font-semibold text-(--cyan) hover:text-(--violet) transition-colors duration-200"
                >
                  Go to mill login
                </Link>
              </p>
            </FieldGroup>
          </form>
        </div>
      </div>
    </main>
  );
}
