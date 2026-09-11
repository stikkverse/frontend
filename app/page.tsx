import LoginForm from "@/components/auth/LogInForm";
import NavBar from "@/components/auth/NavBar";
import { Activity, Bell, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="w-full min-h-screen flex  flex-col relative z-2">
      <NavBar />
      <section className="flex justify-between flex-col lg:flex-row md:flex-row lg:w-[80%] md:w-[80%] w-[90%] mx-auto  my-auto">
        <div className="lg:w-[46%] md:w-[46%] w-full mb-6">
          <div className="w-10 h-0.75 rounded-full bg-cyan-300 mb-6" />
          <h1 className="font-sans font-bold text-(--text) lg:text-[64px] md:text-[52px] text-[48px] mb-3">
            Welcome back.
          </h1>
          <p className="font-sans text-[18px] leading-relaxed text-(--text-secondary) mb-8">
            Good to see you again. Your mill&apos;s energy, bearing health, and
            carbon footprint are right where you left them.
          </p>

          <div className="lg:flex md:flex flex-col gap-4 max-w-105 hidden">
            <div className="flex items-start gap-3">
              <Activity size={18} className="text-(--cyan) shrink-0 mt-0.5" />
              <p className="font-sans text-[14px] text-(--text-secondary) leading-relaxed">
                Live machine vitals and health scores, updated as new data comes
                in.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Bell size={18} className="text-(--amber) shrink-0 mt-0.5" />
              <p className="font-sans text-[14px] text-(--text-secondary) leading-relaxed">
                Alerts waiting for you if anything needs attention since your
                last visit.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="text-(--green) shrink-0 mt-0.5"
              />
              <p className="font-sans text-[14px] text-(--text-secondary) leading-relaxed">
                Prefer no password? Use the magic link and we&apos;ll email you
                a way in.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-full">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
