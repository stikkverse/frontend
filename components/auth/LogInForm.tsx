"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Sparkles, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/lib/database/schema";
import { useAuth } from "@/lib/auth/authContext";
import { authApi } from "@/lib/database/api";
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
  const [magicSent, setMagicSent] = useState(false);
  const [magicPending, setMagicPending] = useState(false);
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

  const handleMagicLink = async () => {
    const email = form.getValues("email");
    const emailValid = await form.trigger("email");
    if (!email || !emailValid) {
      toast.error("Enter your email above first, then request a magic link.");
      return;
    }
    setMagicPending(true);
    try {
      await authApi.requestMagicLink(email);
      setMagicSent(true);
      toast.success(
        "If that email is registered, a sign-in link is on its way.",
      );
    } catch {
      // Anti-enumeration: same neutral outcome regardless.
      setMagicSent(true);
    } finally {
      setMagicPending(false);
    }
  };

  return (
    <div className="relative w-full rounded-[20px] border border-(--border) bg-(--surface) shadow-(--card-shadow) p-9">
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
                  className="bg-(--bg-alt) border-(--border) text-(--text) font-mono text-[13px] rounded-[10px] focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5"
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
                    className="bg-(--bg-alt) border-(--border) text-(--text) font-mono text-[13px] rounded-[10px] pr-10 focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5"
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

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-(--border)" />
            <span className="font-mono text-[9px] tracking-[0.14em] text-(--text-muted)">
              OR
            </span>
            <div className="flex-1 h-px bg-(--border)" />
          </div>

          {/* Passwordless / magic link */}
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={magicPending || magicSent}
            className="w-full py-4 rounded-[10px] font-mono text-[11px] font-semibold tracking-[0.08em] flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed
              border-(--border) bg-(--bg-alt) text-(--text-secondary)
              hover:border-(--cyan) hover:text-(--cyan)
              disabled:opacity-60 disabled:hover:border-(--border) disabled:hover:text-(--text-secondary)"
          >
            {magicSent ? (
              <>
                <Check size={14} strokeWidth={2.5} className="text-(--green)" />
                MAGIC LINK SENT
              </>
            ) : magicPending ? (
              <>
                <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
                SENDING LINK...
              </>
            ) : (
              <>
                <Sparkles size={14} strokeWidth={2} />
                EMAIL ME A MAGIC LINK
              </>
            )}
          </button>

          {magicSent && (
            <p className="font-sans text-[11px] text-center leading-relaxed text-(--text-muted) -mt-2">
              Check your inbox for a one-click sign-in link. It expires in 15
              minutes.
            </p>
          )}

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
