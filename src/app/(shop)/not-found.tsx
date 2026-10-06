import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="We couldn't find that page"
      description="It may have moved, or the link might be wrong."
      actionLabel="Back to the shop"
      actionHref="/shop"
    />
  );
}