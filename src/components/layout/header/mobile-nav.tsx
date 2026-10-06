"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { mainNav, type NavLinkItem } from "@/data/";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/data/site-config";

import { signOut, useSession } from "next-auth/react";
import { useT } from "@/hooks/use-i18n";

function MobileLinkList({
  allLabel,
  allHref,
  links,
}: {
  allLabel: string;
  allHref: string;
  links: NavLinkItem[];
}) {
  return (
    <ul className="ml-1 flex flex-col border-l-2 border-primary pl-4">
      <li>
        <SheetClose asChild>
          <Link href={allHref} className="block py-2 text-sm font-semibold">
            {allLabel}
          </Link>
        </SheetClose>
      </li>
      {links.map((link) => (
        <li key={link.href}>
          <SheetClose asChild>
            <Link
              href={link.href}
              className="block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          </SheetClose>
        </li>
      ))}
    </ul>
  );
}

export function MobileNav() {
  const t = useT();
  const { data: session } = useSession();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-4 md:size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex w-full max-w-xs flex-col">
        <SheetHeader>
          <SheetTitle>{siteConfig().name}</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-4" aria-label="Mobile">
          <Accordion type="single" collapsible>
            {mainNav.map((item) => {
              if (item.type === "link") {
                return (
                  <div key={item.title} className="border-b">
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className="block py-3 text-lg font-medium"
                      >
                        {item.title}
                      </Link>
                    </SheetClose>
                  </div>
                );
              }

              if (item.type === "dropdown") {
                return (
                  <AccordionItem
                    key={item.title}
                    value={item.title}
                    className="border-b"
                  >
                    <AccordionTrigger className="py-3 text-lg font-medium hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <MobileLinkList
                        allLabel={`Shop all ${item.title}`}
                        allHref={item.href}
                        links={item.links}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return (
                <AccordionItem
                  key={item.title}
                  value={item.title}
                  className="border-b"
                >
                  <AccordionTrigger className="py-3 text-lg font-medium hover:no-underline">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="single" collapsible className="pl-1">
                      {item.groups.map((group) => (
                        <AccordionItem
                          key={group.title}
                          value={group.title}
                          className="border-b-0"
                        >
                          <AccordionTrigger className="py-2.5 text-base hover:no-underline">
                            {group.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <MobileLinkList
                              allLabel={`All ${group.title}`}
                              allHref={group.href}
                              links={group.links}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>

        <div className="flex flex-col gap-2 border-t p-4">
          {session?.user ? (
            <>
              <SheetClose asChild>
                <Button asChild>
                  <Link href="/orders">{t.orders}</Link>
                </Button>
              </SheetClose>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                {t.logout}
              </Button>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button asChild>
                  <Link href="/login">{t.login}</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="outline">
                  <Link href="/register">{t.signUpNow}</Link>
                </Button>
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
