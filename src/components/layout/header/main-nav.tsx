"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { mainNav } from "@/data";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./mega-menu";
import { NavDropdown } from "./nav-dropdown";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function open(key: string) {
    clearTimeout(timer.current);
    setOpenKey(key);
  }

  function closeSoon() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenKey(null), 120);
  }

  function closeNow() {
    clearTimeout(timer.current);
    setOpenKey(null);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <nav className="hidden lg:block" aria-label="Main">
      <ul className="flex items-center">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href);
          const hasMenu = item.type !== "link";
          const isOpen = openKey === item.title;

          return (
            <li
              key={item.title}
              className={cn(item.type === "dropdown" && "relative")}
              onMouseEnter={hasMenu ? () => open(item.title) : undefined}
              onMouseLeave={hasMenu ? closeSoon : undefined}
              onFocus={hasMenu ? () => open(item.title) : undefined}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) closeSoon();
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") closeNow();
              }}
            >
              <Link
                href={item.href}
                onClick={closeNow}
                aria-haspopup={hasMenu || undefined}
                aria-expanded={hasMenu ? isOpen : undefined}
                className={cn(
                  "relative flex h-16 items-center gap-1 px-4 text-sm font-medium transition-colors hover:text-foreground",
                  active || isOpen ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.title}

                {hasMenu && (
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    <ChevronDown className="size-3.5" />
                  </motion.span>
                )}

                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-4 bottom-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>

              <AnimatePresence>
                {isOpen && item.type === "dropdown" && (
                  <NavDropdown
                    title={item.title}
                    href={item.href}
                    links={item.links}
                    onNavigate={closeNow}
                  />
                )}
                {isOpen && item.type === "mega" && (
                  <MegaMenu
                    groups={item.groups}
                    featured={item.featured}
                    onNavigate={closeNow}
                  />
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}