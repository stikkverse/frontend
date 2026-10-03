"use client";

import NavBar from "@/components/auth/NavBar";
import { Mail, Clock, KeyRound } from "lucide-react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

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
