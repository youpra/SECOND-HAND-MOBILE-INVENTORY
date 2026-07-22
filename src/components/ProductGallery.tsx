"use client";

import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: any[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  // If no images, provide default placeholder
  const list = images.length > 0 ? images : [{ image: { url: "/media/placeholder.jpg", alt: "Placeholder" } }];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const handleThumbnailClick = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
    setSelectedIndex(index);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Viewport */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 flex items-center justify-center">
        {/* Swipe Viewport */}
        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {list.map((item: any, idx: number) => (
              <div key={idx} className="flex-[0_0_100%] min-w-0 h-full relative flex items-center justify-center">
                <img
                  src={item.image?.url || "/media/placeholder.jpg"}
                  alt={item.image?.alt || "Product image"}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Navigation */}
        {list.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-800 bg-slate-950/80 p-2 text-slate-300 hover:bg-slate-905 hover:text-white transition-all shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-800 bg-slate-950/80 p-2 text-slate-300 hover:bg-slate-905 hover:text-white transition-all shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Lightbox Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 rounded-xl border border-slate-850 bg-slate-950/95 p-2 text-slate-400 hover:text-white transition-all shadow-md backdrop-blur-sm hover:scale-105"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnails Navigation */}
      {list.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {list.map((item: any, idx: number) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`relative aspect-square w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl border bg-slate-900/60 p-1 transition-all ${
                selectedIndex === idx ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <img
                src={item.image?.url || "/media/placeholder.jpg"}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-contain rounded-lg"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full Screen Lightbox Zoom Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 rounded-full border border-slate-800 bg-slate-900/80 p-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Lightbox main image */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-full max-w-full flex items-center justify-center"
            >
              <img
                src={list[selectedIndex]?.image?.url || "/media/placeholder.jpg"}
                alt={list[selectedIndex]?.image?.alt || "Zoom view"}
                className="max-h-[85vh] max-w-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
