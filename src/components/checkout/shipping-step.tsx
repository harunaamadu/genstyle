"use client";

import { Controller, useFormContext } from "react-hook-form";
import { countries } from "@/data/countries";
import type { CheckoutInput } from "@/lib/validations/checkout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, fieldProps } from "@/components/shared/field";
import { StepHeading } from "./step-heading";

export function ShippingStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CheckoutInput>();

  return (
    <div className="space-y-6">
      <StepHeading title="Delivery" description="Where should we send your order?" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName?.message}>
          <Input
            {...fieldProps("firstName", errors.firstName?.message)}
            {...register("firstName")}
            autoComplete="given-name"
          />
        </Field>

        <Field id="lastName" label="Last name" error={errors.lastName?.message}>
          <Input
            {...fieldProps("lastName", errors.lastName?.message)}
            {...register("lastName")}
            autoComplete="family-name"
          />
        </Field>

        <Field
          id="phone"
          label="Phone"
          error={errors.phone?.message}
          hint="For delivery updates"
          className="sm:col-span-2"
        >
          <Input
            {...fieldProps("phone", errors.phone?.message)}
            {...register("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+233 24 123 4567"
          />
        </Field>

        <Field
          id="country"
          label="Country"
          error={errors.country?.message}
          className="sm:col-span-2"
        >
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  {...fieldProps("country", errors.country?.message)}
                  onBlur={field.onBlur}
                  className="w-full"
                >
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field
          id="address1"
          label="Street address"
          error={errors.address1?.message}
          className="sm:col-span-2"
        >
          <Input
            {...fieldProps("address1", errors.address1?.message)}
            {...register("address1")}
            autoComplete="address-line1"
          />
        </Field>

        <Field
          id="address2"
          label="Apartment, landmark, etc. (optional)"
          error={errors.address2?.message}
          className="sm:col-span-2"
        >
          <Input
            {...fieldProps("address2", errors.address2?.message)}
            {...register("address2")}
            autoComplete="address-line2"
          />
        </Field>

        <Field id="city" label="City / town" error={errors.city?.message}>
          <Input
            {...fieldProps("city", errors.city?.message)}
            {...register("city")}
            autoComplete="address-level2"
          />
        </Field>

        <Field id="region" label="Region / state" error={errors.region?.message}>
          <Input
            {...fieldProps("region", errors.region?.message)}
            {...register("region")}
            autoComplete="address-level1"
          />
        </Field>

        <Field
          id="postalCode"
          label="Postal code or digital address (optional)"
          error={errors.postalCode?.message}
          hint="Ghana: e.g. GA-123-4567"
          className="sm:col-span-2"
        >
          <Input
            {...fieldProps("postalCode", errors.postalCode?.message)}
            {...register("postalCode")}
            autoComplete="postal-code"
          />
        </Field>
      </div>
    </div>
  );
}