import type { Metadata } from "next";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { getEvents } from "@/data/events";
import { Calendar, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Confira a programação de eventos do projeto Você é Incrível. Aulões, festivais, competições e muito mais.",
};

export default function EventosPagina() {
  const events = getEvents();

  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="container-page">
          <ScrollReveal>
            <SectionTitle
              subtitle="Agenda Completa"
              title="Todos os Eventos"
              description="Fique por dentro de toda a nossa programação."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, i) => {
              const eventDate = new Date(event.date + "T" + event.time);
              return (
                <ScrollReveal key={event.id} delay={i * 0.1}>
                  <div className="group bg-brand-light rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-52 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-brand-orange text-white rounded-lg px-3 py-2 text-center leading-tight">
                        <p className="font-heading font-black text-xl">
                          {eventDate.getDate()}
                        </p>
                        <p className="text-xs font-medium uppercase">
                          {eventDate.toLocaleDateString("pt-BR", {
                            month: "short",
                          })}
                        </p>
                      </div>
                      {event.featured && (
                        <div className="absolute top-3 right-3 bg-brand-green text-white rounded-full px-3 py-1 text-xs font-bold">
                          Destaque
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-brand-blue transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>
                            {eventDate.toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {events.length === 0 && (
            <p className="text-center text-gray-400 py-12 text-lg">
              Nenhum evento cadastrado no momento. Volte em breve!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
