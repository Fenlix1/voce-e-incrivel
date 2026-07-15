import type { Metadata } from "next";
import { About } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "Sobre o Projeto",
  description:
    "Conheça a história do projeto Você é Incrível - Faz Teu Nome. Transformando vidas através do esporte, inclusão e qualidade de vida em Belford Roxo - RJ.",
};

export default function SobrePagina() {
  return (
    <div className="pt-20">
      <About />
    </div>
  );
}
