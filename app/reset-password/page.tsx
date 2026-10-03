"use client";

import { Suspense } from "react";
import NavBar from "@/components/auth/NavBar";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

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
