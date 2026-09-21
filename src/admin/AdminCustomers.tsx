import React, { useMemo, useState } from "react";
import { Search, Phone, MessageSquare, Star, ShoppingBag, MapPin, Eye, X, Award, FileText } from "lucide-react";
import { formatDZD } from "../lib/format";
import type { Order, Store } from "../types";

interface CustomerRow {
  name: string;
  phone: string;
  wilaya: string;
  commune?: string;
  orders: Order[];
  totalSpent: number;
  lastOrderDate: string;
}

export const AdminCustomers: React.FC<{ s: Store }> = ({ s }) => {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);

  // Group orders by phone number to construct customer profiles
  const customers = useMemo(() => {
    const map = new Map<string, CustomerRow>();
    s.orders.forEach((o) => {
      const key = o.phone;
      if (!map.has(key)) {
        map.set(key, {
          name: o.customerName,
          phone: o.phone,
          wilaya: o.wilaya,
          commune: o.commune,
          orders: [],
          totalSpent: 0,
          lastOrderDate: o.date,
        });
      }
      const c = map.get(key)!;
      c.orders.push(o);
      c.totalSpent += o.total;
    });
    return Array.from(map.values());
  }, [s.orders]);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.wilaya.toLowerCase().includes(search.toLowerCase())
  );

  const getCleanPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = "213" + clean.slice(1);
    if (!clean.startsWith("213") && clean.length === 9) clean = "213" + clean;
    return clean;
  };

  const openWhatsAppCRM = (c: CustomerRow) => {
    const phoneNum = getCleanPhone(c.phone);
    const msg = `Bonjour ${c.name}, merci pour votre confiance envers DomoTek ! Nous faisons le suivi de votre installation domotique à ${c.wilaya}. Avez-vous besoin de conseils ou de nouveaux modules pour votre maison ?`;
    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const getTierBadge = (c: CustomerRow) => {
    if (c.totalSpent >= 10000 || c.orders.length >= 3) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
          <Star className="h-3 w-3 fill-amber-400 text-amber-500 dark:text-amber-400" /> Client VIP
        </span>
      );
    }
    if (c.orders.length >= 2) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
          <Award className="h-3 w-3 text-cyan-500 dark:text-cyan-400" /> Fidèle ({c.orders.length} cmd)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full dk-surface-2" style={{ color: "var(--text-dim)" }}>
        Nouveau Client
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="dk-heading text-xl font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
            <span>Gestion Relation Client (CRM)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full dk-chip-teal font-mono">
              {customers.length} clients
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
            Historique d'achats, niveau de fidélité et contact WhatsApp direct pour la relance client.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client par Nom, Numéro de téléphone, Wilaya..."
          className="dk-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm"
        />
      </div>

      {/* Customer CRM Table */}
      <div className="dk-surface rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b dk-surface-2" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
                <th className="text-left px-4 py-3 font-semibold">Client</th>
                <th className="text-left px-4 py-3 font-semibold">Téléphone / WhatsApp</th>
                <th className="text-left px-4 py-3 font-semibold">Wilaya</th>
                <th className="text-left px-4 py-3 font-semibold">Statut Client</th>
                <th className="text-left px-4 py-3 font-semibold">Commandes</th>
                <th className="text-left px-4 py-3 font-semibold">Total Dépensé (LTV)</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filteredCustomers.map((c) => (
                <tr key={c.phone} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                  <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: "var(--text)" }}>
                    {c.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openWhatsAppCRM(c)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                      title="Échanger sur WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span>{c.phone}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-dim)" }}>
                    {c.wilaya}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getTierBadge(c)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: "var(--text-dim)" }}>
                    {c.orders.length} commande(s)
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {formatDZD(c.totalSpent)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="h-8 px-3 rounded-lg dk-surface-2 hover:border-cyan-500/50 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      style={{ color: "var(--text)" }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Fiche Client</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="relative dk-surface rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div>
                <h3 className="dk-heading text-lg font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <span>Fiche Client : {selectedCustomer.name}</span>
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                  Dernière activité : {selectedCustomer.lastOrderDate}
                </p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="h-8 w-8 rounded-full dk-surface-2 flex items-center justify-center" style={{ color: "var(--text-dim)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl dk-surface-2 text-center">
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>Valeur Totale (LTV)</p>
                <p className="text-lg font-extrabold font-mono text-cyan-600 dark:text-cyan-400 mt-1">{formatDZD(selectedCustomer.totalSpent)}</p>
              </div>
              <div className="p-3.5 rounded-2xl dk-surface-2 text-center">
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>Statut Client</p>
                <div className="mt-1 flex justify-center">{getTierBadge(selectedCustomer)}</div>
              </div>
            </div>

            {/* Contact details */}
            <div className="p-4 rounded-2xl dk-surface-2 space-y-2 text-xs" style={{ color: "var(--text-dim)" }}>
              <p className="font-bold" style={{ color: "var(--text)" }}>Coordonnées de livraison</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} /> {selectedCustomer.phone}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} /> Wilaya de {selectedCustomer.wilaya}</p>
            </div>

            {/* Order History */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>Historique des Commandes ({selectedCustomer.orders.length})</p>
              <div className="space-y-2">
                {selectedCustomer.orders.map((o) => (
                  <div key={o.id} className="p-3 rounded-xl dk-surface-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">{o.id} • {o.date}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>{o.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold" style={{ color: "var(--text)" }}>{formatDZD(o.total)}</p>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400">{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CRM Action */}
            <div className="pt-2">
              <button
                onClick={() => openWhatsAppCRM(selectedCustomer)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageSquare className="h-4 w-4 fill-slate-950" />
                <span>Relancer / Contacter {selectedCustomer.name} sur WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


