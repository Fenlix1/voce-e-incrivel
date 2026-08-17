"use client";

import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getEvents } from "@/data/events";

export function EventsPreview() {
  const events = getEvents().slice(0, 3);

  return (
    <section id="eventos" className="section-padding bg-brand-light">
      <div className="container-page">
        <ScrollReveal>
          <SectionTitle
            subtitle="Agenda"
            title="Próximos Eventos"
            description="Fique por dentro da nossa programação e participe!"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, i) => {
            const eventDate = new Date(event.date + "T" + event.time);
            return (
              <ScrollReveal key={event.id} delay={i * 0.1}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-48 overflow-hidden">
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
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-brand-blue transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal>
          <div className="text-center mt-10">
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 text-brand-blue font-heading font-semibold hover:text-brand-orange transition-colors group"
            >
              Ver todos os eventos
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
