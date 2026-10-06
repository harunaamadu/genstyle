"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";
import { useFormatPrice, useT } from "@/hooks/use-i18n";
import { useMounted } from "@/hooks/use-mounted";
import { computeTotals } from "@/lib/cart";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { CheckoutSteps } from "./checkout-steps";
import { CheckoutSummary } from "./checkout-summary";
import { ContactStep } from "./contact-step";
import { PaymentStep } from "./payment-step";
import { ShippingStep } from "./shipping-step";

import { useSession } from "next-auth/react";
import { getCheckoutDefaults, placeOrder } from "@/actions/checkout";

const steps = [
  { id: "contact", label: "Contact" },
  { id: "shipping", label: "Delivery" },
  { id: "payment", label: "Payment" },
] as const;

const LAST_STEP = steps.length - 1;

const defaultValues: CheckoutInput = {
  email: "",
  newsletter: false,
  firstName: "",
  lastName: "",
  phone: "",
  country: "GH",
  address1: "",
  address2: "",
  city: "",
  region: "",
  postalCode: "",
  paymentMethod: "card",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  momoNetwork: "mtn",
  momoNumber: "",
  acceptTerms: false,
};

function fieldsForStep(
  step: number,
  method: CheckoutInput["paymentMethod"],
): FieldPath<CheckoutInput>[] {
  if (step === 0) return ["email"];
  if (step === 1)
    return [
      "firstName",
      "lastName",
      "phone",
      "country",
      "address1",
      "address2",
      "city",
      "region",
      "postalCode",
    ];
  if (method === "card")
    return ["cardName", "cardNumber", "cardExpiry", "cardCvc", "acceptTerms"];
  if (method === "momo") return ["momoNetwork", "momoNumber", "acceptTerms"];
  return ["acceptTerms"];
}

function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-56" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_26rem]">
        <Skeleton className="h-130 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const mounted = useMounted();
  const t = useT();
  const formatPrice = useFormatPrice();

  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrderStore((s) => s.addOrder);

  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [serverError, setServerError] = useState<{
    message: string;
    issues?: string[];
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
    mode: "onTouched",
  });

  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;

    getCheckoutDefaults().then((prefill) => {
      // An email means the shopper has already started typing: never overwrite them
      if (cancelled || !prefill || form.getValues("email")) return;
      form.reset({ ...defaultValues, ...prefill });
    });

    return () => {
      cancelled = true;
    };
  }, [status, form]);

  const method = form.watch("paymentMethod");
  const totals = useMemo(
    () => computeTotals(items, promoCode),
    [items, promoCode],
  );

  function goTo(next: number) {
    setServerError(null);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function goNext() {
    const valid = await form.trigger(fieldsForStep(step, method), {
      shouldFocus: true,
    });
    if (valid) goTo(step + 1);
  }

  const submitOrder = form.handleSubmit((values) => {
    setServerError(null);

    startTransition(async () => {
      try {
        // Card fields are intentionally NOT sent. Prices are not sent either.
        const result = await placeOrder({
          email: values.email,
          newsletter: values.newsletter,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          country: values.country,
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          region: values.region,
          postalCode: values.postalCode,
          paymentMethod: values.paymentMethod,
          momoNetwork:
            values.paymentMethod === "momo" ? values.momoNetwork : undefined,
          momoNumber:
            values.paymentMethod === "momo" ? values.momoNumber : undefined,
          acceptTerms: values.acceptTerms,
          promoCode,
          lines: items.map((i) => ({
            productId: i.productId,
            sku: i.sku,
            color: i.color,
            quantity: i.quantity,
          })),
        });

        if (!result.ok) {
          setServerError({ message: result.message, issues: result.issues });
          return;
        }

        addOrder(result.order);
        setPlaced(true); // stops the empty-bag screen flashing once the cart clears
        router.push(`/checkout/success/${result.order.orderNumber}`);
        clearCart();
      } catch {
        setServerError({ message: "Something went wrong. Please try again." });
      }
    });
  });

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < LAST_STEP) void goNext();
    else void submitOrder();
  }

  if (!mounted) return <CheckoutSkeleton />;

  if (placed) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t.cartEmpty}
        actionLabel={t.continueShopping}
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <PageBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: t.cart, href: "/cart" },
          { label: t.checkout },
        ]}
      />

      <h1 className="mt-6 text-4xl font-bold tracking-tight">{t.checkout}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_26rem] lg:gap-14">
        <div className="space-y-8">
          <CheckoutSteps steps={steps} current={step} onSelect={goTo} />

          {serverError && (
            <div
              role="alert"
              className="flex gap-3 border border-destructive bg-destructive/10 p-4 text-sm"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div className="space-y-2">
                <p className="font-medium">{serverError.message}</p>
                {serverError.issues && (
                  <ul className="list-inside list-disc text-muted-foreground">
                    {serverError.issues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                )}
                {serverError.issues && (
                  <Link
                    href="/cart"
                    className="inline-block font-medium underline underline-offset-4"
                  >
                    Review your bag
                  </Link>
                )}
              </div>
            </div>
          )}

          <FormProvider {...form}>
            <form onSubmit={handleFormSubmit} noValidate className="space-y-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {step === 0 && <ContactStep />}
                  {step === 1 && <ShippingStep />}
                  {step === 2 && <PaymentStep />}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between gap-3 border-t pt-6">
                {step === 0 ? (
                  <Button asChild variant="ghost">
                    <Link href="/cart">
                      <ArrowLeft />
                      {t.cart}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => goTo(step - 1)}
                  >
                    <ArrowLeft />
                    Back
                  </Button>
                )}

                {step < LAST_STEP ? (
                  <Button
                    type="submit"
                    size="lg"
                    className="uppercase tracking-widest"
                  >
                    Continue
                    <ArrowRight />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="uppercase tracking-widest"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Lock />
                    )}
                    Place order · {formatPrice(totals.total)}
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>

        <CheckoutSummary />
      </div>
    </div>
  );
}
