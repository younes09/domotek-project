import React from "react";
import type { Category } from "../types";

export const CategoryCard: React.FC<{ category: Category; count: number; onClick: () => void }> = ({ category, count, onClick }) => (
  <button
    onClick={onClick}
    className="dk-surface rounded-2xl p-4 flex flex-col items-start gap-3 text-left dk-focus transition hover:border-teal"
    style={{ borderColor: "var(--border)" }}
  >
    <div className="h-10 w-10 rounded-xl flex items-center justify-center dk-chip-teal">
      <category.icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{category.name}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{count} produits</p>
    </div>
  </button>
);
