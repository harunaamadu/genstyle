"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "../shared/google-icon";

export function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={() => signIn("google", { callbackUrl })}
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
