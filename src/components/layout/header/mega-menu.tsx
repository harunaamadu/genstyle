"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { NavFeatured, NavGroup } from "@/data";

type MegaMenuProps = {
  groups: NavGroup[];
  featured: NavFeatured;
  onNavigate: () => void;
};

const column = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * i + 0.05, duration: 0.25, ease: "easeOut" as const },
  }),
};

export function MegaMenu({ groups, featured, onNavigate }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-x-0 top-full z-50 border-b bg-popover text-popover-foreground shadow-lg"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-5 gap-8 px-6 py-8">
        {groups.map((group, i) => (
          <motion.div
            key={group.title}
            custom={i}
            variants={column}
            initial="hidden"
            animate="show"
          >
            <Link
              href={group.href}
              onClick={onNavigate}
              className="group relative mb-4 inline-block text-sm font-semibold tracking-widest uppercase"
            >
              {group.title}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>

            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        <motion.div
          custom={groups.length}
          variants={column}
          initial="hidden"
          animate="show"
        >
          <Link
            href={featured.href}
            onClick={onNavigate}
            className="group flex h-full min-h-48 flex-col justify-between bg-primary p-5 text-primary-foreground"
          >
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase opacity-80">
                {featured.eyebrow}
              </p>
              <h3 className="mt-2 text-xl leading-tight font-bold">{featured.title}</h3>
              <p className="mt-2 text-sm opacity-90">{featured.description}</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">
              {featured.cta}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}