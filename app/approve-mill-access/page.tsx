"use client";

import { Suspense } from "react";
import ApproveContent from "@/components/dashboard/mill/ApproveContent";
import NavBar from "@/components/auth/NavBar";



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
