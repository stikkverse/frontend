"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SuperadminAuthProvider from "@/context/SuperAdAuthProvider";

export default function SuperadminRootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { staleTime: 10_000, retry: 2, refetchOnWindowFocus: false },
        mutations: { retry: 0 },
      },
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SuperadminAuthProvider>
        {children}
      </SuperadminAuthProvider>
    </QueryClientProvider>
  );
}