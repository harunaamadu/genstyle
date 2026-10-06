import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { contactInfo } from "@/data/site-config";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about an order, sizing or returns? Send us a message.",
};

const details = [
  { icon: Mail, label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  { icon: Phone, label: "Phone", value: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s/g, "")}` },
  { icon: Clock, label: "Hours", value: contactInfo.hours },
  { icon: MapPin, label: "Based in", value: contactInfo.address },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <header className="mt-6 space-y-3 border-b pb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
        <p className="max-w-xl text-muted-foreground">
          Questions about an order, sizing or returns? Send us a note and a real person will reply.
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <ContactForm />

        <aside className="space-y-8">
          <ul className="space-y-5">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center bg-secondary">
                  <Icon className="size-5" />
                </span>
                <div className="text-sm">
                  <p className="font-semibold">{label}</p>
                  {href ? (
                    <a href={href} className="text-muted-foreground transition-colors hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <p className="border-t pt-6 text-sm text-muted-foreground">
            Looking for a quick answer? Check our{" "}
            <Link href="/faqs" className="font-medium text-foreground underline underline-offset-4">
              FAQs
            </Link>{" "}
            or the{" "}
            <Link href="/size-guide" className="font-medium text-foreground underline underline-offset-4">
              size guide
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}