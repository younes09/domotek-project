import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, ClipboardList, Users, Package, AlertTriangle, ArrowRight, ShoppingBag } from "lucide-react";
import { IconTile } from "../components/ui";
import { DEMO_SALES } from "../data/demoAdminData";
import { formatDZD } from "../lib/format";
import type { AdminTab } from "./AdminSidebar";
import type { Store } from "../types";

const StatCard: React.FC<{ label: string; value: string | number; Icon: React.ComponentType<{ className?: string }>; highlight?: boolean }> = ({ label, value, Icon, highlight }) => (
  <div className={`dk-surface rounded-2xl p-4 shadow-sm ${highlight ? "border-amber-500/40 bg-amber-500/10" : ""}`}>
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>{label}</p>
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${highlight ? "bg-amber-500/20 text-amber-500 dark:text-amber-400" : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"}`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="dk-heading text-xl font-bold mt-2" style={{ color: "var(--text)" }}>{value}</p>
  </div>
);

export const AdminDashboard: React.FC<{ s: Store; onNavigate: (t: AdminTab) => void }> = ({ s, onNavigate }) => {
  const totalSales = s.orders.reduce((sum, o) => sum + o.total, 0);
  const bestSellers = s.products.filter((p) => p.isBestSeller).slice(0, 4);
  const lowStockProducts = s.products.filter((p) => p.stock !== "in");
  const newOrdersCount = s.orders.filter((o) => o.status === "Nouvelle").length;

  return (
    <div className="space-y-6">
      {/* Low stock alert bar */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                {lowStockProducts.length} produit(s) nécessitent un réapprovisionnement
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {lowStockProducts.map((p) => p.name).join(", ").slice(0, 80)}...
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("produits")}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap transition-all shadow"
          >
            Gérer le stock
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard label="Chiffre d'affaires" value={formatDZD(totalSales)} Icon={TrendingUp} />
        <StatCard label="Total Commandes" value={`${s.orders.length} (${newOrdersCount} nvl)`} Icon={ClipboardList} />
        <StatCard label="Clients Uniques" value={new Set(s.orders.map((o) => o.phone)).size} Icon={Users} />
        <StatCard label="Stock Faible / Épuisé" value={lowStockProducts.length} Icon={Package} highlight={lowStockProducts.length > 0} />
      </div>

      {/* Sales Chart */}
      <div className="dk-surface rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>Ventes de la semaine</h3>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Suivi hebdomadaire des revenus générés</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded dk-chip-teal">
            DZA (DA)
          </span>
        </div>
        <div style={{ width: "100%", height: 230 }}>
          <ResponsiveContainer>
            <BarChart data={DEMO_SALES}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text-faint)" fontSize={12} />
              <YAxis stroke="var(--text-faint)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text)" }} />
              <Bar dataKey="ventes" fill="var(--teal)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Best Sellers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="dk-surface rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
              <ShoppingBag className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
              <span>Commandes Récents</span>
            </h4>
            <button onClick={() => onNavigate("commandes")} className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {s.orders.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: "var(--text-dim)" }}>
                Aucune commande enregistrée pour le moment.
              </p>
            ) : (
              s.orders.slice(0, 4).map((o) => (
                <div key={o.id} className="p-3 rounded-xl dk-surface-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold" style={{ color: "var(--text)" }}>{o.customerName} <span className="font-normal" style={{ color: "var(--text-faint)" }}>({o.wilaya})</span></p>
                    <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>{o.id} • {o.items.length} article(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{formatDZD(o.total)}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold dk-chip-teal">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dk-surface rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
              <Package className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
              <span>Top Ventes Produits</span>
            </h4>
            <button onClick={() => onNavigate("produits")} className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
              Gérer stock <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {bestSellers.map((p) => (
              <div key={p.id} className="p-3 rounded-xl dk-surface-2 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden"><IconTile Icon={p.icon} variant={2} /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>{p.name}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>{formatDZD(p.price)}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${p.stock === "in" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                  {p.stock === "in" ? "En stock" : "Stock faible"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


