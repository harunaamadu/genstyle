"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { AuthSessionProvider } from "./session-provider";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <AuthSessionProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthSessionProvider>
    </NextThemesProvider>
  );
}
