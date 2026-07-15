import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { getNews } from "@/data/news";
import { Calendar, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Notícias",
  description:
    "Acompanhe as últimas notícias do projeto Você é Incrível - Faz Teu Nome. Novidades, eventos e muito mais.",
};

export default function NoticiasPagina() {
  const news = getNews();

  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="container-page">
          <ScrollReveal>
            <SectionTitle
              subtitle="Blog"
              title="Notícias e Novidades"
              description="Acompanhe tudo que acontece no nosso projeto."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.1}>
                <article
                  id={item.id}
                  className="group bg-brand-light rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </span>
                      {item.author && (
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {item.author}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {item.summary}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                    <span className="inline-flex items-center gap-1 text-brand-orange font-medium text-sm mt-4 group-hover:gap-2 transition-all">
                      Continuar lendo
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {news.length === 0 && (
            <p className="text-center text-gray-400 py-12 text-lg">
              Nenhuma notícia cadastrada no momento.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
