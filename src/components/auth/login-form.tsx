"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, fieldProps } from "@/components/shared/field";
import { AuthDivider } from "./auth-shell";
import { GoogleButton } from "./google-button";
import { PasswordInput } from "./password-input";

type LoginFormProps = { callbackUrl: string; googleEnabled: boolean };

export function LoginForm({ callbackUrl, googleEnabled }: LoginFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await signIn("credentials", { ...values, redirect: false });

    if (!result || result.error) {
      setFormError("Incorrect email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <>
      {googleEnabled && (
        <>
          <GoogleButton callbackUrl={callbackUrl} />
          <AuthDivider />
        </>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && (
          <p role="alert" className="border border-destructive bg-destructive/10 p-3 text-sm">
            {formError}
          </p>
        )}

        <Field id="email" label="Email address" error={errors.email?.message}>
          <Input
            {...fieldProps("email", errors.email?.message)}
            {...register("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
          />
        </Field>

        <Field id="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            {...fieldProps("password", errors.password?.message)}
            {...register("password")}
            autoComplete="current-password"
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full uppercase tracking-widest"
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
    </>
  );
}