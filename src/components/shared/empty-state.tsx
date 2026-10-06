import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel: string;
  actionHref: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center bg-secondary">
        <Icon className="size-7 text-muted-foreground" />
      </span>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <Button asChild size="lg" className="uppercase tracking-widest">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}