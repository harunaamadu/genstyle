"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    setStatus("loading");

    // TODO (Step 6): POST result.data to /api/newsletter and store with Prisma
    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus("done");
    setEmail("");
    toast.success("You're on the list");
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "done" ? (
        <motion.p
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-lg font-semibold"
        >
          Thanks for subscribing! Your 25% code is on its way.
        </motion.p>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-2"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              aria-invalid={!!error}
              className="h-11 bg-background text-foreground"
            />
            <Button
              type="submit"
              size="lg"
              disabled={status === "loading"}
              className="h-11 bg-foreground text-background uppercase tracking-widest hover:bg-foreground/90"
            >
              {status === "loading" ? "Joining..." : "Subscribe"}
            </Button>
          </div>
          {error && <p className="text-sm font-medium">{error}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  );
}