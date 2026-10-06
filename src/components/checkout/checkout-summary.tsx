"use client";

import Image from "next/image";
import { useFormatPrice } from "@/hooks/use-i18n";
import { useCartStore } from "@/store/cart-store";
import { OrderSummary } from "@/components/cart/order-summary";

export function CheckoutSummary() {
  const formatPrice = useFormatPrice();
  const items = useCartStore((s) => s.items);

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <ul className="divide-y border-y">
        {items.map((item) => (
          <li key={item.lineId} className="flex gap-4 py-4">
            <div className="relative size-16 shrink-0 bg-muted">
              <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
              <span className="absolute -top-2 -right-2 z-10 flex size-5 items-center justify-center bg-foreground text-[10px] font-semibold text-background">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 items-start justify-between gap-3 text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">
                  {item.color} · {item.size}
                </p>
              </div>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>

      <OrderSummary showCheckout={false} />
    </div>
  );
}