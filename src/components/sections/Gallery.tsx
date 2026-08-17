"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Lightbox } from "@/components/shared/Lightbox";
import {
  getGalleryPhotos,
  galleryCategories,
  type GalleryCategory,
} from "@/data/gallery";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "Todas">("Todas");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allPhotos = getGalleryPhotos();
  const filteredPhotos =
    activeCategory === "Todas"
      ? allPhotos
      : allPhotos.filter((p) => p.category === activeCategory);

  return (
    <section id="galeria" className="section-padding bg-white">
      <div className="container-page">
        <ScrollReveal>
          <SectionTitle
            subtitle="Galeria"
            title="Momentos que inspiram"
            description="Conheça nossa história através de imagens. Cada foto representa uma vida sendo transformada pelo esporte."
          />
        </ScrollReveal>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {["Todas", ...galleryCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as GalleryCategory | "Todas")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === cat
                  ? "bg-brand-blue text-white shadow-lg"
                  : "bg-brand-light text-gray-600 hover:bg-brand-blue/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredPhotos.map((photo, i) => (
            <ScrollReveal key={photo.id} delay={i * 0.05}>
              <div
                className="group relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                onClick={() => {
                  const idx = allPhotos.findIndex((p) => p.id === photo.id);
                  setLightboxIndex(idx);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-medium text-sm">
                    {photo.caption}
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {new Date(photo.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            Nenhuma foto nesta categoria ainda.
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={allPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
