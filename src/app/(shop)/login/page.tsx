import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { safeRedirect } from "@/lib/safe-redirect";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const callbackUrl = safeRedirect((await searchParams).callbackUrl);

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to see your orders and check out faster."
      footer={
        <>
          <span className="text-sm text-muted-foreground">
            New to {siteConfig().name}?{" "}
          </span>
          <Link
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-medium italic text-foreground underline underline-offset-4 text-sm hover:text-primary-foreground transition-colors duration-300"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm
        callbackUrl={callbackUrl}
        googleEnabled={!!process.env.AUTH_GOOGLE_ID}
      />
    </AuthShell>
  );
}
