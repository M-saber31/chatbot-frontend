"use client";

import { type PropsWithChildren } from "react";
import { ThemeProvider } from "~/components/core/theme/ThemeProvider";

export function ClientProviders({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
