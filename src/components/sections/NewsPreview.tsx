"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getNews } from "@/data/news";

export function NewsPreview() {
  const news = getNews().slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        <ScrollReveal>
          <SectionTitle
            subtitle="Fique Informado"
            title="Últimas Notícias"
            description="Acompanhe as novidades do projeto e fique por dentro de tudo que acontece."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.1}>
              <Link
                href={`/noticias#${item.id}`}
                className="group block bg-brand-light rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-52 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <Calendar size={12} />
                    <span>
                      {new Date(item.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-orange font-medium text-sm mt-4 group-hover:gap-2 transition-all">
                    Ler mais
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center mt-10">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-brand-blue font-heading font-semibold hover:text-brand-orange transition-colors group"
            >
              Ver todas as notícias
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
