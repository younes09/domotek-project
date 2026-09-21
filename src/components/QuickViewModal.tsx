import React, { useState } from "react";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { IconTile, StockLabel } from "./ui";
import { CATEGORY_LABEL } from "../data/categories";
import { formatDZD } from "../lib/format";
import type { Store } from "../types";

export const QuickViewModal: React.FC<{ s: Store }> = ({ s }) => {
  const p = s.quickViewProduct;
  const [qty, setQty] = useState(1);
  if (!p) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => s.setQuickViewProduct(null)} />
      <div className="relative dk-surface rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={() => s.setQuickViewProduct(null)} className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full dk-surface-2 dk-focus" aria-label="Fermer">
          <X className="h-4 w-4" style={{ color: "var(--text)" }} />
        </button>
        <div className="h-40 w-40 mx-auto mb-4"><IconTile Icon={p.icon} /></div>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>{CATEGORY_LABEL[p.category]}</p>
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
