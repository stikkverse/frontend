"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/auth/NavBar";

function ApproveContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This approval link is missing its token.");
      return;
    }
    if (hasRun.current) return;
    hasRun.current = true;

    authApi
      .approveMillAccess(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message ?? "Access request approved.");
      })
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { detail?: string } } };
        setMessage(
          error.response?.data?.detail ??
            "This approval link is invalid, expired, or already used.",
        );
        setStatus("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const config = {
    verifying: {
      icon: "⟳",
      color: "cyan",
      title: "Approving request...",
      spin: true,
    },
    success: {
      icon: "✓",
      color: "green",
      title: "Access approved",
      spin: false,
    },
    error: { icon: "✕", color: "red", title: "Approval failed", spin: false },
  }[status];

  return (
    <div className="relative w-full rounded-[20px] border border-(--border) bg-(--surface) shadow-(--card-shadow) p-9 text-center py-8">
      <div
        className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center border-2 bg-(--${config.color}-bg) border-(--${config.color}) ${config.spin ? "animate-pulse" : ""}`}
      >
        <span className="text-xl">{config.icon}</span>
      </div>
      <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
        {config.title}
      </h2>
      {status === "verifying" ? (
        <p className="font-sans text-[13px] text-(--text-secondary)">
          Confirming the access request. One moment.
        </p>
      ) : (
        <>
          <p className="font-sans text-[13px] text-(--text-secondary) mb-6 leading-relaxed">
            {status === "success"
              ? `${message} The member can now sign in to the mill dashboard.`
              : message}
          </p>
          <Link href={status === "success" ? "/dashboard/team" : "/dashboard"}>
            <Button className="w-full py-5 rounded-[10px] font-mono text-[12px] font-semibold tracking-widest border border-(--cyan) bg-[linear-gradient(135deg,var(--cyan),#818cf8)] text-white shadow-[0_0_24px_var(--cyan-glow)] hover:opacity-90 transition-all duration-200">
              {status === "success" ? "GO TO TEAM" : "BACK TO DASHBOARD"}
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default function ApproveMillAccessPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <NavBar />
      <section className="flex justify-center w-[90%] max-w-[440px] mx-auto relative z-2 my-auto">
        <div className="w-full">
          <Suspense
            fallback={
              <div className="relative w-full rounded-[20px] border border-(--border) bg-(--surface) shadow-(--card-shadow) p-9 text-center">
                <p className="font-mono text-[13px] text-(--text-muted)">
                  Loading...
                </p>
              </div>
            }
          >
            <ApproveContent />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
