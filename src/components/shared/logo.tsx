import Link from "next/link";
import { Shirt } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label={siteConfig().name}
    >
      <span className="max-[335px]:hidden flex size-8 items-center justify-center bg-primary text-primary-foreground">
        <Shirt className="size-4" />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight">
        {siteConfig().name}
      </span>
    </Link>
  );
}
