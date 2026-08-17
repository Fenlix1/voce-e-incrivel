"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SITE_CONFIG } from "@/lib/constants";

export function CTABanner() {
  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-br from-brand-orange to-orange-600">
      {/* Decorative */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMTIgMGMxLjY1NyAwIDMtMS4zNDMgMy0zcy0xLjM0My0zLTMtMy0zIDEuMzQzLTMgMyAxLjM0MyAzIDMgM3oiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

      <div className="container-page relative z-10 text-center">
        <ScrollReveal>
          <motion.div
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-white text-sm font-medium mb-6"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart size={16} className="text-white" />
            Junte-se a nós!
          </motion.div>
        </ScrollReveal>

        <ScrollReveal>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Pronto para fazer parte dessa transformação?
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Venha fazer parte do projeto social que está mudando vidas em
            Belford Roxo. Escolha sua modalidade e comece hoje mesmo!
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <a
            href={SITE_CONFIG.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-brand-orange font-heading font-bold text-xl hover:bg-white/95 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Quero Participar
            <ArrowRight
              size={22}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
