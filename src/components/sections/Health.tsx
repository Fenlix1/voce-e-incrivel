"use client";

import { Heart, Apple, Stethoscope, Activity } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionTitle } from "@/components/shared/SectionTitle";

const benefits = [
  {
    icon: Stethoscope,
    title: "Acompanhamento Profissional",
    description:
      "Profissionais da saúde dedicados a garantir o bem-estar de cada participante, com avaliações e orientações personalizadas.",
  },
  {
    icon: Apple,
    title: "Nutricionista Esportiva",
    description:
      "Orientação nutricional especializada para potencializar os resultados dos treinos e promover hábitos alimentares saudáveis.",
  },
  {
    icon: Activity,
    title: "Prevenção e Qualidade de Vida",
    description:
      "Programas focados na prevenção de doenças e promoção da saúde integral, para todas as faixas etárias.",
  },
  {
    icon: Heart,
    title: "Saúde Mental e Bem-Estar",
    description:
      "O esporte como ferramenta de equilíbrio emocional, autoestima e socialização, combatendo ansiedade e depressão.",
  },
];

export function Health() {
  return (
    <section className="section-padding bg-gradient-to-br from-brand-blue to-blue-900 text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="container-page relative z-10">
        <ScrollReveal>
          <SectionTitle
            subtitle="Saúde e Bem-Estar"
            title="Profissionais que cuidam de você"
            description="Além das modalidades esportivas, contamos com uma equipe de profissionais da saúde e nutrição esportiva para oferecer o melhor acompanhamento."
            light
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <ScrollReveal key={benefit.title} delay={i * 0.1}>
              <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-xl bg-brand-orange flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon size={26} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3">
                  {benefit.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
