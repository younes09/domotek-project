import React from "react";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import { getCategoryIcon } from "../data/categories";
import type { Store } from "../types";

export const MobileNavigation: React.FC<{ s: Store }> = ({ s }) => (
  <div className="fixed inset-0 z-50 lg:hidden">
    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => s.setMobileMenuOpen(false)} />
    <div className="absolute inset-y-0 left-0 w-72 dk-surface flex flex-col" style={{ borderRight: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Logo onClick={() => { s.goHome(); s.setMobileMenuOpen(false); }} className="h-11 sm:h-13" theme={s.theme} />
        <button onClick={() => s.setMobileMenuOpen(false)} className="h-9 w-9 flex items-center justify-center rounded-lg dk-focus" aria-label="Fermer">
          <X className="h-5 w-5" style={{ color: "var(--text)" }} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1 dk-scrollbar">
        <button onClick={() => { s.goHome(); s.setMobileMenuOpen(false); }} className="w-full text-left py-2.5 text-sm font-medium dk-focus rounded" style={{ color: "var(--text)" }}>
          Accueil
        </button>
        <button onClick={() => { s.goShop({}); s.setMobileMenuOpen(false); }} className="w-full text-left py-2.5 text-sm font-medium dk-focus rounded" style={{ color: "var(--text)" }}>
          Boutique
        </button>
        <p className="pt-3 pb-1 text-xs" style={{ color: "var(--text-faint)" }}>Catégories</p>
        {s.categories.map((c) => {
          const IconComp = c.icon || getCategoryIcon(c.iconName);
          return (
            <button key={c.key} onClick={() => { s.goShop({ category: c.key }); s.setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 py-2.5 dk-focus rounded">
              <IconComp className="h-4 w-4" style={{ color: "var(--teal)" }} />
              <span className="text-sm" style={{ color: "var(--text-dim)" }}>{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
