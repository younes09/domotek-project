import React, { useState } from "react";
import { Search, Phone, MessageSquare, Eye, X, MapPin, Calendar, PackageCheck, AlertCircle } from "lucide-react";
import { ORDER_STATUSES } from "../data/demoAdminData";
import { formatDZD } from "../lib/format";
import type { Order, OrderStatus, Store } from "../types";

export const AdminOrders: React.FC<{ s: Store }> = ({ s }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = s.orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.wilaya.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && o.status === statusFilter;
  });

  const getCleanPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = "213" + clean.slice(1);
    if (!clean.startsWith("213") && clean.length === 9) clean = "213" + clean;
    return clean;
  };

  const openWhatsAppOrder = (o: Order) => {
    const phoneNum = getCleanPhone(o.phone);
    const msg = `Bonjour ${o.customerName}, nous vous contactons concernant votre commande DomoTek (${o.id}) d'un montant de ${formatDZD(o.total)}. Est-ce que votre adresse à ${o.wilaya} (${o.commune || ""}) est confirmée ?`;
    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="dk-heading text-xl font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
            <span>Gestion des Commandes</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full dk-chip-teal font-mono">
              {s.orders.length} commandes
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
            Suivez l'état des livraisons et contactez directement vos clients par WhatsApp.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° commande, Nom, Téléphone, Wilaya..."
            className="dk-input w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === "all" ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30" : "dk-surface"
            }`}
            style={statusFilter !== "all" ? { color: "var(--text-dim)" } : {}}
          >
            Toutes ({s.orders.length})
          </button>
          {ORDER_STATUSES.map((st) => {
            const count = s.orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30" : "dk-surface"
                }`}
                style={statusFilter !== st ? { color: "var(--text-dim)" } : {}}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="dk-surface rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b dk-surface-2" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
                <th className="text-left px-4 py-3 font-semibold">N° Commande</th>
                <th className="text-left px-4 py-3 font-semibold">Client</th>
                <th className="text-left px-4 py-3 font-semibold">Téléphone / WhatsApp</th>
                <th className="text-left px-4 py-3 font-semibold">Wilaya</th>
                <th className="text-left px-4 py-3 font-semibold">Total (DA)</th>
                <th className="text-left px-4 py-3 font-semibold">Statut</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                    {o.id}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "var(--text)" }}>
                    {o.customerName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openWhatsAppOrder(o)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                      title="Contacter sur WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span>{o.phone}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-dim)" }}>
                    {o.wilaya}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono font-bold" style={{ color: "var(--text)" }}>
                    {formatDZD(o.total)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        s.setOrders((prev) =>
                          prev.map((x) => (x.id === o.id ? { ...x, status: e.target.value as OrderStatus } : x))
                        )
                      }
                      className="dk-input rounded-xl px-2 py-1 text-xs font-bold cursor-pointer"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-[var(--surface)] text-[var(--text)]">
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-colors"
                        style={{ color: "var(--text)" }}
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative dk-surface rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div>
                <h3 className="dk-heading text-lg font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <span>Commande {selectedOrder.id}</span>
                  <span className="text-xs font-normal px-2.5 py-0.5 rounded-full dk-chip-teal">
                    {selectedOrder.status}
                  </span>
                </h3>
                <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-dim)" }}>
                  <Calendar className="h-3.5 w-3.5" /> Date : {selectedOrder.date}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="h-8 w-8 rounded-full dk-surface-2 flex items-center justify-center" style={{ color: "var(--text-dim)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Customer info card */}
            <div className="p-4 rounded-2xl dk-surface-2 space-y-2">
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Informations Destinataire</p>
              <div className="text-xs space-y-1" style={{ color: "var(--text-dim)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{selectedOrder.customerName}</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} /> {selectedOrder.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} /> Wilaya de {selectedOrder.wilaya} ({selectedOrder.commune || "Centre"})
                </p>
                {selectedOrder.address && (
                  <p className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>Adresse: {selectedOrder.address}</p>
                )}
                {selectedOrder.notes && (
                  <p className="text-amber-500 dark:text-amber-400 italic pt-1">Note client: « {selectedOrder.notes} »</p>
                )}
              </div>
            </div>

            {/* Items table */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>Articles commandés ({selectedOrder.items.length})</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl dk-surface-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold" style={{ color: "var(--text)" }}>{item.name}</p>
                      {item.variant && <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>Variante: {item.variant}</p>}
                      <p style={{ color: "var(--text-dim)" }}>Quantité: {item.qty} × {formatDZD(item.price)}</p>
                    </div>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {formatDZD(item.qty * item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <span className="text-xs font-bold" style={{ color: "var(--text)" }}>Total à encaisser (Livraison main à main)</span>
              <span className="text-lg font-black font-mono text-cyan-600 dark:text-cyan-400">{formatDZD(selectedOrder.total)}</span>
            </div>

            {/* WhatsApp action */}
            <div className="pt-2">
              <button
                onClick={() => openWhatsAppOrder(selectedOrder)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageSquare className="h-4 w-4 fill-slate-950" />
                <span>Contacter {selectedOrder.customerName} sur WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


