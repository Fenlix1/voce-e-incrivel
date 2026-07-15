"use client";

import { MapPin, Navigation, Clock } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SITE_CONFIG } from "@/lib/constants";

export function Location() {
  return (
    <section id="localizacao" className="section-padding bg-white">
      <div className="container-page">
        <ScrollReveal>
          <SectionTitle
            subtitle="Onde Estamos"
            title="Venha nos visitar"
            description="Estamos de portas abertas esperando por você."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              {
                icon: MapPin,
                title: "Endereço",
                content: SITE_CONFIG.address.full,
              },
              {
                icon: Clock,
                title: "Horários",
                content: "Manhã, Tarde e Noite\nConsulte a grade de cada modalidade",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="bg-brand-light rounded-2xl p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
                    <item.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-brand-blue mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal delay={0.2}>
              <a
                href={SITE_CONFIG.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-orange text-white font-heading font-semibold hover:bg-brand-orange/90 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Navigation size={18} />
                Como Chegar
              </a>
            </ScrollReveal>
          </div>

          {/* Map */}
          <ScrollReveal className="lg:col-span-2" delay={0.1}>
            <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] lg:h-full">
              <iframe
                src={SITE_CONFIG.address.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do Projeto Você é Incrível"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
