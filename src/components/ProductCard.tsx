import React from "react";
import { ArrowRight, Info, Heart, Eye } from "lucide-react";
import { ProductTile } from "./ui";
import { formatDZD } from "../lib/format";
import type { Product, Store } from "../types";

export const ProductCard: React.FC<{ product: Product; s: Store }> = ({ product, s }) => {
  const discount = product.oldPrice ? Math.round((100 * (product.oldPrice - product.price)) / product.oldPrice) : null;
  const inWishlist = s.wishlist.has(product.id);

  return (
    <div className="group flex flex-col dk-surface rounded-2xl overflow-hidden h-full hover:border-cyan-500/40 transition-all duration-300 shadow-md hover:shadow-cyan-500/10">
      {/* Product visual container */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => s.openProduct(product)}
        onKeyDown={(e) => { if (e.key === "Enter") s.openProduct(product); }}
        className="relative aspect-[4/3] w-full cursor-pointer dk-focus dk-surface-2 p-4"
      >
        <ProductTile Icon={product.icon} imageUrl={product.imageUrl} name={product.name} />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none z-10">
          {product.isNew && (
            <span className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
              Nouveau
            </span>
          )}
          {discount && (
            <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
              -{discount}%
            </span>
          )}
        </div>

        {product.stock !== "in" && (
          <div className="absolute inset-x-2.5 bottom-2.5 pointer-events-none z-10">
            <span
              className="block text-center text-[11px] font-medium px-2 py-1 rounded-full backdrop-blur-md shadow-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: product.stock === "out" ? "var(--danger)" : "var(--amber)" }}
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

        {/* Primary CTA button */}
        <button
          onClick={() => s.openProduct(product)}
          disabled={product.stock === "out"}
          className="mt-3 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold dk-btn-primary flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          Voir le produit <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

