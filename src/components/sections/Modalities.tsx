"use client";

import React from "react";
import { Waves, Dumbbell, Music, Swords, Flame, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getModalities, type Modality } from "@/data/modalities";

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  Waves,
  Dumbbell,
  Music,
  Swords,
  Flame,
  Heart,
};

export function Modalities() {
  const modalities = getModalities();

  const renderIcon = (name: string) => {
    const IconComponent = LUCIDE_ICONS[name];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  };

  return (
    <section id="modalidades" className="section-padding bg-brand-light">
      <div className="container-page">
        <ScrollReveal>
          <SectionTitle
            subtitle="Nossas Aulas"
            title="Modalidades para todos os gostos e idades"
            description="Oferecemos oito modalidades esportivas gratuitas, com profissionais qualificados e horários flexíveis."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modalities.map((modality, i) => (
            <ScrollReveal key={modality.id} delay={i * 0.08}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={modality.image}
                    alt={modality.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-brand-orange flex items-center justify-center text-white">
                      {renderIcon(modality.icon)}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white">
                      {modality.name}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    {modality.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-medium text-brand-blue bg-brand-blue/5 rounded-full px-3 py-1.5 w-fit">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    {modality.schedule}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
