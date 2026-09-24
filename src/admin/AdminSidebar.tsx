import React from "react";
import {
  LayoutDashboard,
  Package,
  SlidersHorizontal,
  ClipboardList,
  Users,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import type { Store } from "../types";
import { getSecurityConfig } from "../lib/authSecurity";

export type AdminTab = "dashboard" | "produits" | "categories" | "commandes" | "clients" | "securite";

const ITEMS: Array<{ key: AdminTab; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { key: "dashboard", label: "Tableau de bord", Icon: LayoutDashboard },
  { key: "produits", label: "Stock & Produits", Icon: Package },
  { key: "categories", label: "Catégories", Icon: SlidersHorizontal },
  { key: "commandes", label: "Commandes", Icon: ClipboardList },
  { key: "clients", label: "Clients CRM", Icon: Users },
  { key: "securite", label: "Sécurité & Accès", Icon: ShieldCheck },
];

export const AdminSidebar: React.FC<{
  tab: AdminTab;
  setTab: (t: AdminTab) => void;
  s: Store;
  onLogout: () => void;
  isCollapsed?: boolean;
}> = ({ tab, setTab, s, onLogout, isCollapsed = false }) => {
  const lowStockCount = s.products.filter((p) => p.stock !== "in").length;
  const newOrdersCount = s.orders.filter((o) => o.status === "Nouvelle").length;
  const secConfig = getSecurityConfig();
  const hasSecurityAlert = secConfig.requirePasswordChange;

  return (
    <div
      className={`dk-surface rounded-2xl p-2.5 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible shadow-md transition-all duration-300 ${
        isCollapsed ? "lg:items-center" : ""
      }`}
    >
      {ITEMS.map((it) => {
        const isActive = tab === it.key;
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            title={isCollapsed ? it.label : undefined}
            className={`flex items-center ${
              isCollapsed ? "lg:justify-center lg:w-10 lg:h-10 lg:p-0" : "justify-between px-3.5 py-2.5"
            } gap-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all dk-focus relative group ${
              isActive
                ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30"
                : "hover:bg-[var(--surface-2)]"
            }`}
            style={!isActive ? { color: "var(--text-dim)" } : {}}
          >
            <div className="flex items-center gap-2.5">
              <it.Icon className={`h-4 w-4 ${isActive ? "text-cyan-500 dark:text-cyan-400" : "opacity-70"}`} />
              {!isCollapsed && <span>{it.label}</span>}
            </div>

            {/* Badges for alerts */}
            {!isCollapsed && it.key === "produits" && lowStockCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {lowStockCount}
              </span>
            )}
            {!isCollapsed && it.key === "commandes" && newOrdersCount > 0 && (
              <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-cyan-500 text-slate-950">
                {newOrdersCount}
              </span>
            )}
            {!isCollapsed && it.key === "securite" && hasSecurityAlert && (
              <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Action requise
              </span>
            )}

            {/* Dot badge when collapsed */}
            {isCollapsed && it.key === "produits" && lowStockCount > 0 && (
              <span className="hidden lg:block absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-[var(--surface)]" />
            )}
            {isCollapsed && it.key === "commandes" && newOrdersCount > 0 && (
              <span className="hidden lg:block absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-cyan-500 ring-2 ring-[var(--surface)]" />
            )}
            {isCollapsed && it.key === "securite" && hasSecurityAlert && (
              <span className="hidden lg:block absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-[var(--surface)]" />
            )}
          </button>
        );
      })}

      <div className="hidden lg:block flex-1 my-2 border-t w-full" style={{ borderColor: "var(--border)" }} />

      <button
        onClick={onLogout}
        title={isCollapsed ? "Déconnexion" : undefined}
        className={`flex items-center ${
          isCollapsed ? "lg:justify-center lg:w-10 lg:h-10 lg:p-0" : "px-3.5 py-2.5 gap-2"
        } rounded-xl text-xs sm:text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all dk-focus whitespace-nowrap`}
      >
        <LogOut className="h-4 w-4" />
        {!isCollapsed && <span>Déconnexion</span>}
      </button>

      <button
        onClick={() => s.goHome()}
        title={isCollapsed ? "Retour au site" : undefined}
        className={`flex items-center ${
          isCollapsed ? "lg:justify-center lg:w-10 lg:h-10 lg:p-0" : "px-3.5 py-2 gap-2"
        } rounded-xl text-xs transition-colors dk-focus whitespace-nowrap hover:underline`}
        style={{ color: "var(--text-faint)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {!isCollapsed && <span>Retour au site</span>}
      </button>
    </div>
  );
};
