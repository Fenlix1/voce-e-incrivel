import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Location } from "@/components/sections/Location";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com o projeto Você é Incrível - Faz Teu Nome. WhatsApp, Instagram, Facebook, email e telefone.",
};

export default function ContatoPagina() {
  return (
    <div className="pt-20">
      <Contact />
      <div className="bg-white">
        <Location />
      </div>
    </div>
  );
}
