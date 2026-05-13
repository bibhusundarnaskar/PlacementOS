"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        {children}
        <Toaster richColors closeButton />
      </ThemeProvider>
    </ClerkProvider>
  );
}
