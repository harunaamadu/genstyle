import Link from "next/link";
// import { Logo } from "@/components/layout/header/logo";
import { footerNav, socialLinks } from "@/data";
import { NewsletterForm } from "./newsletter-form";
import { siteConfig } from "@/data/site-config";
import { Logo } from "@/components/shared/logo";
import GenStyleLogo from "@/components/shared/genstyle-logo";

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* Newsletter band */}
      <div className="text-primary-foreground relative">
        <div className="absolute inset-0 bg-pattern z-0" />
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-12 lg:px-8 relative z-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Join the {siteConfig().name} list
            </h2>
            <p className="opacity-90">
              Get 25% off your first order, plus early access to new drops.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="space-y-4 lg:col-span-2">
          {/* <Logo /> */}
          <GenStyleLogo className="w-2/3" />

          <p className="max-w-xs text-sm text-muted-foreground">
            {siteConfig().description}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {socialLinks.map((social) => (
              <li key={social.title}>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {social.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="mb-4 text-sm font-semibold tracking-widest uppercase">
              {group.title}
            </h3>
            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig().name}. All rights
            reserved.
          </p>
          <p>Visa · Mastercard · Apple Pay · Mobile Money</p>
        </div>
      </div>
    </footer>
  );
}
