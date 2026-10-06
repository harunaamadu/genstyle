"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { paymentOptions } from "@/data/checkout";
import { getCountryName } from "@/data/countries";
import { localeMeta } from "@/i18n/config";
import { useFormatPrice, useLocale, useT } from "@/hooks/use-i18n";
import type { Order, OrderStatus } from "@/types/order";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";

const statusMeta: Record<
  OrderStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  pending: { label: "Processing", variant: "outline" },
  paid: { label: "Paid", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function OrdersView({ orders }: { orders: Order[] }) {
  const t = useT();
  const locale = useLocale();
  const formatPrice = useFormatPrice();

  // UTC keeps server and client output identical, so hydration never mismatches
  const formatDate = new Intl.DateTimeFormat(localeMeta[locale].tag, {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No orders yet"
        description="When you place an order, it will show up here."
        actionLabel={t.continueShopping}
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: t.orders }]} />

      <h1 className="mt-6 border-b pb-6 text-4xl font-bold tracking-tight">
        {t.orders}{" "}
        <span className="text-2xl font-normal text-muted-foreground">({orders.length})</span>
      </h1>

      <Accordion type="single" collapsible className="mt-2">
        {orders.map((order) => {
          const status = statusMeta[order.status ?? "pending"];
          const payment =
            paymentOptions.find((p) => p.value === order.paymentMethod)?.label ??
            order.paymentMethod;

          return (
            <AccordionItem key={order.orderNumber} value={order.orderNumber}>
              <AccordionTrigger className="gap-4 py-5 hover:no-underline">
                <div className="flex flex-1 flex-wrap items-center justify-between gap-x-6 gap-y-2 text-left">
                  <div className="space-y-1">
                    <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate.format(new Date(order.createdAt))}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <span className="font-semibold">{formatPrice(order.totals.total)}</span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="space-y-6 pb-6">
                <ul className="divide-y border-y">
                  {order.lines.map((line) => (
                    <li key={`${line.sku}:${line.color}`} className="flex gap-4 py-4">
                      <div className="relative size-16 shrink-0 bg-muted">
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
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

                <div className="grid gap-6 text-sm sm:grid-cols-2">
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold tracking-widest uppercase">Delivered to</h3>
                    <address className="space-y-0.5 not-italic text-muted-foreground">
                      <p className="font-medium text-foreground">
                        {order.shipping.firstName} {order.shipping.lastName}
                      </p>
                      <p>{order.shipping.address1}</p>
                      {order.shipping.address2 && <p>{order.shipping.address2}</p>}
                      <p>
                        {order.shipping.city}, {order.shipping.region}
                      </p>
                      <p>{getCountryName(order.shipping.country)}</p>
                    </address>
                    <p className="pt-3 text-muted-foreground">
                      <span className="font-medium text-foreground">{payment}</span>
                      {order.paymentDetail ? ` · ${order.paymentDetail}` : ""}
                    </p>
                  </div>

                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t.subtotal}</dt>
                      <dd>{formatPrice(order.totals.subtotal)}</dd>
                    </div>
                    {order.totals.discount > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">
                          {t.discount}
                          {order.promoCode ? ` (${order.promoCode})` : ""}
                        </dt>
                        <dd>−{formatPrice(order.totals.discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t.shipping}</dt>
                      <dd>{order.totals.shipping === 0 ? t.free : formatPrice(order.totals.shipping)}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <dt>{t.total}</dt>
                      <dd>{formatPrice(order.totals.total)}</dd>
                    </div>
                  </dl>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}