import React, { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { IconTile, StockLabel } from "./ui";
import { formatDZD } from "../lib/format";
import type { Store } from "../types";

export const QuickViewModal: React.FC<{ s: Store }> = ({ s }) => {
  const p = s.quickViewProduct;
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  const validImages = React.useMemo(() => {
    if (!p) return [];
    const list = Array.isArray(p.images)
      ? p.images.filter((img) => img && typeof img === "string" && img.trim() !== "")
      : [];
    if (list.length === 0 && p.imageUrl && p.imageUrl.trim() !== "") {
      list.push(p.imageUrl);
    }
    return list.slice(0, 3);
  }, [p]);

  useEffect(() => {
    setImgIndex(0);
  }, [p?.id]);

  if (!p) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => s.setQuickViewProduct(null)} />
      <div className="relative dk-surface rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={() => s.setQuickViewProduct(null)} className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full dk-surface-2 dk-focus z-20" aria-label="Fermer">
          <X className="h-4 w-4" style={{ color: "var(--text)" }} />
        </button>

        {/* Interactive Photo Carousel */}
        <div className="relative h-48 w-48 mx-auto mb-4 rounded-2xl overflow-hidden dk-surface-2 flex items-center justify-center border group" style={{ borderColor: "var(--border)" }}>
          {validImages.length > 0 ? (
            <img
              src={validImages[imgIndex] || validImages[0]}
              alt={`${p.name} - Photo ${imgIndex + 1}`}
              className="max-h-full max-w-full object-contain p-2"
            />
          ) : (
            <IconTile Icon={p.icon} />
          )}

          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setImgIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setImgIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm">
                {validImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImgIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      imgIndex === idx
                        ? "w-4 bg-cyan-400"
                        : "w-1.5 bg-white/40 hover:bg-white/80"
                    }`}
                    aria-label={`Photo ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>{s.categoryLabel[p.category] || p.category}</p>
        <h3 className="dk-heading text-lg font-semibold mt-1" style={{ color: "var(--text)" }}>{p.name}</h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>{p.shortDesc}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="dk-heading text-xl font-semibold" style={{ color: "var(--text)" }}>{formatDZD(p.price)}</span>
          {p.oldPrice && <span className="text-sm line-through" style={{ color: "var(--text-faint)" }}>{formatDZD(p.oldPrice)}</span>}
        </div>
        <div className="mt-2"><StockLabel stock={p.stock} /></div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center dk-surface-2 rounded-xl">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 flex items-center justify-center dk-focus" aria-label="Diminuer">
              <Minus className="h-4 w-4" style={{ color: "var(--text)" }} />
            </button>
            <span className="w-8 text-center text-sm" style={{ color: "var(--text)" }}>{qty}</span>
            <button onClick={() => setQty(Math.min(20, qty + 1))} className="h-10 w-10 flex items-center justify-center dk-focus" aria-label="Augmenter">
              <Plus className="h-4 w-4" style={{ color: "var(--text)" }} />
            </button>
          </div>
          <button
            onClick={() => { s.addToCart(p, qty); s.setQuickViewProduct(null); }}
            disabled={p.stock === "out"}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold dk-btn-primary disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" /> Ajouter au panier
          </button>
        </div>
        <button onClick={() => { s.openProduct(p); s.setQuickViewProduct(null); }} className="mt-3 w-full text-center text-sm dk-focus rounded" style={{ color: "var(--teal)" }}>
          Voir la fiche complète
        </button>
      </div>
    </div>
  );
};
