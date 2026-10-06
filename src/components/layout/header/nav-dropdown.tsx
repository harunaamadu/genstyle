"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NavLinkItem } from "@/data";

type NavDropdownProps = {
  title: string;
  href: string;
  links: NavLinkItem[];
  onNavigate: () => void;
};

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

const row = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export function NavDropdown({ title, href, links, onNavigate }: NavDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full left-0 z-50 w-60 border bg-popover p-2 text-popover-foreground shadow-lg"
    >
      <motion.ul variants={list} initial="hidden" animate="show">
        {links.map((link) => (
          <motion.li key={link.href} variants={row}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="group flex items-center justify-between px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.title}
              <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <div className="my-1 h-px bg-border" />

      <Link
        href={href}
        onClick={onNavigate}
        className="block px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent"
      >
        Shop all {title}
      </Link>
    </motion.div>
  );
}