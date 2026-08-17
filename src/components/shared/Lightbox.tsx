"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhoto } from "@/data/gallery";

interface LightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const photo = photos[currentIndex];
  const [loaded, setLoaded] = useState(false);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length);
    setLoaded(false);
  }, [currentIndex, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
    setLoaded(false);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  if (!photo) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-10 text-white/70 text-sm font-medium">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-[90vw] max-h-[85vh] relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.caption}
              className="max-w-[90vw] max-h-[75vh] object-contain rounded-lg"
              onLoad={() => setLoaded(true)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-center"
        >
          <p className="text-white text-base font-medium">{photo.caption}</p>
          <p className="text-white/50 text-sm mt-1">
            {new Date(photo.date).toLocaleDateString("pt-BR")} &middot;{" "}
            {photo.category}
          </p>
        </motion.div>
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </motion.div>
  );
}
