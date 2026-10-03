"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/authContext";
import { authApi } from "@/lib/database/api";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/auth/NavBar";

function MagicLoginContent() {
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"verifying" | "error">("verifying");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This magic link is missing its token.");
      return;
    }
    if (hasRun.current) return;
    hasRun.current = true;

    authApi
      .magicLogin(token)
      .then((res) => loginWithToken(res.access_token, res.api_key, res.mill_id))
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { detail?: string } } };
        setMessage(
          error.response?.data?.detail ??
            "This magic link is invalid or has expired.",
        );
        setStatus("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "error") {
    return (
      <div className="relative w-full rounded-[20px] border border-border  bg-(--surface) shadow-(--card-shadow) p-9 text-center py-8">
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-(--red-bg) border-2 border-(--red)">
          <span className="text-xl">✕</span>
        </div>
        <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
          Sign-in failed
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
    );
  }

  return (
    <div className="relative w-full rounded-[20px] border border-border  bg-(--surface) shadow-(--card-shadow) p-9 text-center py-8">
      <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-(--cyan-bg) border-2 border-(--cyan) animate-pulse">
        <span className="text-xl">⟳</span>
      </div>
      <h2 className="font-sans text-[22px] font-bold text-(--text) mb-2">
        Signing you in...
      </h2>
      <p className="font-sans text-[13px] text-(--text-secondary)">
        One moment while we verify your magic link.
      </p>
    </div>
  );
}

export default function MagicLoginPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <NavBar />
      <section className="flex justify-center w-[90%] max-w-110 mx-auto relative z-2 my-auto">
        <div className="w-full">
          <Suspense
            fallback={
              <div className="relative w-full rounded-[20px] border border-border  bg-(--surface) shadow-(--card-shadow) p-9 text-center">
                <p className="font-mono text-[13px] text-(--text-muted)">
                  Loading...
                </p>
              </div>
            }
          >
            <MagicLoginContent />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
