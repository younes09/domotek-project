import React from "react";
import type { ShopFilters, Store } from "../types";

export const EMPTY_FILTERS: ShopFilters = {
  category: "all", minPrice: "", maxPrice: "", availability: "all", sort: "popularite", special: null, query: "",
};

export const ProductFilters: React.FC<{ s: Store }> = ({ s }) => {
  const f = s.shopFilters;
  const set = (patch: Partial<ShopFilters>) => s.setShopFilters({ ...f, ...patch });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Catégorie</p>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-dim)" }}>
            <input type="radio" name="cat" checked={f.category === "all"} onChange={() => set({ category: "all" })} /> Toutes
          </label>
          {s.categories.map((c) => (
            <label key={c.key} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-dim)" }}>
              <input type="radio" name="cat" checked={f.category === c.key} onChange={() => set({ category: c.key })} /> {c.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Prix (DA)</p>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={f.minPrice} onChange={(e) => set({ minPrice: e.target.value })} className="dk-input rounded-lg px-2 py-1.5 w-full text-sm" />
          <span style={{ color: "var(--text-faint)" }}>–</span>
          <input type="number" placeholder="Max" value={f.maxPrice} onChange={(e) => set({ maxPrice: e.target.value })} className="dk-input rounded-lg px-2 py-1.5 w-full text-sm" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Disponibilité</p>
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-dim)" }}>
          <input type="checkbox" checked={f.availability === "in"} onChange={(e) => set({ availability: e.target.checked ? "in" : "all" })} /> En stock uniquement
        </label>
      </div>
      <button onClick={() => s.setShopFilters({ ...EMPTY_FILTERS })} className="text-sm dk-focus rounded" style={{ color: "var(--teal)" }}>
        Réinitialiser les filtres
      </button>
    </div>
  );
};
