"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Factory,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { signupSchema, type SignupFormValues } from "@/lib/database/schema";
import { useAuth } from "@/lib/auth/authContext";
import { useMillAvailability } from "@/hooks/useMillAvailability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { RegisterOutcome } from "@/lib/database/type";

type Mode = "create" | "join";

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
            className={`h-0.75 flex-1 rounded-full transition-all duration-300 ${i <= score ? barBg : "bg-(--border)"}`}
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
  const [mode, setMode] = useState<Mode>("create");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [outcome, setOutcome] = useState<RegisterOutcome | null>(null);
  const [outcomeMessage, setOutcomeMessage] = useState("");
  const { signup } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      intent: "create",
      email: "",
      mill_id: "",
      role: "admin",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;
  const password = form.watch("password");
  const millId = form.watch("mill_id");

  const availability = useMillAvailability(millId ?? "", mode === "create");
  const submitBlocked =
    mode === "create" &&
    (availability === "taken" || availability === "checking");

  const switchMode = (m: Mode) => {
    setMode(m);
    form.setValue("intent", m);
    if (m === "create") form.setValue("role", "admin");
  };

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const res = await signup({
        email: values.email,
        password: values.password,
        mill_id: values.mill_id,
        role: mode === "join" ? values.role : "admin",
        intent: mode,
      });
      setOutcome(
        res.outcome ?? (res.api_key ? "account_created" : "approval_queued"),
      );
      setOutcomeMessage(res.message ?? "");
    } catch (error: unknown) {
      const err = error as {
        response?: {
          status?: number;
          data?: { detail?: string | Array<{ msg: string }> };
        };
      };
      const status = err.response?.status;

      if (status === 409) {
        toast.error(
          "That mill ID is already taken. Choose another, or switch to “Join existing”.",
        );
        form.setError("mill_id", { message: "Mill ID already exists" });
        return;
      }
      if (status === 404) {
        toast.error(
          "No mill with that ID exists yet. Check it, or switch to “New mill”.",
        );
        form.setError("mill_id", { message: "Mill ID not found" });
        return;
      }
      if (status === 400) {
        toast.error(
          "That email is already registered. Try signing in instead.",
        );
        form.setError("email", { message: "Email already registered" });
        return;
      }

      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : (detail ?? "Registration failed. Please try again.");
      toast.error(message);
    }
  };

  if (outcome === "account_created") {
    return (
      <div className="relative w-full rounded-[20px] border border-(--border) bg-(--surface) shadow-(--card-shadow) p-9">
        <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--green),transparent)]" />
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-(--green-bg) border-2 border-(--green)">
            <span className="text-xl">✉</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Check your email
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6 leading-relaxed">
            Your mill is set up and you&apos;re its admin. We&apos;ve sent a
            verification link — click it to activate your account, then sign in.
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

  if (outcome === "approval_queued") {
    return (
      <div className="relative w-full rounded-[20px] border border-(--border) bg-(--surface) shadow-(--card-shadow) p-9">
        <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--amber),transparent)]" />
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-(--amber-bg) border-2 border-(--amber)">
            <span className="text-xl">⧗</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Request submitted
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6 leading-relaxed">
            {outcomeMessage ||
              "This mill already has an admin. Your access request was sent to them for approval — you'll get an email once it's approved. Nothing is created until then."}
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-(--cyan-bg) text-(--cyan) hover:opacity-80 transition-all duration-200"
            >
              BACK TO SIGN IN
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-[20px] border border-(--border) bg-(--surface) shadow-(--card-shadow) p-9">
      <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />

      <div className="mb-6">
        <h2 className="font-sans text-[26px] font-bold text-(--text)">
          Create account
        </h2>
        <p className="font-sans text-[13px] mt-1 text-(--text-secondary)">
          Choose how you&apos;re coming aboard
        </p>
      </div>

      <div className="flex gap-1 p-1 rounded-lg border border-(--border) bg-(--bg-alt) mb-6">
        {[
          { m: "create" as Mode, label: "New mill", icon: Factory },
          { m: "join" as Mode, label: "Join existing", icon: UserPlus },
        ].map(({ m, label, icon: Icon }) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={[
              "flex-1 flex items-center justify-center gap-1.5 font-mono text-[11px] tracking-[0.06em] py-2.5 rounded-md transition-all duration-200 cursor-pointer",
              mode === m
                ? "bg-(--tab-active-bg) text-(--tab-active) font-semibold"
                : "text-(--text-muted) hover:text-(--text-secondary)",
            ].join(" ")}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
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

          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <Controller
                name="mill_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                      MILL ID
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="B"
                      aria-invalid={fieldState.invalid}
                      className="bg-(--bg-alt) border-border text-(--text) font-mono text-[13px] rounded-[10px] focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5 uppercase"
                    />
                    {mode === "create" &&
                      millId?.trim() &&
                      !fieldState.invalid && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {availability === "checking" && (
                            <>
                              <Loader2
                                size={12}
                                className="text-(--text-muted) animate-spin"
                              />
                              <span className="font-mono text-[10px] text-(--text-muted)">
                                Checking availability…
                              </span>
                            </>
                          )}
                          {availability === "available" && (
                            <>
                              <Check
                                size={12}
                                className="text-(--green)"
                                strokeWidth={2.5}
                              />
                              <span className="font-mono text-[10px] text-(--green)">
                                Available — you&apos;ll be its admin
                              </span>
                            </>
                          )}
                          {availability === "taken" && (
                            <>
                              <X
                                size={12}
                                className="text-(--red)"
                                strokeWidth={2.5}
                              />
                              <span className="font-mono text-[10px] text-(--red)">
                                Taken — switch to “Join existing”
                              </span>
                            </>
                          )}
                          {availability === "error" && (
                            <span className="font-mono text-[10px] text-(--text-muted)">
                              Couldn&apos;t check — you can still submit
                            </span>
                          )}
                        </div>
                      )}
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

            {mode === "join" && (
              <div className="w-36 shrink-0">
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
                        ROLE
                      </FieldLabel>
                      <select
                        {...field}
                        className="w-full h-13 px-3 rounded-[10px] border border-(--border) bg-(--bg-alt) text-(--text) font-mono text-[13px] outline-none focus:ring-1 focus:ring-(--cyan) focus:border-(--cyan) cursor-pointer"
                      >
                        <option value="manager">MANAGER</option>
                        <option value="admin">ADMIN</option>
                      </select>
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
            )}
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
                    className="bg-(--bg-alt) border-(--border) py-5 text-(--text) font-mono text-[13px] rounded-[10px] pr-10 focus-visible:ring-(--cyan) focus-visible:border-(--cyan)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
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
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="bg-(--bg-alt) border-(--border) text-(--text) font-mono text-[13px] rounded-[10px] pr-10 focus-visible:ring-(--cyan) focus-visible:border-(--cyan) py-5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--cyan) transition-colors duration-200"
                  >
                    {showConfirm ? (
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
            disabled={isSubmitting || submitBlocked}
            className="w-full rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 py-5"
          >
            {isSubmitting
              ? "SUBMITTING..."
              : mode === "create"
                ? "CREATE MILL & ACCOUNT"
                : "REQUEST ACCESS"}
          </Button>

          <p className="font-sans text-[12px] text-center leading-relaxed text-(--text-muted)">
            {mode === "create"
              ? "You'll become the admin of this mill and get a verification email."
              : "Your request goes to the mill's admins. You'll be emailed once approved."}
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
