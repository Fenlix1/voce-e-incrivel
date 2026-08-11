"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProspectoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se já viu o prospecto antes
    const hasSeenProspecto = sessionStorage.getItem("prospecto-seen");

    if (!hasSeenProspecto) {
      // Aguarda 1 segundo após o carregamento para abrir
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("prospecto-seen", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[200] backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[201] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-3xl shadow-2xl w-full h-full max-w-6xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-blue to-blue-900 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-xl">
                      Bem-vindo ao Instituto Faz Teu Nome
                    </h2>
                    <p className="text-white/80 text-sm">
                      Conheça nossa história e missão
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Fechar"
                >
                  <X size={24} />
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 bg-gray-100 relative overflow-hidden">
                <iframe
                  src="/prospecto.pdf"
                  className="w-full h-full border-0"
                  title="Prospecto Instituto Faz Teu Nome"
                />
              </div>

              {/* Footer */}
              <div className="bg-white border-t border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-gray-600 text-sm text-center sm:text-left">
                  📄 Prospecto completo do Instituto - 24 páginas
                </p>
                <div className="flex gap-2">
                  <a
                    href="/prospecto.pdf"
                    download="Prospecto_Instituto_Faz_Teu_Nome.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white font-heading font-semibold text-sm hover:bg-brand-blue/90 transition-colors"
                  >
                    <Download size={16} />
                    Baixar PDF
                  </a>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="rounded-xl font-heading font-semibold"
                  >
                    Continuar para o site
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
