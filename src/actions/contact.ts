"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";

type ContactResult = { ok: true } | { ok: false; message: string };

const MAX_PER_HOUR = 3;

export async function sendContactMessage(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields and try again." };
  }

  const { website, ...data } = parsed.data;

  // Honeypot filled in: pretend it worked so bots learn nothing
  if (website) return { ok: true };

  try {
    // Rate limit lives in the database, so it works across serverless instances
    const recent = await db.contactMessage.count({
      where: { email: data.email, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    if (recent >= MAX_PER_HOUR) {
      return {
        ok: false,
        message: "You've sent a few messages recently. We'll reply soon, so please wait a while before sending another.",
      };
    }

    const session = await auth();

    await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        topic: data.topic,
        orderNumber: data.orderNumber || null,
        message: data.message,
        userId: session?.user?.id ?? null,
      },
    });

    // TODO: notify your team (e.g. an email through Resend) and send an auto-reply
    return { ok: true };
  } catch (error) {
    console.error("sendContactMessage failed", error);
    return { ok: false, message: "We couldn't send your message. Please try again." };
  }
}