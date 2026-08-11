"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProspectoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const hasSeenProspecto = localStorage.getItem("prospecto-seen-v2");

    if (!hasSeenProspecto) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  const handleClose = () => {
    localStorage.setItem("prospecto-seen-v2", "true");
    setIsOpen(false);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[200] backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-3 sm:inset-5 md:inset-8 lg:inset-12 z-[201] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full h-full max-w-6xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-blue to-blue-900 text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-orange flex items-center justify-center shrink-0">
                    <FileText size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-base sm:text-xl">
                      Bem-vindo ao Instituto Faz Teu Nome
                    </h2>
                    <p className="text-white/80 text-xs sm:text-sm">
                      Conheça nossa história e missão
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Fechar"
                >
                  <X size={24} />
                </button>
              </div>

              {/* PDF Viewer - Using Google Docs Viewer for better compatibility */}
              <div className="flex-1 bg-gray-100 relative overflow-hidden min-h-0">
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "") + "/prospecto.pdf"}&embedded=true`}
                  className="w-full h-full border-0"
                  title="Prospecto Instituto Faz Teu Nome"
                  loading="lazy"
                />
              </div>

              {/* Footer */}
              <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                  📄 Prospecto completo — 24 páginas
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <a
                    href="/prospecto.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white font-heading font-semibold text-sm hover:bg-brand-blue/90 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Abrir PDF
                  </a>
                  <a
                    href="/prospecto.pdf"
                    download="Prospecto_Instituto_Faz_Teu_Nome.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange text-white font-heading font-semibold text-sm hover:bg-brand-orange/90 transition-colors"
                  >
                    <Download size={16} />
                    Baixar PDF
                  </a>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="rounded-xl font-heading font-semibold text-sm px-4 py-2.5"
                  >
                    Continuar
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
