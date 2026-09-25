import React from "react";
import { Search, X } from "lucide-react";
import { IconTile, ProductTile } from "./ui";
import { getCategoryIcon } from "../data/categories";
import { formatDZD } from "../lib/format";
import type { Store } from "../types";

export const SearchBar: React.FC<{ s: Store }> = ({ s }) => {
  const q = s.searchQuery.trim().toLowerCase();
  const matchedProducts = q
    ? s.products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (s.categoryLabel[p.category] && s.categoryLabel[p.category].toLowerCase().includes(q))
        )
        .slice(0, 6)
    : [];
  const matchedCategories = q ? s.categories.filter((c) => c.name.toLowerCase().includes(q)) : [];
  const noResults = q.length > 1 && matchedProducts.length === 0 && matchedCategories.length === 0;
  const recommended = s.products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => s.setSearchOpen(false)} />
      <div className="absolute inset-x-0 top-0 dk-surface" style={{ borderBottom: "1px solid var(--border)", maxHeight: "88vh", overflowY: "auto" }}>
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="dk-input flex-1 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-faint)" }} />
              <input
                autoFocus
                value={s.searchQuery}
                onChange={(e) => s.setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q) {
                    s.addRecentSearch(s.searchQuery);
                    s.goShop({ query: s.searchQuery });
                    s.setSearchOpen(false);
                  }
                }}
                placeholder="Rechercher un produit, une catégorie…"
                className="bg-transparent flex-1 outline-none text-sm"
                style={{ color: "var(--text)" }}
              />
            </div>
            <button onClick={() => s.setSearchOpen(false)} className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg dk-focus" aria-label="Fermer la recherche">
              <X className="h-5 w-5" style={{ color: "var(--text)" }} />
            </button>
          </div>

          {!q && s.recentSearches.length > 0 && (
            <div className="mt-5">
              <p className="text-xs mb-2" style={{ color: "var(--text-faint)" }}>Recherches récentes</p>
              <div className="flex flex-wrap gap-2">
                {s.recentSearches.map((r, i) => (
                  <button key={i} onClick={() => s.setSearchQuery(r)} className="text-xs px-3 py-1.5 rounded-full dk-surface-2 dk-focus" style={{ color: "var(--text-dim)" }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedCategories.length > 0 && (
            <div className="mt-5">
              <p className="text-xs mb-2" style={{ color: "var(--text-faint)" }}>Catégories</p>
              <div className="space-y-1">
                {matchedCategories.map((c) => {
                  const IconComp = c.icon || getCategoryIcon(c.iconName);
                  return (
                    <button
                      key={c.key}
                      onClick={() => { s.addRecentSearch(c.name); s.goShop({ category: c.key }); s.setSearchOpen(false); }}
                      className="w-full flex items-center gap-3 py-2 dk-focus rounded"
                    >
                      <IconComp className="h-4 w-4" style={{ color: "var(--teal)" }} />
                      <span className="text-sm" style={{ color: "var(--text)" }}>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {matchedProducts.length > 0 && (
            <div className="mt-5">
              <p className="text-xs mb-2" style={{ color: "var(--text-faint)" }}>Produits</p>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <button key={p.id} onClick={() => { s.addRecentSearch(p.name); s.openProduct(p); s.setSearchOpen(false); }} className="w-full flex items-center gap-3 py-2 dk-focus rounded">
                    <div className="h-11 w-11 shrink-0">
                      <ProductTile Icon={p.icon} imageUrl={p.imageUrl} images={p.images} name={p.name} variant={2} />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm truncate" style={{ color: "var(--text)" }}>{p.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-dim)" }}>{formatDZD(p.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {noResults && (
            <div className="mt-6">
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>Aucun résultat pour « {s.searchQuery} ».</p>
              <p className="text-xs mt-3 mb-2" style={{ color: "var(--text-faint)" }}>Vous aimerez peut-être</p>
              <div className="space-y-1">
                {recommended.map((p) => (
                  <button key={p.id} onClick={() => { s.openProduct(p); s.setSearchOpen(false); }} className="w-full flex items-center gap-3 py-2 dk-focus rounded">
                    <div className="h-11 w-11 shrink-0">
                      <ProductTile Icon={p.icon} imageUrl={p.imageUrl} images={p.images} name={p.name} variant={2} />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm truncate" style={{ color: "var(--text)" }}>{p.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-dim)" }}>{formatDZD(p.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
