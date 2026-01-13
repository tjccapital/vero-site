"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContainerTextFlipProps {
  words: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
}

export function ContainerTextFlip({
  words,
  interval = 3000,
  className,
  textClassName,
}: ContainerTextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  // Find the longest word to set minimum width and prevent layout shifts
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <span className={cn("inline-block relative whitespace-nowrap", className)}>
      {/* Invisible spacer to maintain consistent width */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {longestWord}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute left-0 top-0 inline-block whitespace-nowrap text-primary-900",
            textClassName
          )}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
