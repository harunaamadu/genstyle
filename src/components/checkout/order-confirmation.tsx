"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, PackageSearch } from "lucide-react";
import { getCountryName } from "@/data/countries";
import { paymentOptions } from "@/data/checkout";
import { useFormatPrice, useT } from "@/hooks/use-i18n";
import { useMounted } from "@/hooks/use-mounted";
import { useOrderStore } from "@/store/order-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

const nextSteps = [
  "We've emailed your confirmation and receipt.",
  "We'll message you as soon as your order ships.",
  "Delivery usually takes 2 to 5 working days.",
];

export function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
  const mounted = useMounted();
  const t = useT();
  const formatPrice = useFormatPrice();
  const order = useOrderStore((s) => s.orders.find((o) => o.orderNumber === orderNumber));

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-16">
        <Skeleton className="mx-auto size-16" />
        <Skeleton className="mx-auto h-10 w-2/3" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="We couldn't find that order"
        description="Orders are saved on the device you checked out with."
        actionLabel={t.continueShopping}
        actionHref="/shop"
      />
    );
  }

  const { shipping, totals } = order;
  const paymentLabel =
    paymentOptions.find((p) => p.value === order.paymentMethod)?.label ?? order.paymentMethod;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="space-y-4 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="mx-auto flex size-16 items-center justify-center bg-primary text-primary-foreground"
        >
          <Check className="size-8" />
        </motion.span>
        <h1 className="text-4xl font-bold tracking-tight">Thank you, {shipping.firstName}!</h1>
        <p className="text-muted-foreground">
          Order <span className="font-mono font-semibold text-foreground">{order.orderNumber}</span>{" "}
          is confirmed. A receipt is on its way to {order.email}.
        </p>
      </div>

      <div className="mt-10 space-y-6 border p-6">
        <ul className="divide-y">
          {order.lines.map((line) => (
            <li key={`${line.sku}:${line.color}`} className="flex gap-4 py-4 first:pt-0">
              <div className="relative size-16 shrink-0 bg-muted">
                <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex flex-1 items-start justify-between gap-3 text-sm">
                <div>
                  <Link
                    href={`/product/${line.slug}`}
                    className="font-medium transition-colors hover:text-primary"
                  >
                    {line.name}
                  </Link>
                  <p className="text-muted-foreground">
                    {line.color} · {line.size} · Qty {line.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(line.price * line.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>

        <Separator />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t.subtotal}</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {t.discount}
                {order.promoCode ? ` (${order.promoCode})` : ""}
              </dt>
              <dd>−{formatPrice(totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t.shipping}</dt>
            <dd>{totals.shipping === 0 ? t.free : formatPrice(totals.shipping)}</dd>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between text-base font-bold">
            <dt>{t.total}</dt>
            <dd>{formatPrice(totals.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 border p-6 text-sm">
          <h2 className="text-xs font-semibold tracking-widest uppercase">Delivering to</h2>
          <address className="space-y-0.5 not-italic text-muted-foreground">
            <p className="font-medium text-foreground">
              {shipping.firstName} {shipping.lastName}
            </p>
            <p>{shipping.address1}</p>
            {shipping.address2 && <p>{shipping.address2}</p>}
            <p>
              {shipping.city}, {shipping.region}
              {shipping.postalCode ? ` ${shipping.postalCode}` : ""}
            </p>
            <p>{getCountryName(shipping.country)}</p>
            <p>{shipping.phone}</p>
          </address>
        </div>

        <div className="space-y-2 border p-6 text-sm">
          <h2 className="text-xs font-semibold tracking-widest uppercase">Payment</h2>
          <p className="font-medium">{paymentLabel}</p>
          {order.paymentDetail && (
            <p className="text-muted-foreground">{order.paymentDetail}</p>
          )}
        </div>
      </div>

      <ul className="mt-6 space-y-2 bg-secondary/50 p-6 text-sm text-muted-foreground">
        {nextSteps.map((line) => (
          <li key={line} className="flex gap-3">
            <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="uppercase tracking-widest">
          <Link href="/shop">{t.continueShopping}</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="uppercase tracking-widest">
          <Link href="/orders">{t.orders}</Link>
        </Button>
      </div>
    </div>
  );
}