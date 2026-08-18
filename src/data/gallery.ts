export interface GalleryPhoto {
  id: string;
  url: string;
  thumbnail?: string;
  caption: string;
  category: GalleryCategory;
  date: string;
}

export type GalleryCategory =
  | "Aulas"
  | "Eventos"
  | "Competições"
  | "Confraternizações"
  | "Comunidade"
  | "Premiações";

export const galleryCategories: GalleryCategory[] = [
  "Aulas",
  "Eventos",
  "Competições",
  "Confraternizações",
  "Comunidade",
  "Premiações",
];

export const defaultGalleryPhotos: GalleryPhoto[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?w=1200&q=80",
    caption: "Aula de natação para crianças",
    category: "Aulas",
    date: "2026-07-01",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80",
    caption: "Treino funcional em grupo",
    category: "Aulas",
    date: "2026-07-02",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=80",
    caption: "Aula de Jiu-Jitsu",
    category: "Aulas",
    date: "2026-07-03",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80",
    caption: "Evento comunitário de inauguração",
    category: "Eventos",
    date: "2026-07-18",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=1200&q=80",
    caption: "Aula de Zumba",
    category: "Aulas",
    date: "2026-07-04",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&q=80",
    caption: "Treino de Boxe",
    category: "Aulas",
    date: "2026-07-05",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    caption: "Confraeternização da equipe",
    category: "Confraternizações",
    date: "2026-07-10",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1200&q=80",
    caption: "Atividade física na comunidade",
    category: "Comunidade",
    date: "2026-07-06",
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1615117972428-28de67cda58e?w=1200&q=80",
    caption: "Treino de Muay Thai",
    category: "Aulas",
    date: "2026-07-07",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1588681663235-2c45f9a7b4e2?w=1200&q=80",
    caption: "Roda de capoeira especial",
    category: "Eventos",
    date: "2026-07-08",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200&q=80",
    caption: "Hidroginástica para idosos",
    category: "Aulas",
    date: "2026-07-09",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80",
    caption: "Premiação dos destaques do mês",
    category: "Premiações",
    date: "2026-07-15",
  },
];

export function getGalleryPhotos(): GalleryPhoto[] {
  if (typeof window === "undefined") return defaultGalleryPhotos;
  try {
    const stored = localStorage.getItem("gallery");
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultGalleryPhotos;
}

export function setGalleryPhotos(photos: GalleryPhoto[]) {
  localStorage.setItem("gallery", JSON.stringify(photos));
}
