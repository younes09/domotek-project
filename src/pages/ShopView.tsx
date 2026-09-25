import React, { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters, EMPTY_FILTERS } from "../components/ProductFilters";
import type { Store } from "../types";

export const ShopView: React.FC<{ s: Store }> = ({ s }) => {
  const f = s.shopFilters;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...s.products];
    if (f.query) {
      const q = f.query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (f.special === "new") list = list.filter((p) => p.isNew);
    if (f.special === "best") list = list.filter((p) => p.isBestSeller);
    if (f.category !== "all") list = list.filter((p) => p.category === f.category);
    if (f.minPrice) list = list.filter((p) => p.price >= Number(f.minPrice));
    if (f.maxPrice) list = list.filter((p) => p.price <= Number(f.maxPrice));
    if (f.availability === "in") list = list.filter((p) => p.stock === "in");
    if (f.sort === "prix-asc") list.sort((a, b) => a.price - b.price);
    if (f.sort === "prix-desc") list.sort((a, b) => b.price - a.price);
    if (f.sort === "nouveautes") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return list;
  }, [s.products, f]);

  const title =
    f.special === "new"
      ? "Nouveautés"
      : f.special === "best"
      ? "Meilleures ventes"
      : f.category !== "all"
      ? s.categoryLabel[f.category] || f.category
      : "Tous les produits";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 text-xs mb-3 flex-wrap" style={{ color: "var(--text-faint)" }}>
        <button
          onClick={() => s.goBack()}
          className="flex items-center gap-1.5 font-semibold dk-focus rounded-lg px-2.5 py-1 dk-surface border hover:opacity-80 transition-all mr-1"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
          aria-label="Retour à la page précédente"
        >
          <ArrowLeft className="h-3.5 w-3.5" style={{ color: "var(--teal)" }} />
          <span>Retour</span>
        </button>
        <button onClick={() => s.goHome()} className="dk-focus rounded hover:underline">Accueil</button>
        <ChevronRight className="h-3 w-3" />
        <span style={{ color: "var(--text-dim)" }}>Boutique</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="dk-heading text-2xl font-semibold" style={{ color: "var(--text)" }}>{title}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-faint)" }}>{filtered.length} produit{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={f.sort} onChange={(e) => s.setShopFilters({ ...f, sort: e.target.value as typeof f.sort })} className="dk-input rounded-lg px-3 py-2 text-sm hidden sm:block">
            <option value="popularite">Popularité</option>
            <option value="nouveautes">Nouveautés</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
          <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 dk-input rounded-lg px-3 py-2 text-sm">
            <SlidersHorizontal className="h-4 w-4" /> Filtres
          </button>
        </div>
      </div>

      <div className="lg:flex gap-8 items-start">
        <aside className="hidden lg:block lg:w-56 lg:shrink-0 lg:sticky lg:top-32 z-20 self-start"><ProductFilters s={s} /></aside>
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="dk-surface rounded-2xl p-10 text-center">
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>Aucun produit ne correspond à ces critères.</p>
              <button onClick={() => s.setShopFilters({ ...EMPTY_FILTERS })} className="mt-3 text-sm dk-focus rounded" style={{ color: "var(--teal)" }}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} s={s} />)}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-end">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative dk-surface rounded-t-3xl w-full p-5" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="dk-heading text-lg font-semibold" style={{ color: "var(--text)" }}>Filtres</p>
              <button onClick={() => setMobileFiltersOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full dk-surface-2 dk-focus">
                <X className="h-4 w-4" style={{ color: "var(--text)" }} />
              </button>
            </div>
            <ProductFilters s={s} />
            <button onClick={() => setMobileFiltersOpen(false)} className="mt-6 w-full rounded-xl py-3 text-sm font-semibold dk-btn-primary">Voir les résultats</button>
          </div>
        </div>
      )}
    </div>
  );
};
