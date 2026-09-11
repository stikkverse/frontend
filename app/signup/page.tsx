import NavBar from "@/components/auth/NavBar";
import SignupForm from "@/components/auth/SignupForm";
import { Suspense } from "react";
import Link from "next/link";
import { Factory, UserPlus } from "lucide-react";

export default function SignupPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <NavBar />
      <section className="flex justify-between items-center flex-col lg:flex-row md:flex-row lg:w-[80%] md:w-[80%] w-[90%] mx-auto relative z-2 my-auto">
        <div className="lg:w-[46%] md:w-[46%] w-full mb-6">
          <div className="w-10 h-0.75 rounded-full bg-cyan-300 mb-6" />
          <h1 className="font-sans font-bold text-(--text) lg:text-[64px] md:text-[52px] text-[48px] mb-3">
            Get started.
          </h1>
          <p className="font-sans text-[18px] leading-relaxed text-(--text-secondary) mb-8">
            Two ways to come aboard — pick the one that fits, and we&apos;ll
            take it from there.
          </p>

          <div className="lg:flex md:flex hidden flex-col gap-5 ">
            <div className="rounded-[14px] border border-border bg-(--surface) p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-(--cyan-bg) border border-(--cyan) shrink-0">
                  <Factory size={15} className="text-(--cyan)" />
                </div>
                <p className="font-mono text-[11px] font-semibold tracking-[0.08em] text-(--cyan)">
                  NEW MILL
                </p>
              </div>
              <p className="font-sans text-[13px] text-(--text-secondary) leading-relaxed">
                Enter a mill ID no one&apos;s claimed yet and you become its
                admin. We&apos;ll email a verification link, and you&apos;re in
                — ready to invite your team.
              </p>
            </div>

            <div className="rounded-[14px] border border-border bg-(--surface) p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-(--amber-bg) border border-(--amber) shrink-0">
                  <UserPlus size={15} className="text-(--amber)" />
                </div>
                <p className="font-mono text-[11px] font-semibold tracking-[0.08em] text-(--amber)">
                  JOINING AN EXISTING MILL
                </p>
              </div>
              <p className="font-sans text-[13px] text-(--text-secondary) leading-relaxed">
                Use a mill ID that already exists and we&apos;ll send your
                request to its admins. Once one of them approves, you&apos;ll
                get an email and can sign in.
              </p>
            </div>

            <p className="font-sans text-[12px] text-(--text-muted) leading-relaxed">
              Already added by an admin? You don&apos;t need to sign up — just{" "}
              <Link href="/" className="text-(--cyan) hover:underline">
                sign in
              </Link>{" "}
              with the details they gave you.
            </p>
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-full">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
