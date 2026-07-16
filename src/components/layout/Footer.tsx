import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Camera,
  Share2,
  MessageCircle,
  Heart,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const footerLinks = [
  {
    title: "Páginas",
    links: [
      { label: "Home", href: "/" },
      { label: "Sobre", href: "/sobre" },
      { label: "Modalidades", href: "/modalidades" },
      { label: "Galeria", href: "/galeria" },
      { label: "Eventos", href: "/eventos" },
      { label: "Notícias", href: "/noticias" },
      { label: "Contato", href: "/contato" },
    ],
  },
  {
    title: "Modalidades",
    links: [
      { label: "Natação", href: "/modalidades#natacao" },
      { label: "Hidroginástica", href: "/modalidades#hidroginastica" },
      { label: "Funcional", href: "/modalidades#funcional" },
      { label: "Jiu-Jitsu", href: "/modalidades#jiu-jitsu" },
      { label: "Boxe", href: "/modalidades#boxe" },
      { label: "Muay Thai", href: "/modalidades#muay-thai" },
      { label: "Capoeira", href: "/modalidades#capoeira" },
      { label: "Balé", href: "/modalidades#bale" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Main Footer */}
      <div className="container-page section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-orange flex items-center justify-center font-heading font-bold text-lg">
                FTN
              </div>
              <div>
                <p className="text-sm font-heading font-semibold tracking-wider">
                  FAZ TEU NOME
                </p>
                <p className="text-xs text-gray-400">Você é Incrível</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transformando vidas através do esporte, saúde, inclusão social e
              qualidade de vida em Belford Roxo - RJ.
            </p>
            <div className="flex items-center gap-3">
              {[
                {
                  icon: Camera,
                  href: SITE_CONFIG.contact.instagramUrl,
                  label: "Instagram",
                },
                {
                  icon: Share2,
                  href: SITE_CONFIG.contact.facebookUrl,
                  label: "Facebook",
                },
                {
                  icon: MessageCircle,
                  href: `https://wa.me/${SITE_CONFIG.contact.whatsapp}`,
                  label: "WhatsApp",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-brand-orange">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-brand-orange">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  <Phone size={16} />
                  {SITE_CONFIG.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  <Mail size={16} />
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin size={16} className="shrink-0 mt-0.5" />
                  <span>{SITE_CONFIG.address.full}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Projeto Social Você é Incrível -
            Faz Teu Nome. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Feito com <Heart size={12} className="text-red-500" /> para a
            comunidade de Belford Roxo
          </p>
        </div>
      </div>
    </footer>
  );
}
