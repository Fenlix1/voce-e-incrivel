"use client";

import { SectionTitle } from "@/components/shared/SectionTitle";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getSupporters } from "@/data/supporters";
import { Star } from "lucide-react";

export function Supporters() {
  const supporters = getSupporters();

  return (
    <section className="section-padding bg-brand-light">
      <div className="container-page">
        <ScrollReveal>
          <SectionTitle
            subtitle="Apoio Cultural"
            title="Quem torna tudo possível"
            description="Pessoas comprometidas com a transformação social da nossa comunidade."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {supporters.map((supporter, i) => (
            <ScrollReveal key={supporter.id} delay={i * 0.15}>
              <div className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 rounded-2xl bg-brand-blue/5 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                  {supporter.logo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={supporter.logo}
                      alt={supporter.name}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <Star size={32} className="text-brand-blue group-hover:text-white transition-colors duration-500" />
                  )}
                </div>
                <h3 className="font-heading font-bold text-lg mb-1">
                  {supporter.name}
                </h3>
                <p className="text-brand-orange text-sm font-medium">
                  {supporter.role}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <p className="text-center text-gray-400 text-sm mt-8">
            Seu logo pode estar aqui! Entre em contato para apoiar nosso
            projeto.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
