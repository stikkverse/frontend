"use client"

import { useState, useEffect, useRef } from "react";
import { authApi } from "@/lib/database/api";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VerifyEmailContent = () =>  {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const hasVerified = useRef(false);

  useEffect(() => {
    if (token && !hasVerified.current) {
      hasVerified.current = true;
      setStatus("verifying");
      authApi
        .verifyEmail(token)
        .then(() => {
          setStatus("success");
          setTimeout(() => router.push("/"), 3000);
        })
        .catch((err: unknown) => {
          const error = err as { response?: { data?: { detail?: string } } };
          setMessage(
            error.response?.data?.detail ??
              "Verification failed. The link may have expired.",
          );
          setStatus("error");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9">
      <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />
      {status === "idle" && !token && (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center bg-(--cyan-bg) border-2 border-(--cyan)">
            <span className="text-2xl">✉</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Check your email
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary) leading-relaxed mb-6">
            We sent a verification link to your email address. Click the link to
            activate your account.
          </p>
          <p className="font-mono text-[10px] tracking-widest text-(--text-muted) mb-6">
            Didn&apos;t get it? Check your spam folder.
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="font-mono text-[11px] tracking-widest border-border text-(--text-muted)"
            >
              BACK TO SIGN IN
            </Button>
          </Link>
        </div>
      )}

      {status === "verifying" && (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center bg-(--cyan-bg) border-2 border-(--cyan) animate-pulse">
            <span className="text-2xl">⟳</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Verifying...
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary)">
            Please wait while we verify your email address.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center py-4">
          <div
            className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center border-2"
            style={{
              background: "var(--green-bg)",
              borderColor: "var(--green)",
            }}
          >
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Email verified!
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6">
            Your account is now active. Redirecting you to sign in...
          </p>
          <Link href="/">
            <Button className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 transition-all duration-200">
              GO TO SIGN IN
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-center py-4">
          <div
            className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center border-2"
            style={{ background: "var(--red-bg)", borderColor: "var(--red)" }}
          >
            <span className="text-2xl">✕</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
            Verification failed
          </h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6">
            {message}
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
      )}
    </div>
  );
}

export default VerifyEmailContent