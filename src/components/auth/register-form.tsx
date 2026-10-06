"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { registerUser } from "@/actions/auth";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, fieldProps } from "@/components/shared/field";
import { AuthDivider } from "./auth-shell";
import { GoogleButton } from "./google-button";
import { PasswordInput } from "./password-input";

type RegisterFormProps = { callbackUrl: string; googleEnabled: boolean };

export function RegisterForm({ callbackUrl, googleEnabled }: RegisterFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const created = await registerUser(values);
    if (!created.ok) {
      setFormError(created.message);
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    // Account exists either way; fall back to the login page if auto sign-in fails
    router.push(result?.error ? "/login" : callbackUrl);
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

        <Field id="name" label="Full name" error={errors.name?.message}>
          <Input
            {...fieldProps("name", errors.name?.message)}
            {...register("name")}
            autoComplete="name"
          />
        </Field>

        <Field id="email" label="Email address" error={errors.email?.message}>
          <Input
            {...fieldProps("email", errors.email?.message)}
            {...register("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
          />
        </Field>

        <Field
          id="password"
          label="Password"
          error={errors.password?.message}
          hint="At least 8 characters, with a letter and a number"
        >
          <PasswordInput
            {...fieldProps("password", errors.password?.message)}
            {...register("password")}
            autoComplete="new-password"
          />
        </Field>

        <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordInput
            {...fieldProps("confirmPassword", errors.confirmPassword?.message)}
            {...register("confirmPassword")}
            autoComplete="new-password"
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full uppercase tracking-widest"
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>
    </>
  );
}