"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";
import { WishlistButton } from "./wishlist-button";
import { UserMenu } from "./user-menu";
import { CartButton } from "./cart-button";
import { siteConfig } from "@/data/site-config";
import GenStyleLogo from "@/components/shared/genstyle-logo";
import Link from "next/link";

export function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 150);
    setScrolled(latest > 10);
  });

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-[11px] font-medium text-primary-foreground">
        {siteConfig().announcement}
      </div>

      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-shadow",
          scrolled && "shadow-sm"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <MobileNav />
            {/* <Logo /> */}
            <Link href="/" aria-label={siteConfig().name}>
              <GenStyleLogo className="w-28" />
            </Link>
          </div>

          <MainNav />

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <SearchDialog />
            <ThemeToggle />
            <WishlistButton />
            <UserMenu />
            <CartButton />
          </div>
        </div>
      </motion.header>
    </>
  );
}