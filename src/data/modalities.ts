import { Waves, Dumbbell, Music, Swords, Flame, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Modality {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  image: string;
  schedule: string;
}

export const defaultModalities: Modality[] = [
  {
    id: "natacao",
    name: "Natação",
    icon: "Waves",
    description:
      "Aulas de natação para todas as idades, do iniciante ao avançado. Desenvolvimento de técnicas, resistência e segurança na água.",
    image: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?w=600&q=80",
    schedule: "Manhã e Tarde",
  },
  {
    id: "hidroginastica",
    name: "Hidroginástica",
    icon: "Waves",
    description:
      "Exercícios aquáticos de baixo impacto, ideais para idosos e pessoas em reabilitação. Fortalecimento muscular e cardiovascular.",
    image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&q=80",
    schedule: "Manhã",
  },
  {
    id: "funcional",
    name: "Funcional",
    icon: "Dumbbell",
    description:
      "Treinos dinâmicos que trabalham o corpo todo, melhorando força, equilíbrio, coordenação e condicionamento físico geral.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    schedule: "Manhã, Tarde e Noite",
  },
  {
    id: "zumba",
    name: "Zumba",
    icon: "Music",
    description:
      "Aula dançante que mistura ritmos latinos e internacionais. Queima calórica intensa em um ambiente divertido e contagiante.",
    image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=600&q=80",
    schedule: "Manhã e Noite",
  },
  {
    id: "jiu-jitsu",
    name: "Jiu-Jitsu",
    icon: "Swords",
    description:
      "Arte marcial brasileira focada em técnicas de solo, alavancas e finalizações. Disciplina, respeito e autodefesa para todas as idades.",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&q=80",
    schedule: "Tarde e Noite",
  },
  {
    id: "boxe",
    name: "Boxe",
    icon: "Swords",
    description:
      "Treino de boxe que desenvolve agilidade, coordenação motora, reflexo e condicionamento. Ideal para quem busca superação pessoal.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80",
    schedule: "Tarde e Noite",
  },
  {
    id: "muay-thai",
    name: "Muay Thai",
    icon: "Flame",
    description:
      "Arte marcial tailandesa conhecida como a ciência das oito armas. Trabalha corpo e mente com técnicas de socos, chutes, joelhadas e cotoveladas.",
    image: "https://images.unsplash.com/photo-1615117972428-28de67cda58e?w=600&q=80",
    schedule: "Tarde e Noite",
  },
  {
    id: "capoeira",
    name: "Capoeira",
    icon: "Heart",
    description:
      "Patrimônio cultural brasileiro que une luta, dança, música e tradição. Desenvolve flexibilidade, ritmo e consciência corporal.",
    image: "https://images.unsplash.com/photo-1588681663235-2c45f9a7b4e2?w=600&q=80",
    schedule: "Manhã e Tarde",
  },
];

export function getModalities(): Modality[] {
  if (typeof window === "undefined") return defaultModalities;
  try {
    const stored = localStorage.getItem("modalities");
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultModalities;
}

export function setModalities(modalities: Modality[]) {
  localStorage.setItem("modalities", JSON.stringify(modalities));
}
