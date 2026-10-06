"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { sendContactMessage } from "@/actions/contact";
import {
  contactSchema,
  topicLabels,
  topicValues,
  type ContactInput,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldProps } from "@/components/shared/field";

const MAX_MESSAGE = 2000;

export function ContactForm() {
  const { data: session } = useSession();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "order",
      orderNumber: "",
      message: "",
      website: "",
    },
  });

  // Prefill for signed-in shoppers, without overwriting anything they've typed
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  useEffect(() => {
    if (userName && !getValues("name")) setValue("name", userName);
    if (userEmail && !getValues("email")) setValue("email", userEmail);
  }, [userName, userEmail, getValues, setValue]);

  const messageLength = watch("message").length;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await sendContactMessage(values);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setSent(true);
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-start gap-4 border p-8"
        >
          <span className="flex size-12 items-center justify-center bg-primary text-primary-foreground">
            <CheckCircle2 className="size-6" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Message sent</h2>
          <p className="text-muted-foreground">
            Thanks for reaching out. We usually reply within one working day.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              setSent(false);
            }}
          >
            Send another message
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-5"
        >
          {formError && (
            <p role="alert" className="border border-destructive bg-destructive/10 p-3 text-sm">
              {formError}
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Your name" error={errors.name?.message}>
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

            <Field id="topic" label="What's it about?" error={errors.topic?.message}>
              <Controller
                control={control}
                name="topic"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      {...fieldProps("topic", errors.topic?.message)}
                      onBlur={field.onBlur}
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {topicValues.map((value) => (
                        <SelectItem key={value} value={value}>
                          {topicLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field
              id="orderNumber"
              label="Order number (optional)"
              error={errors.orderNumber?.message}
              hint="e.g. FS-1A2B3C4D"
            >
              <Input
                {...fieldProps("orderNumber", errors.orderNumber?.message)}
                {...register("orderNumber")}
                autoComplete="off"
                className="uppercase placeholder:normal-case"
              />
            </Field>
          </div>

          <Field id="message" label="Message" error={errors.message?.message}>
            <Textarea
              {...fieldProps("message", errors.message?.message)}
              {...register("message")}
              rows={6}
              maxLength={MAX_MESSAGE}
            />
            <p className="text-right text-xs text-muted-foreground tabular-nums">
              {messageLength} / {MAX_MESSAGE}
            </p>
          </Field>

          {/* Honeypot: hidden from people and screen readers, tempting to bots */}
          <div aria-hidden className="absolute -left-2499.75 h-0 w-0 overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 w-full uppercase tracking-widest sm:w-auto"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Send message
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}