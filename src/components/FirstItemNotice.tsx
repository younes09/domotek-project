import React, { useEffect, useState } from "react";
import { ShoppingCart, ArrowRight, X, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";
import { ProductTile } from "./ui";
import { formatDZD } from "../lib/format";
import type { Store } from "../types";

export const FirstItemNotice: React.FC<{ s: Store }> = ({ s }) => {
  const notice = s.firstItemNotice;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notice) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const startTime = Date.now();
    const duration = 8500; // 8.5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPct);
      if (remainingPct <= 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [notice]);

  if (!notice) return null;

  const { product, qty, variant } = notice;

  const handleOpenCart = () => {
    s.setFirstItemNotice(null);
    s.setCartPulsing(false);
    s.setCartOpen(true);
  };

  const handleDismiss = () => {
    s.setFirstItemNotice(null);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed z-50 max-w-sm sm:max-w-md w-auto inset-x-3 sm:inset-x-auto sm:right-6 top-20 sm:top-24 transition-all duration-300"
    >
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl border-2 backdrop-blur-xl dk-surface transition-all duration-300"
        style={{
          borderColor: "var(--teal)",
          boxShadow: "0 16px 40px -10px rgba(0, 180, 255, 0.35)",
        }}
      >
        {/* Animated accent gradient top bar */}
        <div
          className="h-1.5 w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500"
        />

        <div className="p-4 sm:p-5">
          {/* Header with success badge and close button */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold dk-heading" style={{ color: "var(--text)" }}>
                  Produit ajouté au panier !
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                  <Sparkles className="h-2.5 w-2.5" /> 1er article
                </span>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="h-7 w-7 rounded-lg flex items-center justify-center dk-surface-2 dk-focus hover:opacity-80 transition-opacity"
              aria-label="Fermer la notification"
            >
              <X className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
            </button>
          </div>

          {/* Product snapshot */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
            <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden">
              <ProductTile
                Icon={product.icon}
                imageUrl={product.imageUrl}
                images={product.images}
                name={product.name}
                variant={2}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold truncate" style={{ color: "var(--text)" }}>
                {product.name}
              </p>
              {variant && (
                <p className="text-[11px] truncate" style={{ color: "var(--text-faint)" }}>
                  Option: {variant}
                </p>
              )}
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs sm:text-sm font-extrabold" style={{ color: "var(--teal)" }}>
                  {formatDZD(product.price)}
                </span>
                <span className="text-[11px] px-1.5 py-0.2 rounded dk-surface font-semibold" style={{ color: "var(--text-dim)" }}>
                  Qté: {qty}
                </span>
              </div>
            </div>
          </div>

          {/* Core Callout explaining where to find the cart */}
          <div
            className="mt-3 p-3 rounded-xl border flex items-start gap-2.5"
            style={{
              background: "var(--teal-dim)",
              borderColor: "rgba(0, 180, 255, 0.35)",
            }}
          >
            <span className="text-base shrink-0 mt-0.5">🛒</span>
            <div className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>
              <p className="font-semibold">
                Où retrouver votre article ?
              </p>
              <p className="mt-0.5 text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>
                Votre panier est disponible à tout moment via l'icône <strong className="font-bold text-cyan-600 dark:text-cyan-400">Panier en haut à droite</strong> de l'écran. Vous pouvez le consulter pour valider votre commande quand vous le souhaitez.
              </p>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="mt-4 flex items-center gap-2.5">
            <button
              onClick={handleOpenCart}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold dk-btn-primary flex items-center justify-center gap-2 transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span>Consulter mon panier</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </button>

            <button
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium dk-btn-secondary transition-all duration-200 shrink-0"
            >
              Continuer mes achats
            </button>
          </div>
        </div>

        {/* Auto-dismiss progress bar */}
        <div className="h-1 w-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-cyan-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
