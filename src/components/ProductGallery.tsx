import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from "lucide-react";
import { IconTile } from "./ui";
import type { IconType } from "../types";

interface ProductGalleryProps {
  icon: IconType;
  images?: string[];
  imageUrl?: string;
  name?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ icon, images = [], imageUrl, name }) => {
  // Consolidate images (up to 3 photos)
  const validImages = React.useMemo(() => {
    const list = Array.isArray(images) ? images.filter((img) => img && typeof img === "string" && img.trim() !== "") : [];
    if (list.length === 0 && imageUrl && imageUrl.trim() !== "") {
      list.push(imageUrl);
    }
    return list.slice(0, 3);
  }, [images, imageUrl]);

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reset active index if validImages changes or is out of bounds
  useEffect(() => {
    setActive(0);
  }, [validImages.length, imageUrl]);

  const hasPhotos = validImages.length > 0;
  const currentPhoto = hasPhotos ? validImages[active] : null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasPhotos) return;
    setActive((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasPhotos) return;
    setActive((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, validImages.length]);

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="relative aspect-square rounded-2xl overflow-hidden dk-surface-2 border group" style={{ borderColor: "var(--border)" }}>
        {hasPhotos && currentPhoto ? (
          <div
            className="w-full h-full flex items-center justify-center p-3 cursor-zoom-in bg-gradient-to-b from-transparent to-black/5 dark:to-white/5"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={currentPhoto}
              alt={`${name || "Produit DomoTek"} - Photo ${active + 1}`}
              loading="eager"
              decoding="async"
              className="max-h-full max-w-full object-contain rounded-xl transition-all duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <IconTile Icon={icon} variant={((active + 1) as 1 | 2 | 3)} />
        )}

        {/* Counter Badge if multiple images */}
        {validImages.length > 1 && (
          <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-md z-10">
            {active + 1} / {validImages.length}
          </div>
        )}

        {/* Zoom Lightbox Trigger Button */}
        {hasPhotos && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-slate-900/90 z-10"
            title="Agrandir la photo"
            aria-label="Agrandir la photo"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}

        {/* Navigation Arrows for Multiple Photos */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-slate-900/90 z-10"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-slate-900/90 z-10"
              aria-label="Photo suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row (1 to 3 items) */}
      {hasPhotos ? (
        validImages.length > 1 && (
          <div className="flex gap-2.5 items-center">
            {validImages.map((img, i) => {
              const isActive = active === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative h-20 w-20 rounded-xl overflow-hidden dk-surface-2 p-1 transition-all duration-200 flex items-center justify-center border ${
                    isActive
                      ? "ring-2 ring-cyan-500 border-cyan-500 scale-105 shadow-md shadow-cyan-500/10"
                      : "opacity-70 hover:opacity-100 hover:border-cyan-500/40"
                  }`}
                  style={{ borderColor: isActive ? "var(--teal)" : "var(--border)" }}
                  aria-label={`Afficher la photo ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Miniature ${i + 1}`}
                    loading="eager"
                    decoding="async"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                  <span className="absolute bottom-1 right-1 bg-slate-950/70 text-white text-[9px] font-mono px-1 rounded font-bold leading-tight">
                    #{i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )
      ) : (
        /* Fallback icon thumbnails if no photo provided */
        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="h-16 w-16 rounded-xl overflow-hidden dk-focus"
              style={{ outline: active === i ? "2px solid var(--teal)" : "1px solid var(--border)" }}
            >
              <IconTile Icon={icon} variant={((i + 1) as 1 | 2 | 3)} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && hasPhotos && currentPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
              <ImageIcon className="h-4 w-4 text-cyan-400" />
              <span>{name || "Aperçu du produit"}</span>
              {validImages.length > 1 && (
                <span className="text-white/60 font-mono text-xs">({active + 1} sur {validImages.length})</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center p-2"
            onClick={() => setLightboxOpen(false)}
          >
            <img
              src={currentPhoto}
              alt={name || "Photo plein écran"}
              loading="eager"
              decoding="async"
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Lightbox thumbnail strip */}
              <div className="absolute bottom-4 flex gap-2 z-20">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(i);
                    }}
                    className={`h-14 w-14 rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-black/40 ${
                      active === i ? "border-cyan-400 scale-105" : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

