"use client";

import { AnimatePresence, motion } from "framer-motion";

export function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}