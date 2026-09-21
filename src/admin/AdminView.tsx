import React, { useState } from "react";
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="dk-heading text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--text)" }}>
            Tableau de Bord Administrateur
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-dim)" }}>
            Gestion du catalogue, inventaire des stocks, commandes et CRM clients DomoTek.
          </p>
        </div>
      </div>

      <div className="lg:flex gap-6">
        <div className="lg:w-60 lg:shrink-0 mb-6 lg:mb-0">
          <AdminSidebar tab={tab} setTab={setTab} s={s} onLogout={handleLogout} />
        </div>
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


