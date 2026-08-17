import type { Metadata } from "next";
import { Modalities } from "@/components/sections/Modalities";

export const metadata: Metadata = {
  title: "Modalidades",
  description:
    "Conheça nossas 8 modalidades esportivas gratuitas: natação, hidroginástica, funcional, zumba, jiu-jitsu, boxe, muay thai e capoeira.",
};

export default function ModalidadesPagina() {
  return (
    <div className="pt-20">
      <Modalities />
    </div>
  );
}
