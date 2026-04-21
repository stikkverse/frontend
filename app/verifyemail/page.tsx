"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/auth/NavBar";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const hasVerified = useRef(false);

  useEffect(() => {
    if (email && token && !hasVerified.current) {
      hasVerified.current = true;
      setTimeout(async () => {
        setStatus("verifying");
        try {
          await axiosInstance.post("/api/v1/auth/verify-email", { email, token });
          setStatus("success");
          setTimeout(() => router.push("/"), 3000);
        } catch (err: unknown) {
          const error = err as { response?: { data?: { detail?: string } } };
          setMessage(
            error.response?.data?.detail ?? "Verification failed. The link may have expired.",
          );
          setStatus("error");
        }
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9">
      <div className="absolute top-0 left-0 right-0 h-0.75 rounded-t-[20px] bg-[linear-gradient(90deg,transparent,var(--cyan),transparent)]" />

      {status === "idle" && !email && !token && (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center bg-(--cyan-bg) border-2 border-(--cyan)">
            <span className="text-2xl">✉</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">Check your email</h2>
          <p className="font-sans text-[13px] text-(--text-secondary) leading-relaxed mb-6">
            We sent a verification link to your email address. Click the link to activate your account.
          </p>
          <p className="font-mono text-[10px] tracking-widest text-(--text-muted) mb-6">
            Didn&apos;t get it? Check your spam folder.
          </p>
          <Link href="/">
            <Button variant="outline" className="font-mono text-[11px] tracking-widest border-border text-(--text-muted)">
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
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">Verifying...</h2>
          <p className="font-sans text-[13px] text-(--text-secondary)">Please wait while we verify your email address.</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center border-2" style={{ background: "var(--green-bg)", borderColor: "var(--green)" }}>
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">Email verified!</h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6">Your account is now active. Redirecting you to sign in...</p>
          <Link href="/">
            <Button className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 transition-all duration-200">
              GO TO SIGN IN
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center border-2" style={{ background: "var(--red-bg)", borderColor: "var(--red)" }}>
            <span className="text-2xl">✕</span>
          </div>
          <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">Verification failed</h2>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6">{message}</p>
          <Link href="/">
            <Button variant="outline" className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-(--cyan-bg) text-(--cyan) hover:opacity-80 transition-all duration-200">
              BACK TO SIGN IN
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <NavBar />
      <section className="flex justify-between flex-col lg:flex-row md:flex-row lg:w-[80%] md:w-[80%] w-[90%] mx-auto relative z-2 my-auto">
        <div className="lg:w-[46%] md:w-[46%] w-full mb-6">
          <div className="w-10 h-0.75 rounded-full bg-cyan-300 mb-6"></div>
          <h1 className="font-sans font-bold text-(--text) lg:text-[64px] md:text-[52px] text-[48px] mb-3">
            Verify email.
          </h1>
          <p className="font-sans text-[18px] leading-relaxed text-(--text-secondary)">
            One last step — confirm your email address to activate your account and access the dashboard.
          </p>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-full">
          <Suspense fallback={
            <div className="relative w-full rounded-[20px] border border-border bg-(--surface) shadow-(--card-shadow) p-9 text-center">
              <p className="font-mono text-[13px] text-(--text-muted)">Loading...</p>
            </div>
          }>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </section>
    </main>
  );
}