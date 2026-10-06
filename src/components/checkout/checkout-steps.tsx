import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckoutStepsProps = {
  steps: readonly { id: string; label: string }[];
  current: number;
  onSelect: (index: number) => void;
};

export function CheckoutSteps({ steps, current, onSelect }: CheckoutStepsProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Checkout progress">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:flex-none sm:gap-4">
            <button
              type="button"
              disabled={!done}
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center border text-xs font-semibold transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-foreground bg-foreground text-background",
                  !done && !active && "text-muted-foreground"
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  active ? "inline" : "hidden sm:inline",
                  !done && !active && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>

            {i < steps.length - 1 && <span aria-hidden className="h-px flex-1 bg-border sm:w-12 sm:flex-none" />}
          </li>
        );
      })}
    </ol>
  );
}