"use client";

import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  description,
  centered = true,
  light = false,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("mb-12 sm:mb-16", centered && "text-center", className)}>
      {subtitle && (
        <span
          className={cn(
            "inline-block text-sm font-heading font-semibold uppercase tracking-[0.2em] mb-3",
            light ? "text-brand-orange" : "text-brand-orange"
          )}
        >
          {subtitle}
        </span>
      )}
      <h2
        className={cn(
          "font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight",
          light ? "text-white" : "text-brand-dark"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed",
            light ? "text-white/70" : "text-gray-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
