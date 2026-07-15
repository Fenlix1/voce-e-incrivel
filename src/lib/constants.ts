export const SITE_CONFIG = {
  name: "VOCÊ É INCRÍVEL",
  tagline: "FAZ TEU NOME",
  description:
    "Transformando vidas através do esporte, saúde, inclusão social e qualidade de vida.",
  url: "https://voce-e-incrivel.vercel.app",
  ogImage: "/images/og-image.jpg",
  address: {
    street: "Rua Agai, Travessa 13",
    neighborhood: "Barro Vermelho",
    city: "Belford Roxo",
    state: "RJ",
    full: "Rua Agai, Travessa 13 - Barro Vermelho, Belford Roxo - RJ",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.1234!2d-43.3593!3d-22.7618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ1JzQyLjUiUyA0M8KwMjEnMzMuNSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890",
    directionsUrl: "https://maps.google.com/?q=Rua+Agai+Travessa+13+Barro+Vermelho+Belford+Roxo+RJ",
  },
  contact: {
    whatsapp: "5521981443105",
    whatsappDisplay: "(21) 98144-3105",
    instagram: "@fazteunome",
    instagramUrl: "https://instagram.com/fazteunome",
    facebook: "/fazteunome",
    facebookUrl: "https://facebook.com/fazteunome",
    email: "contato@fazteunome.org",
    phone: "(21) 98144-3105",
  },
  ctaUrl: "https://cerulean-sunflower-53e6e1.netlify.app/",
  colors: {
    primary: "#0F4C81",
    accent: "#F97316",
    white: "#FFFFFF",
    light: "#F3F4F6",
    dark: "#111827",
    green: "#10B981",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
