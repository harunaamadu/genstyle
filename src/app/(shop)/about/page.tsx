import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Ruler, Scissors, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "About us",
  description: "Our story, and what we believe about making and wearing clothes.",
};

const values = [
  {
    icon: Scissors,
    title: "Made to last",
    text: "Solid seams, honest fabrics and finishing that holds up wash after wash.",
  },
  {
    icon: Ruler,
    title: "Fit for everyone",
    text: "Clear size guidance and cuts designed for real bodies, across men, women and kids.",
  },
  {
    icon: Leaf,
    title: "Kinder materials",
    text: "We favour fibres and finishes that are gentler on skin and on the planet.",
  },
  {
    icon: Tag,
    title: "Honest pricing",
    text: "Fair prices without fake discounts, and free shipping once your bag passes the threshold.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b bg-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
          <div className="space-y-6">
            <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
            <Reveal className="space-y-6">
              <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
                <span className="size-3 bg-primary" aria-hidden />
                Our story
              </p>
              <h1 className="text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
                Fashion that fits your life.
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground">
                FitSync began with a simple frustration: good clothes shouldn't be hard to find, hard to size, or hard to look after. So we set out to make a wardrobe that simply works.
              </p>
              <Button asChild size="lg" className="uppercase tracking-widest">
                <Link href="/shop">Shop the collection</Link>
              </Button>
            </Reveal>
          </div>

          <Reveal direction="left">
            <div className="relative mx-auto aspect-4/5 max-w-md overflow-hidden bg-muted">
              <Image
                src="/images/about/story.jpg"
                alt="The FitSync team at work"
                fill
                priority
                sizes="(min-width: 1024px) 448px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="What we believe"
            title="Four things we won't compromise on"
            description="They shape every piece we design, and every order we send."
          />
        </Reveal>

        <Reveal stagger={0.1} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-4 border p-6">
              <span className="flex size-11 items-center justify-center bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="border-t bg-secondary/40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <Reveal direction="right">
            <div className="relative mx-auto aspect-4/5 max-w-md overflow-hidden bg-muted">
              <Image
                src="/images/about/craft.jpg"
                alt="Close-up of fabric being stitched"
                fill
                sizes="(min-width: 1024px) 448px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal className="space-y-5">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Slow-made, simply designed</h2>
            <p className="leading-relaxed text-muted-foreground">
              We'd rather release fewer pieces and get them right. Each style goes through fit testing, fabric checks and a long look at how it ages before it reaches you.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Then we write down everything we've learned in the care guides and size charts, so you know how to wear it, wash it and keep it looking good.
            </p>
            <Button asChild variant="outline" className="uppercase tracking-widest">
              <Link href="/blog">Read the journal</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Ready to find your fit?</h2>
            <p className="opacity-90">Browse the latest drops, or ask us anything.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-foreground text-background uppercase tracking-widest hover:bg-foreground/90">
              <Link href="/shop?sort=newest">Shop new in</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground bg-transparent uppercase tracking-widest text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}