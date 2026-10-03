"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/database/schema";
import { authApi } from "@/lib/database/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const ForgotPasswordForm = () => {
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
};

export default ForgotPasswordForm;
