import React from "react";
import { Pencil } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import type { Store } from "../types";

export const AdminCategories: React.FC<{ s: Store }> = ({ s }) => (
  <div>
    <p className="dk-heading text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>Catégories</p>
    <div className="dk-surface rounded-2xl">
      {CATEGORIES.map((c, idx) => (
        <div key={c.key} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: idx < CATEGORIES.length - 1 ? "1px solid var(--border)" : "none" }}>
          <div className="h-9 w-9 rounded-lg flex items-center justify-center dk-chip-teal"><c.icon className="h-4 w-4" /></div>
          <div className="flex-1">
            <p className="text-sm" style={{ color: "var(--text)" }}>{c.name}</p>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>{s.products.filter((p) => p.category === c.key).length} produits</p>
          </div>
          <button className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 dk-focus" aria-label="Modifier">
            <Pencil className="h-3.5 w-3.5" style={{ color: "var(--text)" }} />
          </button>
        </div>
      ))}
    </div>
  </div>
);
