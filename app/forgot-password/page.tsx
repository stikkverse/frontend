"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/schema";
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
import { Mail, Clock, KeyRound } from "lucide-react";

function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await authApi.forgotPassword(values.email);
      setSent(true);
    } catch {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="relative w-full rounded-[20px] border border-border  bg-(--surface) shadow-(--card-shadow) p-9">
        <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--green),transparent)]" />
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-(--green-bg) border-2 border-(--green)">
            <span className="text-xl">✉</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Check your email
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6 leading-relaxed">
            If an account exists for that email, we&apos;ve sent a password
            reset link. It expires shortly, so use it soon.
          </p>
          <Link href="/">
            <Button className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 transition-all duration-200">
              BACK TO SIGN IN
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-[20px] border border-borderbg-(--surface) shadow-(--card-shadow) p-9">
      <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />
      <div className="mb-7">
        <h2 className="font-sans text-[26px] font-bold text-(--text)">
          Reset password
        </h2>
        <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form id="forgot-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  className="bg-(--bg-alt) bborder-border  text-(--text) font-mono text-[13px] rounded-[10px] focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5"
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
            form="forgot-form"
            disabled={isSubmitting}
            className="w-full rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 py-5"
          >
            {isSubmitting ? "SENDING..." : "SEND RESET LINK"}
          </Button>

          <p className="text-center font-sans text-[13px] text-(--text-secondary)">
            Remembered it?{" "}
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

export default function ForgotPasswordPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <NavBar />
      <section className="flex justify-between items-center flex-col lg:flex-row md:flex-row lg:w-[80%] md:w-[80%] w-[90%] mx-auto relative z-2 my-auto">
        <div className="lg:w-[46%] md:w-[46%] w-full mb-6">
          <div className="w-10 h-0.75 rounded-full bg-cyan-300 mb-6" />
          <h1 className="font-sans font-bold text-(--text) lg:text-[64px] md:text-[52px] text-[48px] mb-3">
            Forgot it?
          </h1>
          <p className="font-sans text-[18px] leading-relaxed text-(--text-secondary) mb-8">
            Happens to everyone. Pop in your email and we&apos;ll send a secure
            link to set a new password.
          </p>

          <div className="lg:flex md:flex hidden flex-col gap-4 max-w-105">
            <div className="flex items-start gap-3 mb-2">
              <Mail size={18} className="text-(--cyan) shrink-0 mt-0.5" />
              <p className="font-sans text-[14px] text-(--text-secondary) leading-relaxed">
                Check your inbox in a minute or two — and peek in spam if
                it&apos;s hiding.
              </p>
            </div>
            <div className="flex items-start gap-3 mb-2">
              <Clock size={18} className="text-(--amber) shrink-0 mt-0.5" />
              <p className="font-sans text-[14px] text-(--text-secondary) leading-relaxed">
                The link expires shortly for safety, so use it soon after it
                lands.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <KeyRound size={18} className="text-(--green) shrink-0 mt-0.5" />
              <p className="font-sans text-[14px] text-(--text-secondary) leading-relaxed">
                Pick something fresh you haven&apos;t used here before, and
                you&apos;re set.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-full">
          <ForgotPasswordForm />
        </div>
      </section>
    </main>
  );
}
