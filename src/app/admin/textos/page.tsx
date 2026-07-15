"use client";

import { useState } from "react";
import { AdminAuthGate } from "@/components/layout/AdminAuthGate";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Save } from "lucide-react";

const defaultTexts = {
  heroSubtitle: "Projeto Social Esportivo",
  heroTagline: "FAZ TEU NOME",
  heroDescription:
    "Transformando vidas através do esporte, saúde, inclusão social e qualidade de vida.",
  aboutTitle: "Um projeto que nasceu para transformar vidas",
  aboutDescription:
    "O 'Você é Incrível' nasceu do sonho de oferecer oportunidades reais de transformação através do esporte.",
  aboutText1:
    "Em Belford Roxo, no coração do Barro Vermelho, criamos um espaço onde crianças, adolescentes, adultos e idosos encontram muito mais que atividade física — encontram propósito, acolhimento e a chance de escrever uma nova história.",
  aboutText2:
    "Com o apoio de lideranças comprometidas com o desenvolvimento social, oferecemos oito modalidades esportivas, acompanhamento profissional de saúde e nutrição esportiva — tudo totalmente gratuito.",
  scheduleInfo: "Manhã, Tarde e Noite - Consulte a grade de cada modalidade",
  ctaBannerTitle: "Pronto para fazer parte dessa transformação?",
  ctaBannerDescription:
    "Venha fazer parte do projeto social que está mudando vidas em Belford Roxo.",
};

export default function AdminTextosPage() {
  const [texts, setTexts] = useState(() => {
    if (typeof window === "undefined") return defaultTexts;
    try {
      const stored = localStorage.getItem("site-texts");
      return stored ? { ...defaultTexts, ...JSON.parse(stored) } : defaultTexts;
    } catch {
      return defaultTexts;
    }
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("site-texts", JSON.stringify(texts));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="lg:pl-64">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark">
                  Editar Textos
                </h1>
                <p className="text-gray-500">
                  Personalize os textos institucionais do site
                </p>
              </div>
              <Button
                onClick={handleSave}
                className="bg-brand-blue hover:bg-brand-blue/90 rounded-xl gap-2"
              >
                <Save size={18} />
                {saved ? "Salvo!" : "Salvar Alterações"}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-brand-orange" />
                  Hero (Seção Principal)
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Subtítulo do Hero</Label>
                    <Input
                      value={texts.heroSubtitle}
                      onChange={(e) =>
                        setTexts({ ...texts, heroSubtitle: e.target.value })
                      }
                      className="rounded-xl mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Tagline (FAZ TEU NOME)</Label>
                    <Input
                      value={texts.heroTagline}
                      onChange={(e) =>
                        setTexts({ ...texts, heroTagline: e.target.value })
                      }
                      className="rounded-xl mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Descrição do Hero</Label>
                    <Textarea
                      value={texts.heroDescription}
                      onChange={(e) =>
                        setTexts({ ...texts, heroDescription: e.target.value })
                      }
                      className="rounded-xl mt-1.5"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-brand-orange" />
                  Seção Sobre
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Título do Sobre</Label>
                    <Input
                      value={texts.aboutTitle}
                      onChange={(e) =>
                        setTexts({ ...texts, aboutTitle: e.target.value })
                      }
                      className="rounded-xl mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Descrição do Sobre</Label>
                    <Textarea
                      value={texts.aboutDescription}
                      onChange={(e) =>
                        setTexts({
                          ...texts,
                          aboutDescription: e.target.value,
                        })
                      }
                      className="rounded-xl mt-1.5"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Texto 1 - Sobre</Label>
                    <Textarea
                      value={texts.aboutText1}
                      onChange={(e) =>
                        setTexts({ ...texts, aboutText1: e.target.value })
                      }
                      className="rounded-xl mt-1.5"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Texto 2 - Sobre</Label>
                    <Textarea
                      value={texts.aboutText2}
                      onChange={(e) =>
                        setTexts({ ...texts, aboutText2: e.target.value })
                      }
                      className="rounded-xl mt-1.5"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-brand-orange" />
                  Horários e CTA
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Informação de Horários</Label>
                    <Input
                      value={texts.scheduleInfo}
                      onChange={(e) =>
                        setTexts({ ...texts, scheduleInfo: e.target.value })
                      }
                      className="rounded-xl mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Título do Banner CTA</Label>
                    <Input
                      value={texts.ctaBannerTitle}
                      onChange={(e) =>
                        setTexts({ ...texts, ctaBannerTitle: e.target.value })
                      }
                      className="rounded-xl mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Descrição do Banner CTA</Label>
                    <Textarea
                      value={texts.ctaBannerDescription}
                      onChange={(e) =>
                        setTexts({
                          ...texts,
                          ctaBannerDescription: e.target.value,
                        })
                      }
                      className="rounded-xl mt-1.5"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  );
}
