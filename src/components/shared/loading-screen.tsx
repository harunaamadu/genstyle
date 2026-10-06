"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import GenStyleLogo from "@/components/shared/genstyle-logo";
import { siteConfig } from "@/data/site-config";

interface LoadingProps {
  uniqueKey?: string;
  className?: string;
}

const HOLD_AFTER_INTRO_MS = 600;

export default function LoadingScreen({ uniqueKey, className }: LoadingProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  const handleComplete = () => {
    window.setTimeout(() => setVisible(false), HOLD_AFTER_INTRO_MS);
  };

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          // 1. FIXED: Assigned explicit tracking parameter key securely here
          key={uniqueKey || "global-loading-screen"}
          className={`fixed top-0 left-0 w-full h-screen z-9990 flex items-center justify-center bg-background px-4 ${className ?? ""}`.trim()}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          role="status"
          aria-label={`Loading ${siteConfig().name}`}
        >
          {reduceMotion ? (
            <motion.div
              className="w-full max-w-3xl px-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onAnimationComplete={handleComplete}
            >
              <GenStyleLogo animated={false} className="w-full" />
            </motion.div>
          ) : (
            <motion.div
              className="w-full max-w-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onAnimationComplete={handleComplete}
            >
              <GenStyleLogo className="w-full" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
