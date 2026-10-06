"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_DEFAULT_INDEX, HERO_INTERVAL, heroSlides } from "@/data/hero";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site-config";

const ease = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(HERO_DEFAULT_INDEX);
  const [paused, setPaused] = useState(false);

  const slide = heroSlides[index];
  const total = heroSlides.length;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  // Re-arms after every slide change, so manual clicks reset the timer
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setTimeout(next, HERO_INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative overflow-hidden border-b bg-secondary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:min-h-160 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-16">
        {/* Left: headline, copy, CTAs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-6 lg:col-span-6"
        >
          <motion.p
            variants={rise}
            className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase"
          >
            <span className="size-2.5 rotate-45 bg-primary" aria-hidden />
            #{siteConfig().name}Store
          </motion.p>

          <motion.h1
            variants={rise}
            className="text-5xl font-heading leading-[1.05] font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Simplify <br />
            Everything.
          </motion.h1>

          {/* Slide-specific copy and links */}
          <div aria-live={paused ? "polite" : "off"} className="min-h-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease }}
                className="space-y-6"
              >
                <p className="max-w-md text-base text-muted-foreground sm:text-base lg:max-w-lg lg:text-lg">
                  {slide.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="group uppercase tracking-widest">
                    <Link href={slide.href}>
                      Explore Now
                      <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="uppercase tracking-widest"
                  >
                    <Link href={slide.newInHref}>New In</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Audience tabs */}
          <motion.div
            variants={rise}
            role="tablist"
            aria-label="Choose a collection"
            className="flex items-center gap-6 pt-4"
          >
            {heroSlides.map((item, i) => {
              const active = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative pb-1.5 text-xs font-semibold tracking-widest uppercase transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="hero-tab"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right: image stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-lg lg:justify-self-end"
        >
          {/* Brand colour block behind the photo */}
          <div
            aria-hidden
            className="absolute -right-3 -bottom-3 size-2/3 bg-primary sm:-right-5 sm:-bottom-5"
          />

          <div className="relative aspect-4/5 max-h-[70svh] w-full overflow-hidden bg-muted">
            <AnimatePresence>
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
                className="absolute inset-0"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === HERO_DEFAULT_INDEX}
                  sizes="(min-width: 1024px) 512px, (min-width: 640px) 448px, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Caption + controls */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-linear-to-t from-black/60 to-transparent p-4 text-white">
              <div>
                <p className="text-[10px] font-medium tracking-widest uppercase opacity-80 tabular-nums">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </p>
                <p className="text-sm font-semibold">{slide.caption}</p>
              </div>

              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={prev}
                  aria-label="Previous slide"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={next}
                  aria-label="Next slide"
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}