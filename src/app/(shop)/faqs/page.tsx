import type { Metadata } from "next";
import Link from "next/link";
import { faqGroups } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers about delivery, returns, sizing and payments.",
};

export default function FaqsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: { "@type": "Answer", text: i.answer },
      }))
    ),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQs" }]} />

      <header className="mt-6 space-y-3 border-b pb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Frequently asked questions</h1>
        <p className="text-muted-foreground">
          Can't find what you need? <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">Contact us</Link>.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {faqGroups.map((group) => (
          <section key={group.title} className="space-y-2">
            <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              {group.title}
            </h2>
            <Accordion type="multiple" className="border-t">
              {group.items.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger className="py-4 text-left text-base font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button asChild size="lg" className="uppercase tracking-widest">
          <Link href="/contact">Still need help?</Link>
        </Button>
      </div>
    </div>
  );
}