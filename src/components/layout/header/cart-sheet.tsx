"use client";

import Image from "next/image";
import Link from "next/link";
import { InfoIcon, Minus, Plus, Trash2 } from "lucide-react";
import { useFormatPrice, useT } from "@/hooks/use-i18n";
import {
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "cn";
import { siteConfig } from "@/data/site-config";

export function CartSheet() {
  const { items, isOpen, setOpen, closeCart, updateQuantity, removeItem } =
    useCartStore();
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);

  const formatPrice = useFormatPrice();

  // ... inside your component definition ...
  // Assuming you already have a state like: const [open, setOpen] = useState(false);

  const [showTutorial, setShowTutorial] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const t = useT();

  useEffect(() => {
    if (isOpen) {
      // 1. Reset state whenever the modal opens
      setShowTutorial(true);
      setIsFading(false);

      // 2. Start the fade transition after 5 seconds
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 5000);

      // 3. Completely unmount the element after the CSS transition ends (300ms duration)
      const removeTimer = setTimeout(() => {
        setShowTutorial(false);
      }, 5300);

      // Clean up timers if the modal closes before the 5 seconds are up
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart ({count})</SheetTitle>
          <SheetDescription className="sr-only">
            Items in your cart
          </SheetDescription>
        </SheetHeader>

        {/* Tutorial */}
        {showTutorial && (
          <div
            className={cn(
              "flex items-start gap-1 lg:hidden text-[10px] text-sky-500 dark:text-sky-300 p-4 py-1 tracking-tight leading-tight",
              "transition-opacity duration-300 ease-in-out",
              isFading ? "opacity-0" : "opacity-100",
              items.length === 0 && "items-center",
            )}
          >
            <InfoIcon className="size-4 inline-block mr-1" />
            <p>
              <span>
                {items.length > 0
                  ? "Click on the product image to remove an item from your cart. "
                  : "Added items will appear here."}
              </span>
            </p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="relative size-36 aspect-square">
              <Image
                src={siteConfig().emptyCartImage}
                alt="Empty cart"
                fill
                sizes="80px"
                aria-hidden
                className="object-cover"
              />
            </div>
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild onClick={closeCart}>
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-4">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-4 py-4">
                  <div className="relative group size-20 shrink-0 overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />

                    <Button
                      variant="destructive"
                      size="icon-sm"
                      className="absolute inset-0 m-auto opacity-0 transition-opacity group-hover:opacity-100 z-10"
                      onClick={() => removeItem(item.lineId)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium leading-tight truncate">
                        {item.name}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {item.color} · {item.size}
                    </p>

                    <p className="text-xs font-semibold lg:hidden block">
                      {formatPrice(item.price * item.quantity)}
                    </p>

                    <div className="flex items-center justify-between">
                      <ButtonGroup className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-5"
                          onClick={() =>
                            updateQuantity(item.lineId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </Button>
                        <Input
                          className="w-10 text-center text-[10px]"
                          value={item.quantity}
                          readOnly
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-5"
                          onClick={() =>
                            updateQuantity(item.lineId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </ButtonGroup>

                      <p className="text-xs font-semibold hidden lg:block">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Separator />
            <SheetFooter className="gap-3">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Button asChild size="lg" onClick={closeCart}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" onClick={closeCart}>
                <Link href="/cart">{t.cart}</Link>
              </Button>
              <Button variant="outline" onClick={closeCart}>
                Continue shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
