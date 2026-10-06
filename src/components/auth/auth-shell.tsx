import type { ReactNode } from "react";
import { Marker, MarkerContent } from "../ui/marker";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-md flex-col justify-center px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="mt-8 space-y-6">{children}</div>
      <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
    </div>
  );
}

export function AuthDivider() {
  return (
    <Marker variant="separator">
      <MarkerContent>or</MarkerContent>
    </Marker>
  );
}
