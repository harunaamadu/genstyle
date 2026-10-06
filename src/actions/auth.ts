"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";

type RegisterResult = { ok: true } | { ok: false; message: string };

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return { ok: false, message: "An account with that email already exists. Try signing in." };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.user.create({ data: { name, email, passwordHash } });
    return { ok: true };
  } catch (error) {
    console.error("registerUser failed", error);
    return { ok: false, message: "We couldn't create your account. Please try again." };
  }
}