import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { safeRedirect } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const callbackUrl = safeRedirect((await searchParams).callbackUrl);

  return (
    <AuthShell
      title="Create your account"
      description="Save your details and track every order."
      footer={
        <>
          <span className="text-sm text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium italic text-foreground underline underline-offset-4 text-sm hover:text-primary-foreground transition-colors duration-300"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm
        callbackUrl={callbackUrl}
        googleEnabled={!!process.env.AUTH_GOOGLE_ID}
      />
    </AuthShell>
  );
}
