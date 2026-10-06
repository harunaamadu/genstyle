"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  /** Seconds between each direct child. 0 animates the wrapper itself. */
  stagger?: number;
  /** Play once, or replay each time it re-enters the viewport. */
  once?: boolean;
  start?: string;
  className?: string;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  distance = 40,
  duration = 0.8,
  delay = 0,
  stagger = 0,
  once = true,
  start = "top 85%",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 ? Array.from(el.children) : el;
      const { x, y } = offsets[direction];

      gsap.from(targets, {
        opacity: 0,
        x: x * distance,
        y: y * distance,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once
            ? "play none none none"
            : "play reverse play reverse",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [direction, distance, duration, delay, stagger, once, start]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}

{/* <Reveal direction="up" stagger={0.1} className="grid gap-6 md:grid-cols-3">
  <Card />
  <Card />
  <Card />
</Reveal> */}