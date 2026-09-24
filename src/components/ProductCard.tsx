import React, { useState, useEffect } from "react";
import { ArrowRight, Info, Heart, Eye, ShoppingCart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductTile } from "./ui";
import { formatDZD } from "../lib/format";
import type { Product, Store } from "../types";

export const ProductCard: React.FC<{ product: Product; s: Store }> = ({ product, s }) => {
  const [added, setAdded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const discount = (product.oldPrice && product.oldPrice > product.price)
    ? Math.round((100 * (product.oldPrice - product.price)) / product.oldPrice)
    : null;
  const inWishlist = s.wishlist.has(product.id);

  // Consolidate valid images (1 to 3)
  const validImages = React.useMemo(() => {
    const list = Array.isArray(product.images)
      ? product.images.filter((img) => img && typeof img === "string" && img.trim() !== "")
      : [];
    if (list.length === 0 && product.imageUrl && product.imageUrl.trim() !== "") {
      list.push(product.imageUrl);
    }
    return list.slice(0, 3);
  }, [product.images, product.imageUrl]);

  useEffect(() => {
    setImgIndex(0);
  }, [product.id, product.images, product.imageUrl]);

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (validImages.length <= 1) return;
    setImgIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (validImages.length <= 1) return;
    setImgIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setImgIndex(idx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 35 && validImages.length > 1) {
      if (diff > 0) {
        setImgIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
      } else {
        setImgIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
      }
    }
    setTouchStartX(null);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === "out") return;
    s.addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col dk-surface rounded-2xl overflow-hidden h-full hover:border-cyan-500/40 transition-all duration-300 shadow-md hover:shadow-cyan-500/10">
      {/* Product visual container */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => s.openProduct(product)}
        onKeyDown={(e) => { if (e.key === "Enter") s.openProduct(product); }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-[4/3] w-full cursor-pointer dk-focus dk-surface-2 p-3 select-none"
      >
        {validImages.length > 0 ? (
          <div className="relative h-full w-full overflow-hidden rounded-xl dk-surface flex items-center justify-center p-1 group">
            <img
              src={validImages[imgIndex] || validImages[0]}
              alt={`${product.name} - Photo ${imgIndex + 1}`}
              loading="eager"
              decoding="async"
              className="max-h-full max-w-full object-contain rounded transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <ProductTile Icon={product.icon} name={product.name} />
        )}

        {/* Carousel Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md backdrop-blur-sm"
              title="Photo précédente"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md backdrop-blur-sm"
              title="Photo suivante"
              aria-label="Photo suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => handleDotClick(e, idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    imgIndex === idx
                      ? "w-4 bg-cyan-400 shadow-sm"
                      : "w-1.5 bg-white/40 hover:bg-white/80"
                  }`}
                  aria-label={`Photo ${idx + 1}`}
                />
              ))}
            </div>

            {/* Photo counter badge */}
            <span className="absolute top-2.5 right-11 z-10 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              {imgIndex + 1}/{validImages.length}
            </span>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1 pointer-events-none z-10">
          {product.isNew && (
            <span className="inline-flex items-center w-fit bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md border border-white/20 whitespace-nowrap leading-tight">
              Nouveau
            </span>
          )}
          {discount !== null && discount > 0 && (
            <span className="inline-flex items-center w-fit bg-amber-500 text-slate-950 dark:bg-amber-400 dark:text-slate-950 font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full shadow-md border border-amber-300/40 whitespace-nowrap leading-tight">
              -{discount}%
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="inline-flex items-center w-fit bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full shadow-md border border-indigo-400/30 whitespace-nowrap leading-tight">
              ★ Top Vente
            </span>
          )}
        </div>

        {product.stock !== "in" && (
          <div className="absolute inset-x-2.5 bottom-2.5 pointer-events-none z-10">
            <span
              className={`block text-center text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                product.stock === "out"
                  ? "bg-rose-600/90 text-white dark:bg-rose-600 dark:text-white border border-rose-400/40"
                  : "bg-amber-500/90 text-slate-950 dark:bg-amber-400 dark:text-slate-950 border border-amber-300/40"
              }`}
            >
              {product.stock === "out" ? "Rupture de stock" : "Stock limité"}
            </span>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); s.toggleWishlist(product.id); }}
          className="hidden md:flex absolute top-2.5 right-2.5 h-8 w-8 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition duration-200 dk-focus z-10 shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          aria-label="Ajouter aux favoris"
        >
          <Heart className="h-4 w-4" style={{ color: inWishlist ? "var(--amber)" : "var(--text-faint)", fill: inWishlist ? "var(--amber)" : "none" }} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); s.setQuickViewProduct(product); }}
          className="hidden md:flex absolute bottom-2.5 right-2.5 h-8 w-8 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition duration-200 dk-focus z-10 shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          aria-label="Aperçu rapide"
        >
          <Eye className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        <button
          onClick={() => s.openProduct(product)}
          className="text-left text-base font-bold leading-snug dk-heading dk-focus rounded group-hover:text-cyan-500 transition-colors line-clamp-1"
          style={{ color: "var(--text)" }}
        >
          {product.name}
        </button>

        <p className="text-xs mt-1 leading-relaxed line-clamp-2 min-h-[32px]" style={{ color: "var(--text-dim)" }}>
          {product.shortDesc}
        </p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-extrabold dk-heading tracking-tight" style={{ color: "var(--text)" }}>
            {formatDZD(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs line-through" style={{ color: "var(--text-faint)" }}>
              {formatDZD(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Compatibility info pill */}
        <div className="mt-2.5">
          <button
            onClick={(e) => { e.stopPropagation(); s.setQuickViewProduct(product); }}
            className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium dk-chip-teal hover:opacity-80 transition-all"
          >
            <Info className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--teal)" }} />
            <span>Compatibilité à vérifier</span>
          </button>
        </div>

        {/* Actions: Direct Add to Cart + Product details view */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === "out"}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              added
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-[1.02]"
                : "dk-btn-primary"
            } disabled:opacity-40 disabled:pointer-events-none`}
            aria-label="Ajouter au panier"
          >
            {added ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5] shrink-0" />
                <span>Ajouté !</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {product.stock === "out" ? "Rupture" : "Ajouter au panier"}
                </span>
              </>
            )}
          </button>

          <button
            onClick={() => s.openProduct(product)}
            className="py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all shrink-0 border hover:border-cyan-500/50 hover:text-cyan-500"
            style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text-dim)" }}
            title="Voir les détails du produit"
            aria-label="Voir le produit"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

