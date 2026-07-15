export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  featured?: boolean;
}

export const defaultEvents: Event[] = [
  {
    id: "inauguracao",
    title: "Inauguração do Projeto Você é Incrível",
    description:
      "Venha celebrar conosco a abertura oficial do projeto! Um dia especial com apresentações das modalidades, café da manhã comunitário e muita energia positiva.",
    date: "2026-07-18",
    time: "09:00",
    location: "Rua Agai, Travessa 13 - Barro Vermelho, Belford Roxo - RJ",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    featured: true,
  },
  {
    id: "aulão-funcional",
    title: "Aulão de Funcional ao Ar Livre",
    description:
      "Aulão especial de treinamento funcional aberto a toda comunidade. Traga sua garrafa de água e venha suar com a gente!",
    date: "2026-08-01",
    time: "08:00",
    location: "Rua Agai, Travessa 13 - Barro Vermelho, Belford Roxo - RJ",
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80",
  },
  {
    id: "festival-capoeira",
    title: "Festival de Capoeira - Edição Especial",
    description:
      "Roda de capoeira especial com mestres convidados, apresentações culturais e batizado dos novos alunos.",
    date: "2026-08-15",
    time: "10:00",
    location: "Rua Agai, Travessa 13 - Barro Vermelho, Belford Roxo - RJ",
    image: "https://images.unsplash.com/photo-1588681663235-2c45f9a7b4e2?w=800&q=80",
  },
];

export function getEvents(): Event[] {
  if (typeof window === "undefined") return defaultEvents;
  try {
    const stored = localStorage.getItem("events");
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultEvents;
}

export function setEvents(events: Event[]) {
  localStorage.setItem("events", JSON.stringify(events));
}
