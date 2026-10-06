import type { Metadata } from "next";
import Link from "next/link";
import { infoPages, type InfoSlug } from "@/data/info-pages";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";

export function infoMetadata(slug: InfoSlug): Metadata {
  const page = infoPages[slug];
  return { title: page.title, description: page.description };
}

export function InfoPage({ slug }: { slug: InfoSlug }) {
  const page = infoPages[slug];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: page.title }]} />

      <header className="mt-6 space-y-3 border-b pb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{page.title}</h1>
        <p className="text-muted-foreground">{page.description}</p>
        {"updated" in page && page.updated && (
          <p className="text-xs text-muted-foreground">Last updated {formatDate(page.updated)}</p>
        )}
      </header>

      <div className="mt-10 space-y-10">
        {page.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {"list" in section && section.list && (
              <ul className="list-outside list-disc space-y-1.5 pl-6 text-muted-foreground marker:text-primary">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-start gap-4 bg-secondary/50 p-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">Questions? We're happy to help.</p>
        <Button asChild className="uppercase tracking-widest">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}