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
  const p = s.products.find((prod) => prod.id === s.selectedProduct?.id) || s.selectedProduct;
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

      {/* ONGLETS FICHE PRODUIT : 6 SECTIONS */}
      <div className="mt-10">
        <div className="flex gap-2 overflow-x-auto border-b dk-scrollbar pb-1" style={{ borderColor: "var(--border)" }}>
          {PRODUCT_TABS.map((t) => {
            const isActive = activeTab === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap rounded-t-xl transition-all flex items-center gap-2 ${
                  isActive ? "border-b-2" : "hover:opacity-80"
                }`}
                style={{
                  borderBottomColor: isActive ? "var(--teal)" : "transparent",
                  color: isActive ? "var(--teal)" : "var(--text-dim)",
                  background: isActive ? "var(--teal-dim)" : "transparent",
                }}
              >
                <span>{t}</span>
                {t === "Questions fréquentes" && p.faq && p.faq.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full dk-chip-teal font-mono font-bold">
                    {p.faq.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="py-6 max-w-3xl">
          {/* 1. DESCRIPTION */}
          {activeTab === "Description" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>Présentation générale</p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-dim)" }}>
                  {p.longDesc || p.shortDesc || PLACEHOLDER_TABS["Description"]}
                </p>
              </div>

              {p.characteristics && (
                <div className="p-4 rounded-2xl dk-surface border space-y-1" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--teal)" }}>Points clés</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                    {p.characteristics}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. CARACTÉRISTIQUES */}
          {activeTab === "Caractéristiques" && (
            <div className="space-y-5">
              {p.characteristics && (
                <p className="text-sm leading-relaxed p-3.5 rounded-xl dk-surface-2 border" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                  {p.characteristics}
                </p>
              )}

              {p.specs && p.specs.length > 0 ? (
                <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <div className="px-4 py-3 dk-surface-2 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                      Spécifications Techniques
                    </span>
                    <span className="text-xs font-mono" style={{ color: "var(--text-faint)" }}>{p.specs.length} critères</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                    {p.specs.map((sp, idx) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-1 sm:grid-cols-3 px-4 py-3 text-xs sm:text-sm transition-colors ${
                          idx % 2 === 0 ? "dk-surface" : "dk-surface-2"
                        }`}
                      >
                        <span className="font-semibold mb-0.5 sm:mb-0" style={{ color: "var(--text-dim)" }}>
                          {sp.name}
                        </span>
                        <span className="sm:col-span-2 font-medium" style={{ color: "var(--text)" }}>
                          {sp.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  {PLACEHOLDER_TABS["Caractéristiques"]}
                </p>
              )}
            </div>
          )}

          {/* 3. COMPATIBILITÉ */}
          {activeTab === "Compatibilité" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                  Tuya Smart & Smart Life
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                  Amazon Alexa
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                  Google Assistant
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                  Wi-Fi 2.4 GHz
                </span>
              </div>

              {p.compatibility ? (
                <div className="p-4 rounded-2xl dk-surface-2 border space-y-2" style={{ borderColor: "var(--border)" }}>
                  {p.compatibility.split("\n").map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");
                    const cleanText = isBullet ? trimmed.replace(/^[•\-\*]\s*/, "") : trimmed;
                    return (
                      <div key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                        <span className="text-cyan-500 mt-1 shrink-0">✓</span>
                        <span>{cleanText}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  {PLACEHOLDER_TABS["Compatibilité"]}
                </p>
              )}
            </div>
          )}

          {/* 4. INSTALLATION */}
          {activeTab === "Installation" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <span className="text-base leading-none mt-0.5">⚠️</span>
                <div className="text-xs text-amber-700 dark:text-amber-300">
                  <strong className="block font-bold">Consigne de sécurité importante :</strong>
                  Pour toute intervention sur votre installation électrique, veillez toujours à couper le disjoncteur général au préalable.
                </div>
              </div>

              {p.installation ? (
                <div className="space-y-3">
                  {p.installation.split("\n").map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    // Detect leading number (e.g. "1. Coupez...")
                    const match = trimmed.match(/^(\d+)[\.\)]\s*(.*)$/);
                    if (match) {
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl dk-surface border flex items-start gap-3.5"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <span className="h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {match[1]}
                          </span>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                            {match[2]}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p key={idx} className="text-sm leading-relaxed p-2" style={{ color: "var(--text-dim)" }}>
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  {PLACEHOLDER_TABS["Installation"]}
                </p>
              )}
            </div>
          )}

          {/* 5. UTILISATION */}
          {activeTab === "Utilisation" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl dk-surface-2 border flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                    Pilotage intuitif depuis votre smartphone
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Accessible partout dans le monde via l'application gratuite Smart Life ou Tuya.
                  </p>
                </div>
              </div>

              {p.usage ? (
                <div className="space-y-3">
                  {p.usage.split("\n").map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    const match = trimmed.match(/^(\d+)[\.\)]\s*(.*)$/);
                    if (match) {
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl dk-surface border flex items-start gap-3"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <span className="h-6 w-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {match[1]}
                          </span>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                            {match[2]}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p key={idx} className="text-sm leading-relaxed p-2" style={{ color: "var(--text-dim)" }}>
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-faint)" }}>
                  {PLACEHOLDER_TABS["Utilisation"]}
                </p>
              )}
            </div>
          )}

          {/* 6. QUESTIONS FRÉQUENTES */}
          {activeTab === "Questions fréquentes" && (
            <div className="space-y-3">
              {p.faq && p.faq.length > 0 ? (
                p.faq.map((item, idx) => (
                  <details
                    key={idx}
                    open={idx === 0}
                    className="group rounded-2xl dk-surface border p-4 transition-all"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <summary className="font-semibold text-sm cursor-pointer list-none flex items-center justify-between gap-3 select-none" style={{ color: "var(--text)" }}>
                      <span className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: "var(--teal)" }}>Q.</span>
                        <span>{item.question}</span>
                      </span>
                      <span className="text-xs group-open:rotate-180 transition-transform" style={{ color: "var(--text-faint)" }}>
                        ▼
                      </span>
                    </summary>
                    <div className="mt-3 pt-3 border-t text-sm leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
                      {item.answer}
                    </div>
                  </details>
                ))
              ) : (
                <div className="p-6 text-center rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                    {PLACEHOLDER_TABS["Questions fréquentes"]}
                  </p>
                </div>
              )}
            </div>
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
