import React from "react";
import { LayoutDashboard, Package, SlidersHorizontal, ClipboardList, Users, ArrowLeft, LogOut, AlertTriangle } from "lucide-react";
import type { Store } from "../types";

export type AdminTab = "dashboard" | "produits" | "categories" | "commandes" | "clients";

const ITEMS: Array<{ key: AdminTab; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { key: "dashboard", label: "Tableau de bord", Icon: LayoutDashboard },
  { key: "produits", label: "Stock & Produits", Icon: Package },
  { key: "categories", label: "Catégories", Icon: SlidersHorizontal },
  { key: "commandes", label: "Commandes", Icon: ClipboardList },
  { key: "clients", label: "Clients CRM", Icon: Users },
];

export const AdminSidebar: React.FC<{
  tab: AdminTab;
  setTab: (t: AdminTab) => void;
  s: Store;
  onLogout: () => void;
}> = ({ tab, setTab, s, onLogout }) => {
  const lowStockCount = s.products.filter((p) => p.stock !== "in").length;
  const newOrdersCount = s.orders.filter((o) => o.status === "Nouvelle").length;

  return (
    <div className="dk-surface rounded-2xl p-3 lg:sticky lg:top-20 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible border border-slate-800 bg-[#1a2235]">
      {ITEMS.map((it) => {
        const isActive = tab === it.key;
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            className={`flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all dk-focus ${
              isActive
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <it.Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
              <span>{it.label}</span>
            </div>

            {/* Badges for alerts */}
            {it.key === "produits" && lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {lowStockCount}
              </span>
            )}
            {it.key === "commandes" && newOrdersCount > 0 && (
              <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-cyan-500 text-slate-950">
                {newOrdersCount}
              </span>
            )}
          </button>
        );
      })}

      <div className="hidden lg:block flex-1 my-2 border-t border-slate-800/80" />

      <button
        onClick={onLogout}
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all dk-focus whitespace-nowrap"
      >
        <LogOut className="h-4 w-4" />
        <span>Déconnexion</span>
      </button>

      <button
        onClick={() => s.goHome()}
        className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors dk-focus whitespace-nowrap"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Retour au site</span>
      </button>
    </div>
  );
};


