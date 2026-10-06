"use client";

import { useFormatPrice, useLocale, useT } from "@/hooks/use-i18n";
import { FREE_SHIPPING_THRESHOLD_USD } from "@/i18n/config";
import { interpolate } from "@/lib/format";
import { getLocalized, getStyleCode } from "@/lib/product";
import type { Product } from "@/lib/validations/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const trigger = "py-4 text-sm font-semibold tracking-widest uppercase hover:no-underline";

export function ProductDetails({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useT();
  const formatPrice = useFormatPrice();

  const loc = getLocalized(product, locale);

  const rows = [
    { label: t.brand, value: product.brand },
    { label: t.material, value: product.material },
    { label: t.countryOfOrigin, value: product.countryOfOrigin },
    { label: t.sku, value: getStyleCode(product) },
  ].filter((row): row is { label: string; value: string } => !!row.value);

  return (
    <Accordion
      type="multiple"
      defaultValue={["description"]}
      className="border-t"
    >
      <AccordionItem value="description">
        <AccordionTrigger className={trigger}>{t.description}</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          {loc.description ?? loc.tagline}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="info">
        <AccordionTrigger className={trigger}>{t.additionalInfo}</AccordionTrigger>
        <AccordionContent className="space-y-5">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>

          {product.care && product.care.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">{t.care}</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {product.care.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{t.tags}</span>
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping">
        <AccordionTrigger className={trigger}>{t.shippingReturns}</AccordionTrigger>
        <AccordionContent className="space-y-2 text-muted-foreground">
          <p>
            {interpolate(t.freeShippingThreshold, {
              amount: formatPrice(FREE_SHIPPING_THRESHOLD_USD),
            })}
          </p>
          <p>{t.returnsPolicy}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}