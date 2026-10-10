import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-(--bg) px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-[10px] tracking-[0.3em] text-(--text-muted)">
          SIGNAL LOST
        </p>
        <p className="font-mono text-[80px] font-bold leading-none text-(--cyan) drop-shadow-[0_0_20px_var(--cyan-glow)] sm:text-[110px]">
          404
        </p>
      </div>
      <div className="w-full max-w-100 overflow-hidden rounded-[8px] border border-border bg-(--surface) px-4 py-5">
        <svg
          viewBox="0 0 300 40"
          className="h-10 w-full text-(--red)"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M0 20 L120 20 L132 20 L140 8 L150 32 L160 20 L300 20" />
        </svg>
        <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-(--text-muted)">
          NO READING ON THIS CHANNEL
        </p>
      </div>
      <div className="flex max-w-125 flex-col gap-2">
        <h1 className="font-sans text-[22px] font-bold text-(--text)">
          This page is off the grid
        </h1>
        <p className="font-sans text-[14px] leading-relaxed text-(--text-secondary)">
          The page you are looking for does not exist, has moved, or was never
          wired up. Check the address, or head back to a monitored route.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-[8px] border border-(--cyan) bg-(--cyan-bg) px-5 py-2.5 font-mono text-[12px] font-semibold tracking-[0.06em] text-(--cyan) transition-colors duration-150 hover:bg-(--cyan) hover:text-(--bg)"
        >
          BACK TO DASHBOARD
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[8px] border border-border bg-(--surface) px-5 py-2.5 font-mono text-[12px] font-semibold tracking-[0.06em] text-(--text-secondary) transition-colors duration-150 hover:border-(--cyan) hover:text-(--text)"
        >
          SIGN IN
        </Link>
      </div>
    </div>
  );
}
