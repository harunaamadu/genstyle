import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-xl space-y-2">
        {eyebrow && (
          <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
            <span className="size-3 rotate-45 bg-primary" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors tracking-widest uppercase"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}