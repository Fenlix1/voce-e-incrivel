export interface ContactInfo {
  whatsapp: string;
  whatsappDisplay: string;
  instagram: string;
  instagramUrl: string;
  facebook: string;
  facebookUrl: string;
  email: string;
  phone: string;
}

export const defaultContact: ContactInfo = {
  whatsapp: "5521981443105",
  whatsappDisplay: "(21) 98144-3105",
  instagram: "@fazteunome",
  instagramUrl: "https://instagram.com/fazteunome",
  facebook: "/fazteunome",
  facebookUrl: "https://facebook.com/fazteunome",
  email: "contato@fazteunome.org",
  phone: "(21) 98144-3105",
};

export function getContact(): ContactInfo {
  if (typeof window === "undefined") return defaultContact;
  try {
    const stored = localStorage.getItem("contact");
    if (stored) return { ...defaultContact, ...JSON.parse(stored) };
  } catch {}
  return defaultContact;
}

export function setContact(contact: Partial<ContactInfo>) {
  localStorage.setItem("contact", JSON.stringify(contact));
}
