"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Banknote, CreditCard, Info, Smartphone, type LucideIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { momoNetworks, paymentOptions } from "@/data/checkout";
import type { CheckoutInput } from "@/lib/validations/checkout";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, fieldProps } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { StepHeading } from "./step-heading";

const icons: Record<string, LucideIcon> = {
  card: CreditCard,
  momo: Smartphone,
  cod: Banknote,
};

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const panel = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2 },
} as const;

export function PaymentStep() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutInput>();

  const method = watch("paymentMethod");

  return (
    <div className="space-y-6">
      <StepHeading title="Payment" description="All transactions are secure and encrypted." />

      <Controller
        control={control}
        name="paymentMethod"
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid gap-3"
            aria-label="Payment method"
          >
            {paymentOptions.map((option) => {
              const Icon = icons[option.value];
              const selected = field.value === option.value;
              return (
                <Label
                  key={option.value}
                  htmlFor={`pm-${option.value}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 border p-4 transition-colors",
                    selected ? "border-primary bg-primary/5" : "hover:bg-accent"
                  )}
                >
                  <RadioGroupItem value={option.value} id={`pm-${option.value}`} />
                  <Icon className="size-5 shrink-0 text-muted-foreground" />
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </Label>
              );
            })}
          </RadioGroup>
        )}
      />

      <AnimatePresence initial={false} mode="wait">
        {method === "card" && (
          <motion.div key="card" {...panel} className="overflow-hidden">
            <div className="space-y-5 px-0.5 pb-0.5">
              <div className="flex gap-3 border bg-secondary/50 p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" />
                <p>
                  Demo checkout: no payment is taken. Try 4242 4242 4242 4242 with any
                  future date and any code.
                </p>
              </div>

              <Field id="cardName" label="Name on card" error={errors.cardName?.message}>
                <Controller
                  control={control}
                  name="cardName"
                  render={({ field }) => (
                    <Input
                      {...field}
                      {...fieldProps("cardName", errors.cardName?.message)}
                      autoComplete="cc-name"
                    />
                  )}
                />
              </Field>

              <Field id="cardNumber" label="Card number" error={errors.cardNumber?.message}>
                <Controller
                  control={control}
                  name="cardNumber"
                  render={({ field }) => (
                    <Input
                      {...field}
                      {...fieldProps("cardNumber", errors.cardNumber?.message)}
                      onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="4242 4242 4242 4242"
                      maxLength={23}
                    />
                  )}
                />
              </Field>

              <div className="grid grid-cols-2 gap-5">
                <Field id="cardExpiry" label="Expiry" error={errors.cardExpiry?.message}>
                  <Controller
                    control={control}
                    name="cardExpiry"
                    render={({ field }) => (
                      <Input
                        {...field}
                        {...fieldProps("cardExpiry", errors.cardExpiry?.message)}
                        onChange={(e) => field.onChange(formatExpiry(e.target.value))}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    )}
                  />
                </Field>

                <Field id="cardCvc" label="Security code" error={errors.cardCvc?.message}>
                  <Controller
                    control={control}
                    name="cardCvc"
                    render={({ field }) => (
                      <Input
                        {...field}
                        {...fieldProps("cardCvc", errors.cardCvc?.message)}
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        maxLength={4}
                      />
                    )}
                  />
                </Field>
              </div>
            </div>
          </motion.div>
        )}

        {method === "momo" && (
          <motion.div key="momo" {...panel} className="overflow-hidden">
            <div className="grid gap-5 px-0.5 pb-0.5 sm:grid-cols-2">
              <Field id="momoNetwork" label="Network" error={errors.momoNetwork?.message}>
                <Controller
                  control={control}
                  name="momoNetwork"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        {...fieldProps("momoNetwork", errors.momoNetwork?.message)}
                        onBlur={field.onBlur}
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {momoNetworks.map((n) => (
                          <SelectItem key={n.value} value={n.value}>
                            {n.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field
                id="momoNumber"
                label="Mobile Money number"
                error={errors.momoNumber?.message}
                hint="You'll get a prompt on your phone to approve"
              >
                <Controller
                  control={control}
                  name="momoNumber"
                  render={({ field }) => (
                    <Input
                      {...field}
                      {...fieldProps("momoNumber", errors.momoNumber?.message)}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="024 123 4567"
                    />
                  )}
                />
              </Field>
            </div>
          </motion.div>
        )}

        {method === "cod" && (
          <motion.p
            key="cod"
            {...panel}
            className="overflow-hidden text-sm text-muted-foreground"
          >
            Pay the courier in cash or Mobile Money when your order arrives.
          </motion.p>
        )}
      </AnimatePresence>

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field }) => (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                aria-invalid={!!errors.acceptTerms}
                className="mt-0.5"
              />
              <Label htmlFor="acceptTerms" className="font-normal leading-snug">
                I agree to the terms of service and privacy policy.
              </Label>
            </div>
            {errors.acceptTerms && (
              <p role="alert" className="text-sm text-destructive">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}