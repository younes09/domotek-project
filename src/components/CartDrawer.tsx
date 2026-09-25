import React from "react";
import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { ProductTile } from "./ui";
import { formatDZD } from "../lib/format";
import type { Store } from "../types";

export const CartDrawer: React.FC<{ s: Store }> = ({ s }) => {
  if (!s.cartOpen) return null;
  const items = s.cartItemsDetailed;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => s.setCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 w-full sm:w-96 dk-surface flex flex-col" style={{ borderLeft: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="dk-heading text-lg font-semibold" style={{ color: "var(--text)" }}>Panier ({s.cartCount})</p>
          <button onClick={() => s.setCartOpen(false)} className="h-9 w-9 flex items-center justify-center rounded-lg dk-focus" aria-label="Fermer le panier">
            <X className="h-5 w-5" style={{ color: "var(--text)" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 dk-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-10 w-10 mx-auto mb-3" style={{ color: "var(--text-faint)" }} />
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>Votre panier est vide.</p>
              <button onClick={() => { s.setCartOpen(false); s.goShop({}); }} className="mt-3 text-sm dk-focus rounded" style={{ color: "var(--teal)" }}>
                Découvrir les produits
              </button>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.key} className="flex gap-3 dk-surface-2 rounded-xl p-3">
                <div className="h-16 w-16 shrink-0">
                  <ProductTile
                    Icon={i.product.icon}
                    imageUrl={i.product.imageUrl}
                    images={i.product.images}
                    name={i.product.name}
                    variant={2}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{i.product.name}</p>
                  {i.variant && <p className="text-xs" style={{ color: "var(--text-faint)" }}>{i.variant}</p>}
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>{formatDZD(i.product.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center dk-surface rounded-lg">
                      <button onClick={() => s.updateQty(i.key, i.qty - 1)} className="h-7 w-7 flex items-center justify-center dk-focus" aria-label="Diminuer">
                        <Minus className="h-3 w-3" style={{ color: "var(--text)" }} />
                      </button>
                      <span className="w-6 text-center text-xs" style={{ color: "var(--text)" }}>{i.qty}</span>
                      <button onClick={() => s.updateQty(i.key, i.qty + 1)} className="h-7 w-7 flex items-center justify-center dk-focus" aria-label="Augmenter">
                        <Plus className="h-3 w-3" style={{ color: "var(--text)" }} />
                      </button>
                    </div>
                    <button onClick={() => s.removeFromCart(i.key)} className="h-7 w-7 flex items-center justify-center dk-focus" aria-label="Retirer">
                      <Trash2 className="h-4 w-4" style={{ color: "var(--danger)" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text-dim)" }}>Sous-total</span>
              <span style={{ color: "var(--text)" }}>{formatDZD(s.cartTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text-dim)" }}>Livraison</span>
              <span style={{ color: "var(--text-faint)" }}>Calculée à l'étape suivante</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold pt-1">
              <span style={{ color: "var(--text)" }}>Total</span>
              <span className="dk-heading" style={{ color: "var(--text)" }}>{formatDZD(s.cartTotal)}</span>
            </div>
            <button
              onClick={() => { s.setCartOpen(false); s.setView("checkout"); }}
              className="w-full rounded-xl py-3 text-sm font-semibold dk-btn-primary"
            >
              Passer la commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
