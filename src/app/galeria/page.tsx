import type { Metadata } from "next";
import { Gallery } from "@/components/sections/Gallery";

export const metadata: Metadata = {
  title: "Galeria",
  description:
    "Confira os melhores momentos do projeto Você é Incrível. Fotos de aulas, eventos, competições e muito mais.",
};

export default function GaleriaPagina() {
  return (
    <div className="pt-20">
      <Gallery />
    </div>
  );
}
