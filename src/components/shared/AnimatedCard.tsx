"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function AnimatedCard({
  children,
  className,
  hover = true,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -8, scale: 1.02 } : undefined}
      className={cn(
        "bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
