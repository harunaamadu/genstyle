"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { useT } from "@/hooks/use-i18n";
import { MAX_COMPARE, useCompareStore } from "@/store/compare-store";
import { Button } from "@/components/ui/button";

export function CompareBar() {
  const mounted = useMounted();
  const t = useT();
  const pathname = usePathname();
  const count = useCompareStore((s) => s.ids.length);
  const clear = useCompareStore((s) => s.clear);

  const visible = mounted && count > 0 && pathname !== "/compare";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between gap-3 border bg-popover p-3 text-popover-foreground shadow-xl"
        >
          <p className="flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal className="size-4 text-primary" />
            {t.compare} ({count}/{MAX_COMPARE})
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clear}>
              {t.clear}
            </Button>
            <Button asChild size="sm" className="uppercase tracking-widest">
              <Link href="/compare">{t.compare}</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}