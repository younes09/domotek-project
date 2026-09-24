import React, { useState, useMemo } from "react";
import {
  Search,
  Phone,
  MessageSquare,
  Eye,
  X,
  MapPin,
  Calendar,
  AlertCircle,
  Pencil,
  Trash2,
  PlusCircle,
  Check,
  DollarSign,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";
import { ORDER_STATUSES } from "../data/demoAdminData";
import { ALGERIA_WILAYAS } from "../data/wilayas";
import { formatDZD } from "../lib/format";
import type { Order, OrderItem, OrderStatus, Store } from "../types";
import { saveOrderToDb, deleteOrderFromDb } from "../lib/supabaseDb";

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  Nouvelle: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  Confirmée: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30" },
  "En préparation": { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  Expédiée: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  Livrée: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  Annulée: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/30" },
};

// Modal for Editing an Existing Order
const EditOrderModal: React.FC<{
  order: Order;
  store: Store;
  onSave: (updated: Order) => void;
  onClose: () => void;
}> = ({ order, store, onSave, onClose }) => {
  const [customerName, setCustomerName] = useState(order.customerName);
  const [phone, setPhone] = useState(order.phone);
  const [wilaya, setWilaya] = useState(order.wilaya);
  const [commune, setCommune] = useState(order.commune || "");
  const [address, setAddress] = useState(order.address || "");
  const [notes, setNotes] = useState(order.notes || "");
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [items, setItems] = useState<OrderItem[]>(order.items.map((it) => ({ ...it })));
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

  const computedTotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.price * it.qty, 0);
  }, [items]);

  const handleQtyChange = (index: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((it, idx) => (idx === index ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddItemFromCatalog = () => {
    if (!selectedCatalogId) return;
    const prod = store.products.find((p) => String(p.id) === selectedCatalogId);
    if (!prod) return;

    setItems((prev) => [
      ...prev,
      {
        name: prod.name,
        price: prod.price,
        qty: 1,
        variant: prod.variants?.options[0] || null,
      },
    ]);
    setSelectedCatalogId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || items.length === 0) {
      alert("Veuillez renseigner le nom, téléphone et au moins un article.");
      return;
    }

    const updated: Order = {
      ...order,
      customerName: customerName.trim(),
      phone: phone.trim(),
      wilaya: wilaya.trim(),
      commune: commune.trim(),
      address: address.trim(),
      notes: notes.trim(),
      status,
      items,
      total: computedTotal,
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative dk-surface rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 border"
        style={{ borderColor: "var(--border)", maxHeight: "92vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center dk-chip-teal shadow-inner">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h3 className="dk-heading text-lg font-bold" style={{ color: "var(--text)" }}>
                Modifier la commande {order.id}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Ajustez les informations client, les articles et le statut de livraison
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center dk-surface-2 hover:bg-slate-700/30 transition-colors"
          >
            <X className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status and Customer Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Statut de la commande
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-bold"
              >
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Nom complet du client <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                N° Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Wilaya de destination
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              >
                {ALGERIA_WILAYAS.map((w) => {
                  const cleanName = w.replace(/^\d+\s*-\s*/, "");
                  return (
                    <option key={w} value={cleanName}>
                      {w}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Commune / Ville
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="Ex: Bab Ezzouar"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
              Adresse de livraison précise
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Cité, Rue, N° Bâtiment ou repère..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
              Remarques / Instructions de livraison
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Disponibilité, code d'accès, appel avant passage..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          {/* Items Section */}
          <div className="p-4 rounded-2xl dk-surface-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                <ShoppingBag className="h-4 w-4 text-cyan-500" />
                <span>Articles commandés ({items.length})</span>
              </label>
              <span className="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">
                Sous-total : {formatDZD(computedTotal)}
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto dk-scrollbar pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl dk-surface flex items-center justify-between gap-3 text-xs border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate" style={{ color: "var(--text)" }}>
                      {item.name}
                    </p>
                    <p className="text-[11px] font-mono" style={{ color: "var(--text-dim)" }}>
                      {formatDZD(item.price)} / unité {item.variant ? `(${item.variant})` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center dk-surface-2 rounded-lg border" style={{ borderColor: "var(--border)" }}>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, -1)}
                        className="h-7 w-7 flex items-center justify-center hover:bg-slate-700/20"
                        title="Diminuer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-bold font-mono text-xs">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, 1)}
                        className="h-7 w-7 flex items-center justify-center hover:bg-slate-700/20"
                        title="Augmenter"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="w-20 text-right font-bold font-mono text-cyan-600 dark:text-cyan-400">
                      {formatDZD(item.qty * item.price)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Supprimer cet article"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add product from catalog */}
            <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <select
                value={selectedCatalogId}
                onChange={(e) => setSelectedCatalogId(e.target.value)}
                className="dk-input rounded-xl px-3 py-2 flex-1 text-xs"
              >
                <option value="">-- Ajouter un produit du catalogue --</option>
                {store.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatDZD(p.price)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddItemFromCatalog}
                disabled={!selectedCatalogId}
                className="dk-btn-secondary px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-bold dk-btn-primary transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Enregistrer les modifications</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-3 text-sm font-semibold dk-btn-secondary transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Creating a Manual Order
const CreateOrderModal: React.FC<{
  store: Store;
  onSave: (newOrder: Order) => void;
  onClose: () => void;
}> = ({ store, onSave, onClose }) => {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("Alger");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<OrderStatus>("Confirmée");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

  const computedTotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.price * it.qty, 0);
  }, [items]);

  const handleAddItemFromCatalog = () => {
    if (!selectedCatalogId) return;
    const prod = store.products.find((p) => String(p.id) === selectedCatalogId);
    if (!prod) return;

    setItems((prev) => [
      ...prev,
      {
        name: prod.name,
        price: prod.price,
        qty: 1,
        variant: prod.variants?.options[0] || null,
      },
    ]);
    setSelectedCatalogId("");
  };

  const handleQtyChange = (index: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((it, idx) => (idx === index ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      alert("Veuillez renseigner le nom et le téléphone du client.");
      return;
    }
    if (items.length === 0) {
      alert("Veuillez ajouter au moins un produit à la commande.");
      return;
    }

    const newId = `CMD-${1000 + store.orders.length + 1}`;
    const newOrder: Order = {
      id: newId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      wilaya: wilaya.trim(),
      commune: commune.trim(),
      address: address.trim(),
      notes: notes.trim(),
      status,
      items,
      total: computedTotal,
      date: new Date().toISOString().slice(0, 10),
    };

    onSave(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative dk-surface rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 border"
        style={{ borderColor: "var(--border)", maxHeight: "92vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center dk-chip-teal shadow-inner">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="dk-heading text-lg font-bold" style={{ color: "var(--text)" }}>
                Créer une commande manuelle
              </h3>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Enregistrez une commande reçue par téléphone, WhatsApp ou en magasin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center dk-surface-2 hover:bg-slate-700/30 transition-colors"
          >
            <X className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Statut initial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-bold"
              >
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Nom complet du client <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Yacine Benali"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                N° Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0550 12 34 56"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Wilaya
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              >
                {ALGERIA_WILAYAS.map((w) => {
                  const cleanName = w.replace(/^\d+\s*-\s*/, "");
                  return (
                    <option key={w} value={cleanName}>
                      {w}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Commune
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="Ex: Hydra"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
              Adresse de livraison
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresse précise..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
              Notes de commande
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes spécifiques..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          {/* Items Section */}
          <div className="p-4 rounded-2xl dk-surface-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                <ShoppingBag className="h-4 w-4 text-cyan-500" />
                <span>Articles à ajouter ({items.length})</span>
              </label>
              <span className="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">
                Total : {formatDZD(computedTotal)}
              </span>
            </div>

            {items.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto dk-scrollbar pr-1">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl dk-surface flex items-center justify-between gap-3 text-xs border"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate" style={{ color: "var(--text)" }}>
                        {item.name}
                      </p>
                      <p className="text-[11px] font-mono" style={{ color: "var(--text-dim)" }}>
                        {formatDZD(item.price)} / unité
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center dk-surface-2 rounded-lg border" style={{ borderColor: "var(--border)" }}>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, -1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-slate-700/20"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-bold font-mono text-xs">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, 1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-slate-700/20"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="w-20 text-right font-bold font-mono text-cyan-600 dark:text-cyan-400">
                        {formatDZD(item.qty * item.price)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs p-3 rounded-xl dk-surface text-center" style={{ color: "var(--text-dim)" }}>
                Sélectionnez un produit ci-dessous pour l'ajouter à la commande.
              </p>
            )}

            <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <select
                value={selectedCatalogId}
                onChange={(e) => setSelectedCatalogId(e.target.value)}
                className="dk-input rounded-xl px-3 py-2 flex-1 text-xs"
              >
                <option value="">-- Choisir un produit du catalogue --</option>
                {store.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatDZD(p.price)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddItemFromCatalog}
                disabled={!selectedCatalogId}
                className="dk-btn-secondary px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-bold dk-btn-primary transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Créer la commande</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-3 text-sm font-semibold dk-btn-secondary transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Deleting an Order
const DeleteOrderModal: React.FC<{
  order: Order;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ order, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative dk-surface rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 border"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="dk-heading text-lg font-bold" style={{ color: "var(--text)" }}>
              Supprimer la commande ?
            </h3>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              Voulez-vous définitivement supprimer la commande <strong style={{ color: "var(--text)" }}>{order.id}</strong> de <strong style={{ color: "var(--text)" }}>{order.customerName}</strong> ({formatDZD(order.total)}) ?
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Cette action est irréversible et retirera cette commande des statistiques.</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-md"
          >
            Confirmer la suppression
          </button>
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold dk-btn-secondary transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminOrders: React.FC<{ s: Store }> = ({ s }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [creatingOrder, setCreatingOrder] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return s.orders.filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch =
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(search) ||
        o.wilaya.toLowerCase().includes(q) ||
        (o.commune && o.commune.toLowerCase().includes(q)) ||
        o.items.some((it) => it.name.toLowerCase().includes(q));

      if (statusFilter === "all") return matchesSearch;
      return matchesSearch && o.status === statusFilter;
    });
  }, [s.orders, search, statusFilter]);

  // Statistics
  const totalRevenue = useMemo(() => {
    return s.orders.filter((o) => o.status !== "Annulée").reduce((sum, o) => sum + o.total, 0);
  }, [s.orders]);

  const pendingCount = useMemo(() => {
    return s.orders.filter((o) => o.status === "Nouvelle" || o.status === "En préparation").length;
  }, [s.orders]);

  const deliveredCount = useMemo(() => {
    return s.orders.filter((o) => o.status === "Livrée").length;
  }, [s.orders]);

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

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    s.setOrders((prev) => {
      const updatedList = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      const target = updatedList.find((o) => o.id === orderId);
      if (target) {
        saveOrderToDb(target).catch((e) => console.error("Supabase status update error", e));
      }
      return updatedList;
    });
    s.showToast(`Statut de la commande ${orderId} mis à jour : ${newStatus}`);
  };

  const handleSaveEdit = (updated: Order) => {
    s.setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    saveOrderToDb(updated).catch((e) => console.error("Supabase order edit error", e));
    s.showToast(`Commande ${updated.id} modifiée avec succès`);
    setEditingOrder(null);
    if (selectedOrder && selectedOrder.id === updated.id) {
      setSelectedOrder(updated);
    }
  };

  const handleSaveCreate = (newOrder: Order) => {
    s.setOrders((prev) => [newOrder, ...prev]);
    saveOrderToDb(newOrder).catch((e) => console.error("Supabase order create error", e));
    s.showToast(`Nouvelle commande ${newOrder.id} créée`);
    setCreatingOrder(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingOrder) return;
    const id = deletingOrder.id;
    s.setOrders((prev) => prev.filter((o) => o.id !== id));
    deleteOrderFromDb(id).catch((e) => console.error("Supabase order delete error", e));
    s.showToast(`Commande ${id} supprimée`);
    setDeletingOrder(null);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="dk-heading text-xl font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
            <span>Gestion des Commandes & Factures</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full dk-chip-teal font-mono">
              {s.orders.length} commandes
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
            Modifiez les coordonnées, ajustez les articles, gérez les statuts ou supprimez des commandes.
          </p>
        </div>

        <button
          onClick={() => setCreatingOrder(true)}
          className="dk-btn-primary font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Nouvelle commande manuelle</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl dk-chip-teal flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Chiffre d'Affaires Actif</p>
            <p className="text-xl font-extrabold font-mono" style={{ color: "var(--text)" }}>{formatDZD(totalRevenue)}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>À Traiter / En Préparation</p>
            <p className="text-xl font-extrabold font-mono text-amber-500">{pendingCount} commande{pendingCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Commandes Livrées</p>
            <p className="text-xl font-extrabold font-mono text-emerald-500">{deliveredCount} livrée{deliveredCount !== 1 ? "s" : ""}</p>
          </div>
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
            placeholder="Rechercher par N° commande, Nom, Téléphone, Wilaya, Article..."
            className="dk-input w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 dk-scrollbar">
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
            const styleInfo = STATUS_COLORS[st];
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? `${styleInfo.bg} ${styleInfo.text} border ${styleInfo.border}`
                    : "dk-surface"
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
      <div className="dk-surface rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto dk-scrollbar">
          <table className="w-full min-w-[850px] text-xs sm:text-sm">
            <thead>
              <tr className="border-b dk-surface-2" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
                <th className="text-left px-4 py-3.5 font-semibold">N° Commande & Date</th>
                <th className="text-left px-4 py-3.5 font-semibold">Client</th>
                <th className="text-left px-4 py-3.5 font-semibold">Téléphone / WhatsApp</th>
                <th className="text-left px-4 py-3.5 font-semibold">Wilaya & Commune</th>
                <th className="text-left px-4 py-3.5 font-semibold">Articles & Total (DA)</th>
                <th className="text-left px-4 py-3.5 font-semibold">Statut</th>
                <th className="text-right px-4 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: "var(--text-dim)" }}>
                    <p className="text-sm">Aucune commande trouvée.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const styleInfo = STATUS_COLORS[o.status] || STATUS_COLORS.Nouvelle;
                  return (
                    <tr key={o.id} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          {o.id}
                        </p>
                        <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                          {o.date}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-medium whitespace-nowrap" style={{ color: "var(--text)" }}>
                        {o.customerName}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => openWhatsAppOrder(o)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                          title="Contacter sur WhatsApp"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                          <span>{o.phone}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "var(--text-dim)" }}>
                        <p className="font-semibold" style={{ color: "var(--text)" }}>{o.wilaya}</p>
                        <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>{o.commune || "Centre"}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono">
                        <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{formatDZD(o.total)}</p>
                        <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>{o.items.length} article{o.items.length !== 1 ? "s" : ""}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className={`rounded-xl px-2.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${styleInfo.bg} ${styleInfo.text} ${styleInfo.border}`}
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-[var(--surface)] text-[var(--text)]">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-colors"
                            style={{ color: "var(--text)" }}
                            title="Voir la facture / détails"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingOrder(o)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-colors"
                            style={{ color: "var(--text)" }}
                            title="Modifier la commande"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingOrder(o)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:bg-red-500/10 text-red-500 transition-colors"
                            title="Supprimer la commande"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details / Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div
            className="relative dk-surface rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 border"
            style={{ borderColor: "var(--border)", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div>
                <h3 className="dk-heading text-lg font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <span>Commande {selectedOrder.id}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[selectedOrder.status]?.bg} ${STATUS_COLORS[selectedOrder.status]?.text} ${STATUS_COLORS[selectedOrder.status]?.border}`}>
                    {selectedOrder.status}
                  </span>
                </h3>
                <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-dim)" }}>
                  <Calendar className="h-3.5 w-3.5" /> Date : {selectedOrder.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 rounded-full dk-surface-2 flex items-center justify-center"
                style={{ color: "var(--text-dim)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Customer info card */}
            <div className="p-4 rounded-2xl dk-surface-2 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  Informations Destinataire
                </p>
                <button
                  onClick={() => {
                    setEditingOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="text-xs text-cyan-500 hover:underline font-semibold flex items-center gap-1"
                >
                  <Pencil className="h-3 w-3" /> Modifier
                </button>
              </div>
              <div className="text-xs space-y-1" style={{ color: "var(--text-dim)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                  {selectedOrder.customerName}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} /> {selectedOrder.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} /> Wilaya de {selectedOrder.wilaya} ({selectedOrder.commune || "Centre"})
                </p>
                {selectedOrder.address && (
                  <p className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                    Adresse : {selectedOrder.address}
                  </p>
                )}
                {selectedOrder.notes && (
                  <p className="text-amber-500 dark:text-amber-400 italic pt-1">
                    Note client : « {selectedOrder.notes} »
                  </p>
                )}
              </div>
            </div>

            {/* Items table */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                Articles commandés ({selectedOrder.items.length})
              </p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl dk-surface-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold" style={{ color: "var(--text)" }}>{item.name}</p>
                      {item.variant && <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>Variante : {item.variant}</p>}
                      <p style={{ color: "var(--text-dim)" }}>Quantité : {item.qty} × {formatDZD(item.price)}</p>
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
              <span className="text-xs font-bold" style={{ color: "var(--text)" }}>
                Total à encaisser (Paiement à la livraison)
              </span>
              <span className="text-lg font-black font-mono text-cyan-600 dark:text-cyan-400">
                {formatDZD(selectedOrder.total)}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => openWhatsAppOrder(selectedOrder)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageSquare className="h-4 w-4 fill-slate-950" />
                <span>Contacter {selectedOrder.customerName} sur WhatsApp</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl dk-btn-secondary text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Modifier cette commande</span>
                </button>
                <button
                  onClick={() => {
                    setDeletingOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          store={s}
          onSave={handleSaveEdit}
          onClose={() => setEditingOrder(null)}
        />
      )}

      {/* Create Order Modal */}
      {creatingOrder && (
        <CreateOrderModal
          store={s}
          onSave={handleSaveCreate}
          onClose={() => setCreatingOrder(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingOrder && (
        <DeleteOrderModal
          order={deletingOrder}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingOrder(null)}
        />
      )}
    </div>
  );
};
