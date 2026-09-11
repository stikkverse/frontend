"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/schema";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import NavBar from "@/components/auth/NavBar";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { new_password: "", confirmPassword: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) {
      toast.error("Missing reset token. Use the link from your email.");
      return;
    }
    try {
      await authApi.resetPassword(token, values.new_password);
      setDone(true);
      setTimeout(() => router.push("/"), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(
        err.response?.data?.detail ??
          "This reset link is invalid or has expired.",
      );
    }
  };

  if (!token) {
    return (
      <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9 text-center py-8">
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-(--red-bg) border-2 border-(--red)">
          <span className="text-xl">✕</span>
        </div>
        <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
          Invalid link
        </h2>
        <p className="font-sans text-[13px] text-(--text-secondary) mb-6">
          This reset link is missing its token. Request a new one.
        </p>
        <Link href="/forgot-password">
          <Button
            variant="outline"
            className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-(--cyan-bg) text-(--cyan) hover:opacity-80 transition-all duration-200"
          >
            REQUEST NEW LINK
          </Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9">
        <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--green),transparent)]" />
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-(--green-bg) border-2 border-(--green)">
            <span className="text-xl">✓</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Password updated
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6">
            Your password has been reset. Redirecting you to sign in...
          </p>
          <Link href="/">
            <Button className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 transition-all duration-200">
              GO TO SIGN IN
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9">
      <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />
      <div className="mb-7">
        <h2 className="font-sans text-[26px] font-bold text-(--text)">
          Set new password
        </h2>
        <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
          Choose a strong password you haven&apos;t used before
        </p>
      </div>

      <form id="reset-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-5">
          <Controller
            name="new_password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                  NEW PASSWORD
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
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
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

          <Button
            type="submit"
            form="reset-form"
            disabled={isSubmitting}
            className="w-full rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 py-5"
          >
            {isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <NavBar />
      <section className="flex justify-between flex-col lg:flex-row md:flex-row lg:w-[80%] md:w-[80%] w-[90%] mx-auto relative z-2 my-auto">
        <div className="lg:w-[46%] md:w-[46%] w-full mb-6">
          <div className="w-10 h-0.75 rounded-full bg-cyan-300 mb-6" />
          <h1 className="font-sans font-bold text-(--text) lg:text-[64px] md:text-[52px] text-[48px] mb-3">
            New password.
          </h1>
          <p className="font-sans text-[18px] leading-relaxed text-(--text-secondary)">
            Pick something strong. You&apos;ll use it to sign in from now on.
          </p>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-full">
          <Suspense
            fallback={
              <div className="relative w-full rounded-[20px] border border-border  bg-(--surface) shadow-(--card-shadow) p-9 text-center">
                <p className="font-mono text-[13px] text-(--text-muted)">
                  Loading...
                </p>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
