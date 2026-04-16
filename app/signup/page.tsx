import NavBar from "@/components/auth/NavBar";
import SignupForm from "@/components/auth/SignupForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
        <NavBar />
      <section className="flex justify-between flex-col lg:flex-row md:flex-row lg:w-[80%] md:w-[80%] w-[90%] mx-auto relative z-2 my-auto">
        <div className="lg:w-[46%] md:w-[46%] w-full mb-6">
          <div className="w-10 h-0.75 rounded-full bg-cyan-300 mb-6"></div>
          <h1 className="font-sans font-bold text-(--text) lg:text-[64px] md:text-[52px] text-[48px] mb-3">
            Get started.
          </h1>
          <p className="font-sans text-[18px] leading-relaxed text-(--text-secondary)">
            Set up your company profile and start monitoring your machines in
            real time.
          </p>
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
