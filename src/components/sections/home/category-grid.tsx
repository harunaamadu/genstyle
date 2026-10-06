import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/data/site-config";

export function CategoryGrid({ showAllLink = true }: { showAllLink?: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your fit"
          description="Start with who you're dressing, then dive into the details."
          href={showAllLink ? "/categories" : undefined}
          linkLabel="All categories"
        />
      </Reveal>

      <Reveal
        stagger={0.1}
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="group relative block aspect-3/4 overflow-hidden bg-muted"
          >
            <Image
              src={category.image || `${siteConfig().productImageFallback}`}
              alt={category.alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark scrim keeps the white text readable in both themes */}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white sm:p-5">
              <div>
                <h3 className="text-xl font-bold tracking-wide uppercase sm:text-2xl">
                  {category.title}
                </h3>
                <p className="mt-1 hidden text-sm text-white/80 sm:block">
                  {category.description}
                </p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center bg-primary text-primary-foreground transition-transform duration-300 group-hover:-translate-y-1">
                <ArrowUpRight className="size-4" />
              </span>
            </div>

            {/* Bottom accent line grows on hover */}
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full"
            />
          </Link>
        ))}
      </Reveal>
    </section>
  );
}