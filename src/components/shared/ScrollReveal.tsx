"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  threshold?: number;
}

const directionVariants = {
  up: { y: 40, opacity: 0 },
  down: { y: -40, opacity: 0 },
  left: { x: 40, opacity: 0 },
  right: { x: -40, opacity: 0 },
};

export function ScrollReveal({
  children,
  className,
  direction = "up",
  duration = 0.6,
  delay = 0,
  threshold,
}: ScrollRevealProps) {
  const { ref, isInView } = useScrollAnimation({ threshold });

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction]}
      animate={
        isInView
          ? { x: 0, y: 0, opacity: 1 }
          : directionVariants[direction]
      }
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
