"use client";

import {
  MessageCircle,
  Camera,
  Share2,
  Mail,
  Phone,
} from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SITE_CONFIG } from "@/lib/constants";

const contactMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: SITE_CONFIG.contact.whatsappDisplay,
    href: `https://wa.me/${SITE_CONFIG.contact.whatsapp}`,
    color: "bg-green-500",
  },
  {
    icon: Camera,
    title: "Instagram",
    value: SITE_CONFIG.contact.instagram,
    href: SITE_CONFIG.contact.instagramUrl,
    color: "bg-pink-500",
  },
  {
    icon: Share2,
    title: "Facebook",
    value: SITE_CONFIG.contact.facebook,
    href: SITE_CONFIG.contact.facebookUrl,
    color: "bg-blue-600",
  },
  {
    icon: Mail,
    title: "Email",
    value: SITE_CONFIG.contact.email,
    href: `mailto:${SITE_CONFIG.contact.email}`,
    color: "bg-red-500",
  },
  {
    icon: Phone,
    title: "Telefone",
    value: SITE_CONFIG.contact.phone,
    href: `tel:${SITE_CONFIG.contact.whatsapp}`,
    color: "bg-brand-blue",
  },
];

export function Contact() {
  return (
    <section id="contato" className="section-padding bg-brand-light">
      <div className="container-page">
        <ScrollReveal>
          <SectionTitle
            subtitle="Fale Conosco"
            title="Entre em contato"
            description="Tem dúvidas? Quer saber mais sobre o projeto? Fale com a gente!"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {contactMethods.map((method, i) => (
            <ScrollReveal key={method.title} delay={i * 0.08}>
              <a
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <method.icon size={24} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-sm mb-1">
                  {method.title}
                </h3>
                <p className="text-gray-500 text-xs break-all">
                  {method.value}
                </p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
