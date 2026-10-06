"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { useFormatPrice, useT } from "@/hooks/use-i18n";
import { computeTotals } from "@/lib/cart";
import { interpolate } from "@/lib/format";
import { promoSchema } from "@/lib/validations/cart";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function OrderSummary({ showCheckout = true }: { showCheckout?: boolean }) {
  const t = useT();
  const formatPrice = useFormatPrice();

  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);

  const totals = useMemo(() => computeTotals(items, promoCode), [items, promoCode]);

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = promoSchema.safeParse({ code });

    if (!parsed.success || !applyPromo(parsed.data.code)) {
      setError(t.promoInvalid);
      return;
    }

    setError(null);
    setCode("");
    toast.success(t.promoApplied);
  }

  const unlocked = totals.remainingForFreeShipping === 0;

  return (
    <aside className="space-y-6 bg-secondary/50 p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold tracking-tight">{t.orderSummary}</h2>

      {/* Free shipping progress */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          {unlocked
            ? t.freeShippingUnlocked
            : interpolate(t.freeShippingAway, {
                amount: formatPrice(totals.remainingForFreeShipping),
              })}
        </p>
        <Progress value={totals.freeShippingProgress} aria-label="Free shipping progress" />
      </div>

      <Separator />

      {/* Promo code */}
      {totals.promo ? (
        <div className="flex items-center justify-between gap-2 border border-primary bg-primary/10 px-3 py-2 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <Check className="size-4" />
            {totals.promo.code}
            <span className="font-normal text-muted-foreground">
              (−{totals.promo.percent}%)
            </span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={removePromo}
            aria-label={t.remove}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <form onSubmit={handleApply} noValidate className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t.promoPlaceholder}
                aria-label={t.promoPlaceholder}
                aria-invalid={!!error}
                className="bg-background pl-9 uppercase placeholder:normal-case"
              />
            </div>
            <Button type="submit" variant="outline">
              {t.applyPromo}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      )}

      {/* Totals */}
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.subtotal}</dt>
          <dd className="font-medium">{formatPrice(totals.subtotal)}</dd>
        </div>

        {totals.discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t.discount}</dt>
            <dd className="font-medium text-primary-foreground dark:text-primary">
              −{formatPrice(totals.discount)}
            </dd>
          </div>
        )}

        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.shipping}</dt>
          <dd className="font-medium">
            {totals.shipping === 0 ? t.free : formatPrice(totals.shipping)}
          </dd>
        </div>

        <Separator />

        <div className="flex justify-between text-base font-bold">
          <dt>{t.total}</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {showCheckout && (
        <div className="space-y-2">
          <Button asChild size="lg" className="h-12 w-full uppercase tracking-widest">
            <Link href="/checkout">{t.checkout}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/shop">{t.continueShopping}</Link>
          </Button>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">{t.secureCheckout}</p>
    </aside>
  );
}