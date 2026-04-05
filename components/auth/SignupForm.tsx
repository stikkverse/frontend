"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signupSchema, type SignupFormValues } from "@/lib/schema";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const label = ["", "WEAK", "FAIR", "GOOD", "STRONG"][score];

  const colorClass = [
    "",
    "text-(--red)",
    "text-(--amber)",
    "text-(--amber)",
    "text-(--green)",
  ][score];

  const barBg = [
    "",
    "bg-(--red)",
    "bg-(--amber)",
    "bg-(--amber)",
    "bg-(--green)",
  ][score];

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-0.75 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? barBg : "bg-(--border)"
            }`}
          />
        ))}
      </div>
      <span
        className={`font-mono text-[9px] tracking-widest transition-colors duration-300 ${colorClass}`}
      >
        {label}
      </span>
    </div>
  );
}

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { signup } = useAuth();
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      mill_name: "",
      mill_tag: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;
  const password = form.watch("password");

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup({
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        mill_name: values.mill_name,
        mill_tag: values.mill_tag,
      });
      setSuccess(true);
      toast.success("Account created — check your email for verification");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(
        err.response?.data?.detail ?? "Registration failed. Please try again.",
      );
    }
  };

  if (success) {
    return (
      <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9">
        <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--green),transparent)]" />
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-(--green-bg) border-2 border-(--green)">
            <span className="text-xl">✓</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Account created
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6 leading-relaxed">
            A verification email has been sent. Please verify your email before
            signing in.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 transition-all duration-200"
          >
            GO TO SIGN IN
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9">
      <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />

      <div className="mb-7">
        <h2 className="font-sans text-[26px] font-bold text-(--text)">
          Create account
        </h2>
        <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
          Set up your company profile on FactorySense
        </p>
      </div>

      <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-5">
          <Controller
            name="full_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                  FULL NAME
                </FieldLabel>
                <Input
                  {...field}
                  type="text"
                  placeholder="Amara Okonkwo"
                  autoComplete="name"
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

          <div className="flex gap-3">
            <div className="flex-1">
              <Controller
                name="mill_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                      MILL NAME
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Sapele Processing Mill"
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
            </div>
            <div className="w-30 shrink-0">
              <Controller
                name="mill_tag"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                      MILL TAG
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="B"
                      maxLength={10}
                      aria-invalid={fieldState.invalid}
                      className="bg-(--bg-alt) border-border text-(--text) font-mono text-[13px] rounded-[10px] focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5 uppercase"
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
            </div>
          </div>

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
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="bg-(--bg-alt) border-border py-5 text-(--text) font-mono text-[13px] rounded-[10px] pr-10 focus-visible:ring-(--cyan) focus-visible:border-(--cyan)"
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
                <PasswordStrength password={password} />
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
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                  CONFIRM PASSWORD
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="bg-(--bg-alt) border-border text-(--text) font-mono text-[13px] rounded-[10px] pr-10 focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--cyan) transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
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
            form="signup-form"
            disabled={isSubmitting}
            className="w-full rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 py-5"
          >
            {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </Button>

          <p className="font-sans text-[12px] text-center leading-relaxed text-(--text-muted)">
            A verification email will be sent before you can access the
            dashboard.
          </p>

          <p className="text-center font-sans text-[13px] text-(--text-secondary)">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-semibold text-(--cyan) hover:text-(--tab-active) transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  );
}