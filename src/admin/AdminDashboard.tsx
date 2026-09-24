import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, ClipboardList, Users, Package, AlertTriangle, ArrowRight, ShoppingBag } from "lucide-react";
import { IconTile } from "../components/ui";
import { formatDZD } from "../lib/format";
import type { AdminTab } from "./AdminSidebar";
import type { Store, Product } from "../types";

const StatCard: React.FC<{
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}> = ({ label, value, Icon, highlight }) => (
  <div className={`dk-surface rounded-2xl p-4 shadow-sm ${highlight ? "border-amber-500/40 bg-amber-500/10" : ""}`}>
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>
        {label}
      </p>
      <div
        className={`h-8 w-8 rounded-xl flex items-center justify-center ${
          highlight
            ? "bg-amber-500/20 text-amber-500 dark:text-amber-400"
            : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="dk-heading text-xl font-bold mt-2" style={{ color: "var(--text)" }}>
      {value}
    </p>
  </div>
);

export const AdminDashboard: React.FC<{ s: Store; onNavigate: (t: AdminTab) => void }> = ({ s, onNavigate }) => {
  // Real orders (excluding canceled orders for financial metrics)
  const validOrders = useMemo(() => s.orders.filter((o) => o.status !== "Annulée"), [s.orders]);
  const totalSales = useMemo(() => validOrders.reduce((sum, o) => sum + o.total, 0), [validOrders]);
  const newOrdersCount = useMemo(() => s.orders.filter((o) => o.status === "Nouvelle").length, [s.orders]);
  const uniqueCustomersCount = useMemo(
    () => new Set(s.orders.map((o) => o.phone.trim()).filter(Boolean)).size,
    [s.orders]
  );
  const lowStockProducts = useMemo(() => s.products.filter((p) => p.stock !== "in"), [s.products]);

  // Dynamic Real-time 7-day Sales Chart calculated from actual orders
  const weeklySalesData = useMemo(() => {
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const list: Array<{ day: string; date: string; ventes: number; count: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = `${dayNames[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

      const dayOrders = s.orders.filter((o) => {
        if (!o.date || o.status === "Annulée") return false;
        return o.date.startsWith(dateStr);
      });

      const dayTotal = dayOrders.reduce((sum, o) => sum + o.total, 0);

      list.push({
        day: dayLabel,
        date: dateStr,
        ventes: dayTotal,
        count: dayOrders.length,
      });
    }

    return list;
  }, [s.orders]);

  // Dynamic real top-selling products based on actual orders
  const topSellingProducts = useMemo(() => {
    const salesMap = new Map<number, { product: Product; qty: number; revenue: number }>();

    s.orders.forEach((order) => {
      if (order.status === "Annulée") return;
      order.items.forEach((item) => {
        const prod = s.products.find(
          (p) => p.name.trim().toLowerCase() === item.name.trim().toLowerCase()
        );
        if (prod) {
          const current = salesMap.get(prod.id) || { product: prod, qty: 0, revenue: 0 };
          current.qty += item.qty;
          current.revenue += item.price * item.qty;
          salesMap.set(prod.id, current);
        }
      });
    });

    return Array.from(salesMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4);
  }, [s.orders, s.products]);

  const hasAnyWeeklySales = weeklySalesData.some((d) => d.ventes > 0);

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
        <StatCard label="Chiffre d'affaires Réel" value={formatDZD(totalSales)} Icon={TrendingUp} />
        <StatCard
          label="Total Commandes"
          value={`${s.orders.length}${newOrdersCount > 0 ? ` (${newOrdersCount} nvl)` : ""}`}
          Icon={ClipboardList}
        />
        <StatCard label="Clients Uniques" value={uniqueCustomersCount} Icon={Users} />
        <StatCard
          label="Stock Faible / Épuisé"
          value={lowStockProducts.length}
          Icon={Package}
          highlight={lowStockProducts.length > 0}
        />
      </div>

      {/* Sales Chart (100% Real data from orders) */}
      <div className="dk-surface rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
              Ventes des 7 derniers jours
            </h3>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              {hasAnyWeeklySales
                ? "Calcul automatique à partir de vos commandes réelles"
                : "Les revenus des commandes réelles apparaîtront ici automatiquement"}
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded dk-chip-teal">
            DZA (DA)
          </span>
        </div>
        <div style={{ width: "100%", height: 230 }}>
          <ResponsiveContainer>
            <BarChart data={weeklySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text-faint)" fontSize={12} />
              <YAxis stroke="var(--text-faint)" fontSize={12} />
              <Tooltip
                formatter={(val: any) => [formatDZD(Number(val) || 0), "Ventes"]}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--text)",
                }}
              />
              <Bar dataKey="ventes" fill="var(--teal)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Top Selling Products */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Real Orders */}
        <div className="dk-surface rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
              <ShoppingBag className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
              <span>Commandes Récentes</span>
            </h4>
            <button
              onClick={() => onNavigate("commandes")}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {s.orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-8 w-8 mx-auto text-slate-400 opacity-40 mb-2" />
                <p className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>
                  Aucune commande enregistrée pour le moment.
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>
                  Les commandes passées par vos clients s'afficheront ici en direct.
                </p>
              </div>
            ) : (
              s.orders.slice(0, 4).map((o) => (
                <div key={o.id} className="p-3 rounded-xl dk-surface-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold" style={{ color: "var(--text)" }}>
                      {o.customerName}{" "}
                      <span className="font-normal" style={{ color: "var(--text-faint)" }}>
                        ({o.wilaya})
                      </span>
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                      {o.id} • {o.items.length} article(s)
                    </p>
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

        {/* Top Real Selling Products */}
        <div className="dk-surface rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
              <Package className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
              <span>Top Ventes Produits (Réel)</span>
            </h4>
            <button
              onClick={() => onNavigate("produits")}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              Gérer stock <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {topSellingProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-8 w-8 mx-auto text-slate-400 opacity-40 mb-2" />
                <p className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>
                  Aucune vente enregistrée pour le moment.
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>
                  Le classement des meilleures ventes s'établira automatiquement dès les premières commandes.
                </p>
              </div>
            ) : (
              topSellingProducts.map(({ product: p, qty, revenue }) => (
                <div key={p.id} className="p-3 rounded-xl dk-surface-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-slate-800">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <IconTile Icon={p.icon} variant={2} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>
                        {p.name}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                        {qty} unité{qty > 1 ? "s" : ""} vendue{qty > 1 ? "s" : ""} • {formatDZD(revenue)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      p.stock === "in"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {p.stock === "in" ? "En stock" : "Stock faible"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
