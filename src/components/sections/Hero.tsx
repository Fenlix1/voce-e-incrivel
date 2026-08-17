"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollIndicator } from "@/components/shared/ScrollIndicator";
import { SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/90 via-brand-blue/80 to-brand-blue/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,76,129,0.4)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-page text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block text-brand-orange font-heading font-semibold text-sm sm:text-base uppercase tracking-[0.3em] mb-4">
            Projeto Social Esportivo
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-4"
        >
          VOCÊ É
          <br />
          <span className="text-brand-orange">INCRÍVEL</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white/80 mb-6"
        >
          FAZ TEU NOME
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Transformando vidas através do esporte, saúde, inclusão social e
          qualidade de vida. Aulas gratuitas para todas as idades em Belford
          Roxo - RJ.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={SITE_CONFIG.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-orange text-white font-heading font-bold text-lg hover:bg-brand-orange/90 transition-all duration-300 hover:scale-105 shadow-2xl shadow-brand-orange/30"
          >
            Quero Participar
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#sobre"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-heading font-semibold text-lg hover:bg-white/10 transition-all duration-300"
          >
            Conheça o Projeto
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "9", label: "Modalidades" },
            { value: "4", label: "Públicos" },
            { value: "3", label: "Turnos" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading font-black text-3xl sm:text-4xl text-white">
                {stat.value}
              </p>
              <p className="text-white/50 text-xs uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
