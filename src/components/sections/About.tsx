"use client";

import { motion } from "framer-motion";
import { Heart, Users, Shield, Sparkles, Target, Star } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionTitle } from "@/components/shared/SectionTitle";

const values = [
  {
    icon: Heart,
    title: "Inclusão",
    description:
      "Acreditamos que o esporte é para todos. Aqui, cada pessoa encontra seu espaço, independente de idade, gênero ou condição social.",
  },
  {
    icon: Target,
    title: "Disciplina",
    description:
      "Através do esporte, cultivamos disciplina, foco e determinação — valores que transformam atletas e cidadãos.",
  },
  {
    icon: Shield,
    title: "Saúde",
    description:
      "Com profissionais dedicados e nutricionista esportiva, promovemos saúde física e mental para todos os participantes.",
  },
  {
    icon: Users,
    title: "Comunidade",
    description:
      "Mais que um projeto esportivo, somos uma família. Fortalecemos laços e construímos uma comunidade mais unida e solidária.",
  },
];

export function About() {
  return (
    <section id="sobre" className="section-padding bg-white">
      <div className="container-page">
        <ScrollReveal>
          <SectionTitle
            subtitle="Nossa História"
            title="Um projeto que nasceu para transformar vidas"
            description="O 'Você é Incrível' nasceu do sonho de oferecer oportunidades reais de transformação através do esporte. Acreditamos que cada pessoa carrega um potencial extraordinário — basta o ambiente certo para despertá-lo."
          />
        </ScrollReveal>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                  alt="Comunidade unida pelo esporte"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-orange text-white rounded-2xl p-6 shadow-xl hidden sm:block">
                <p className="font-heading font-black text-3xl">100%</p>
                <p className="text-sm font-medium">Gratuito</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                Em Belford Roxo, no coração do Barro Vermelho, criamos um
                espaço onde crianças, adolescentes, adultos e idosos encontram
                muito mais que atividade física — encontram propósito, acolhimento
                e a chance de escrever uma nova história.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Com o apoio de lideranças comprometidas com o desenvolvimento
                social, oferecemos oito modalidades esportivas, acompanhamento
                profissional de saúde e nutrição esportiva — tudo totalmente
                gratuito.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nosso objetivo é claro: mostrar para cada participante que ele é
                capaz, que ele é forte, que ele é incrível. Porque quando o
                esporte encontra a oportunidade, vidas são transformadas.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <ScrollReveal key={value.title} delay={i * 0.1}>
              <div className="group p-8 rounded-2xl bg-brand-light hover:bg-brand-blue transition-all duration-500 text-center">
                <div className="w-14 h-14 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 group-hover:text-white transition-all duration-500">
                  <value.icon size={28} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-white transition-colors duration-500">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                  {value.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
