export interface Supporter {
  id: string;
  name: string;
  role: string;
  logo?: string;
  url?: string;
}

export const defaultSupporters: Supporter[] = [
  {
    id: "dr-luizinho",
    name: "Deputado Federal Dr. Luizinho",
    role: "Apoio Cultural",
  },
  {
    id: "amigo-pires",
    name: "Amigo Pires",
    role: "Apoio Cultural",
  },
  {
    id: "raphael-amaral",
    name: "Raphael Amaral",
    role: "Apoio Cultural",
  },
  {
    id: "felipinho-ravis",
    name: "Deputado Felipinho Ravis",
    role: "Apoio Cultural",
  },
];

export function getSupporters(): Supporter[] {
  if (typeof window === "undefined") return defaultSupporters;
  try {
    const stored = localStorage.getItem("supporters");
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultSupporters;
}

export function setSupporters(supporters: Supporter[]) {
  localStorage.setItem("supporters", JSON.stringify(supporters));
}
