import React, { useEffect, useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { ProductGallery } from "../components/ProductGallery";
import { ProductReviews } from "../components/ProductReviews";
import { ProductGrid } from "../components/ProductGrid";
import { TrustBadges, StockLabel } from "../components/ui";
import { CATEGORY_LABEL } from "../data/categories";
import { PLACEHOLDER_TABS, PRODUCT_TABS } from "../data/detailTabs";
import { formatDZD } from "../lib/format";
import type { Store } from "../types";

export const ProductDetailView: React.FC<{ s: Store }> = ({ s }) => {
  const p = s.selectedProduct;
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("Description");
  const [variant, setVariant] = useState<string | null>(p?.variants ? p.variants.options[0] : null);

  useEffect(() => {
    setQty(1);
    setActiveTab("Description");
    setVariant(p?.variants ? p.variants.options[0] : null);
  }, [p]);

  if (!p) return null;
  const related = s.products.filter((r) => r.category === p.category && r.id !== p.id).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-10">
      <div className="flex items-center gap-2 text-xs mb-4" style={{ color: "var(--text-faint)" }}>
        <button onClick={() => s.goHome()} className="dk-focus rounded">Accueil</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => s.goShop({ category: p.category })} className="dk-focus rounded">{s.categoryLabel[p.category] || p.category}</button>
        <ChevronRight className="h-3 w-3" />
        <span style={{ color: "var(--text-dim)" }}>{p.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery key={p.id} icon={p.icon} />

        <div>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>{s.categoryLabel[p.category] || p.category}</p>
          <h1 className="dk-heading text-2xl font-semibold mt-1" style={{ color: "var(--text)" }}>{p.name}</h1>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-dim)" }}>{p.shortDesc}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="dk-heading text-2xl font-semibold" style={{ color: "var(--text)" }}>{formatDZD(p.price)}</span>
            {p.oldPrice && <span className="text-sm line-through" style={{ color: "var(--text-faint)" }}>{formatDZD(p.oldPrice)}</span>}
          </div>
          <div className="mt-2"><StockLabel stock={p.stock} /></div>

          {p.variants && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>{p.variants.label}</p>
              <div className="flex gap-2">
                {p.variants.options.map((o) => (
                  <button
                    key={o}
                    onClick={() => setVariant(o)}
                    className="rounded-lg px-3 py-1.5 text-sm dk-focus"
                    style={{ border: variant === o ? "1px solid var(--teal)" : "1px solid var(--border)", color: variant === o ? "var(--teal)" : "var(--text-dim)" }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center dk-surface-2 rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-11 w-11 flex items-center justify-center dk-focus" aria-label="Diminuer">
                <Minus className="h-4 w-4" style={{ color: "var(--text)" }} />
              </button>
              <span className="w-9 text-center text-sm" style={{ color: "var(--text)" }}>{qty}</span>
              <button onClick={() => setQty(Math.min(20, qty + 1))} className="h-11 w-11 flex items-center justify-center dk-focus" aria-label="Augmenter">
                <Plus className="h-4 w-4" style={{ color: "var(--text)" }} />
              </button>
            </div>
          </div>

          <div className="mt-4 hidden sm:flex gap-3">
            <button
              onClick={() => s.addToCart(p, qty, variant)}
              disabled={p.stock === "out"}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold dk-btn-primary disabled:opacity-40"
            >
              <ShoppingCart className="h-4 w-4" /> Ajouter au panier
            </button>
            <button
              onClick={() => { s.addToCart(p, qty, variant); s.setView("checkout"); }}
              disabled={p.stock === "out"}
              className="flex-1 rounded-xl py-3 text-sm font-semibold dk-btn-secondary disabled:opacity-40"
            >
              Commander maintenant
            </button>
          </div>

          <div className="mt-6"><TrustBadges dense /></div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex gap-1 overflow-x-auto border-b dk-scrollbar" style={{ borderColor: "var(--border)" }}>
          {PRODUCT_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-4 py-2.5 text-sm whitespace-nowrap dk-focus"
              style={{ color: activeTab === t ? "var(--teal)" : "var(--text-dim)", borderBottom: activeTab === t ? "2px solid var(--teal)" : "2px solid transparent" }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-5 max-w-2xl">
          {activeTab === "Description" ? (
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{p.longDesc}</p>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-faint)" }}>{PLACEHOLDER_TABS[activeTab]}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="dk-heading text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Avis clients</h2>
        <ProductReviews productId={p.id} />
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="dk-heading text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>Produits similaires</h2>
          <ProductGrid products={related} s={s} />
        </div>
      )}

      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 p-3 flex gap-2" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => s.addToCart(p, qty, variant)}
          disabled={p.stock === "out"}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold dk-btn-primary disabled:opacity-40"
        >
          <ShoppingCart className="h-4 w-4" /> Ajouter
        </button>
        <button
          onClick={() => { s.addToCart(p, qty, variant); s.setView("checkout"); }}
          disabled={p.stock === "out"}
          className="flex-1 rounded-xl py-3 text-sm font-semibold dk-btn-secondary disabled:opacity-40"
        >
          Commander
        </button>
      </div>
    </div>
  );
};
