import type { Metadata } from "next";
import Link from "next/link";
import { measureSteps } from "@/data/size-guide";
import { SizeGuide } from "@/components/size-guide/size-guide";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";

export const metadata: Metadata = {
  title: "Size guide",
  description: "Find your size with our measurement charts and size finder.",
};

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Size guide" }]} />

      <header className="mt-6 space-y-3 border-b pb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Size guide</h1>
        <p className="max-w-xl text-muted-foreground">
          Measurements are of your body, not the garment. If you're between sizes, size up for a relaxed fit.
        </p>
      </header>

      <div className="mt-10">
        <SizeGuide />
      </div>

      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold tracking-tight">How to measure</h2>
        <Reveal stagger={0.1} className="grid gap-6 sm:grid-cols-3">
          {measureSteps.map((step, i) => (
            <div key={step.title} className="space-y-3 border p-5">
              <span className="flex size-8 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </Reveal>
        <p className="text-sm text-muted-foreground">
          Use a soft tape measure over light clothing, and keep it snug but not tight.
        </p>
      </section>

      <div className="mt-16 flex flex-col items-start gap-4 bg-secondary/50 p-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">Still not sure which size to pick?</p>
        <Button asChild className="uppercase tracking-widest">
          <Link href="/contact">Ask our team</Link>
        </Button>
      </div>
    </div>
  );
}