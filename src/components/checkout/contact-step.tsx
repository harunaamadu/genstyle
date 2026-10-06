"use client";

import Link from "next/link";
import { Controller, useFormContext } from "react-hook-form";
import type { CheckoutInput } from "@/lib/validations/checkout";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, fieldProps } from "@/components/shared/field";
import { StepHeading } from "./step-heading";

export function ContactStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CheckoutInput>();

  return (
    <div className="space-y-6">
      <StepHeading
        title="Contact"
        description="We'll send your order confirmation here."
      />

      <Field id="email" label="Email address" error={errors.email?.message}>
        <Input
          {...fieldProps("email", errors.email?.message)}
          {...register("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
      </Field>

      <Controller
        control={control}
        name="newsletter"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Checkbox
              id="newsletter"
              checked={field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
            />
            <Label htmlFor="newsletter" className="font-normal">
              Email me news and offers
            </Label>
          </div>
        )}
      />

      {status !== "authenticated" && ( // deprecated, but still works for now
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
