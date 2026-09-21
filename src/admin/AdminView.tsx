import React, { useState, useEffect } from "react";
import {
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutGrid,
} from "lucide-react";
import { AdminSidebar, AdminTab } from "./AdminSidebar";
import { AdminDashboard } from "./AdminDashboard";
import { AdminProducts } from "./AdminProducts";
import { AdminCategories } from "./AdminCategories";
import { AdminOrders } from "./AdminOrders";
import { AdminCustomers } from "./AdminCustomers";
import { AdminLogin } from "./AdminLogin";
import type { Store } from "../types";

export const AdminView: React.FC<{ s: Store }> = ({ s }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("domotek_admin_auth") === "true";
  });
  const [tab, setTab] = useState<AdminTab>("dashboard");

  // Full-width mode for wide tables
  const [isFullWidth, setIsFullWidth] = useState<boolean>(() => {
    return localStorage.getItem("domotek_admin_fullwidth") === "true";
  });

  // Collapsed sidebar mode
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("domotek_admin_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("domotek_admin_fullwidth", String(isFullWidth));
  }, [isFullWidth]);

  useEffect(() => {
    localStorage.setItem("domotek_admin_sidebar_collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("domotek_admin_auth", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("domotek_admin_auth");
    s.showToast("Déconnecté du panneau d'administration");
  };

  if (!isAuthenticated) {
    return <AdminLogin s={s} onLogin={handleLogin} />;
  }

  return (
    <div
      className={`mx-auto px-3 sm:px-6 py-6 transition-all duration-300 ${
        isFullWidth ? "w-full max-w-[98%] 2xl:max-w-[1850px]" : "max-w-6xl"
      }`}
    >
      {/* Admin Top Header with Width & Layout Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="dk-heading text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5" style={{ color: "var(--text)" }}>
            <span>Tableau de Bord Administrateur</span>
            {isFullWidth && (
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                Mode Largeur Maximale
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-dim)" }}>
            Gestion du catalogue, inventaire des stocks, commandes et CRM clients DomoTek.
          </p>
        </div>

        {/* Desktop View Mode Toggles */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Collapse/Expand Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isSidebarCollapsed
                ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30"
                : "dk-surface text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-700"
            }`}
            title={isSidebarCollapsed ? "Développer le menu latéral" : "Réduire le menu latéral en icônes"}
          >
            {isSidebarCollapsed ? (
              <>
                <PanelLeftOpen className="h-4 w-4" />
                <span>Menu Réduit</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Menu Complet</span>
              </>
            )}
          </button>

          {/* Full-width Toggle */}
          <button
            onClick={() => setIsFullWidth((prev) => !prev)}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isFullWidth
                ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40 shadow-sm"
                : "dk-surface text-slate-300 hover:text-cyan-400 border-slate-700 hover:border-cyan-500/40"
            }`}
            title={isFullWidth ? "Revenir à la largeur standard (1152px)" : "Agrandir le tableau à 100% de la largeur d'écran"}
          >
            {isFullWidth ? (
              <>
                <Minimize2 className="h-4 w-4" />
                <span>Vue Standard</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4 text-cyan-500" />
                <span>Agrandir le tableau (Plein Écran)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="lg:flex gap-6 items-start">
        {/* Sidebar */}
        <div
          className={`lg:shrink-0 mb-6 lg:mb-0 transition-all duration-300 ${
            isSidebarCollapsed ? "lg:w-16" : "lg:w-56"
          }`}
        >
          <AdminSidebar
            tab={tab}
            setTab={setTab}
            s={s}
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {tab === "dashboard" && <AdminDashboard s={s} onNavigate={(t) => setTab(t)} />}
          {tab === "produits" && <AdminProducts s={s} />}
          {tab === "categories" && <AdminCategories s={s} />}
          {tab === "commandes" && <AdminOrders s={s} />}
          {tab === "clients" && <AdminCustomers s={s} />}
        </div>
      </div>
    </div>
  );
};
