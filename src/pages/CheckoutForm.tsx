import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ALGERIA_WILAYAS } from "../data/wilayas";
import { formatDZD } from "../lib/format";
import type { CheckoutFormData, Store } from "../types";

type Errors = Partial<Record<keyof CheckoutFormData, string>>;

export const CheckoutForm: React.FC<{ s: Store }> = ({ s }) => {
  const [form, setForm] = useState<CheckoutFormData>({ name: "", phone: "", wilaya: "", commune: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const items = s.cartItemsDetailed;

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>Votre panier est vide.</p>
        <button onClick={() => s.goShop({})} className="mt-3 text-sm dk-focus rounded" style={{ color: "var(--teal)" }}>Découvrir les produits</button>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Errors = {};
    if (!form.name.trim()) err.name = "Champ requis";
    if (!/^0[5-7][0-9]{8}$/.test(form.phone.replace(/\s/g, ""))) err.phone = "Numéro invalide";
    if (!form.wilaya) err.wilaya = "Champ requis";
    if (!form.commune.trim()) err.commune = "Champ requis";
    if (!form.address.trim()) err.address = "Champ requis";
    setErrors(err);
    if (Object.keys(err).length === 0) s.placeOrder(form);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="dk-heading text-2xl font-semibold mb-6" style={{ color: "var(--text)" }}>Confirmer la commande</h1>

      <div className="dk-surface rounded-2xl p-4 mb-6">
        <p className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>Récapitulatif</p>
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i.key} className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text-dim)" }}>{i.product.name} {i.variant ? `(${i.variant})` : ""} × {i.qty}</span>
              <span style={{ color: "var(--text)" }}>{formatDZD(i.product.price * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-base font-semibold pt-3 mt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <span style={{ color: "var(--text)" }}>Total</span>
          <span className="dk-heading" style={{ color: "var(--text)" }}>{formatDZD(s.cartTotal)}</span>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Nom et prénom</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="dk-input rounded-xl px-3 py-2.5 w-full text-sm" placeholder="Votre nom complet" />
          {errors.name && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.name}</p>}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Numéro de téléphone</label>
          <input type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="dk-input rounded-xl px-3 py-2.5 w-full text-sm" placeholder="05XX XX XX XX" />
          {errors.phone && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.phone}</p>}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Wilaya</label>
            <select value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} className="dk-input rounded-xl px-3 py-2.5 w-full text-sm">
              <option value="">Sélectionner</option>
              {ALGERIA_WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
            {errors.wilaya && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.wilaya}</p>}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Commune</label>
            <input value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })} className="dk-input rounded-xl px-3 py-2.5 w-full text-sm" placeholder="Votre commune" />
            {errors.commune && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.commune}</p>}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Adresse</label>
          <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="dk-input rounded-xl px-3 py-2.5 w-full text-sm" placeholder="Rue, cité, repère…" />
          {errors.address && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.address}</p>}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Notes / instructions (facultatif)</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="dk-input rounded-xl px-3 py-2.5 w-full text-sm" placeholder="Précisions pour la livraison…" />
        </div>

        <div className="dk-surface-2 rounded-xl p-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: "var(--teal)" }} />
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>Paiement à la livraison</span>
        </div>

        <button type="submit" className="w-full rounded-xl py-3.5 text-sm font-semibold dk-btn-primary">Confirmer la commande</button>
      </form>
    </div>
  );
};
