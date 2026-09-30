import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Home,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ALGERIA_WILAYAS } from "../data/wilayas";
import { ProductTile } from "../components/ui";
import { formatDZD } from "../lib/format";
import { getAndersonTariff, ANDERSON_COMPANY_INFO } from "../data/andersonRates";
import { AndersonLogo } from "../components/AndersonLogo";
import type { CheckoutFormData, DeliveryType, Store } from "../types";

type Errors = Partial<Record<keyof CheckoutFormData, string>>;

export const CheckoutForm: React.FC<{ s: Store }> = ({ s }) => {
  const [form, setForm] = useState<Omit<CheckoutFormData, "deliveryType" | "shippingFee" | "deliveryDelay">>({
    name: "",
    phone: "",
    wilaya: "",
    commune: "",
    address: "",
    notes: "",
  });
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("home");
  const [errors, setErrors] = useState<Errors>({});

  const items = s.cartItemsDetailed;

  // Retrieve current Anderson delivery tariff based on selected wilaya
  const currentTariff = useMemo(() => {
    return getAndersonTariff(form.wilaya);
  }, [form.wilaya]);

  // If selected wilaya does not support Stopdesk / Bureau, switch back to home
  useEffect(() => {
    if (currentTariff && currentTariff.deskPrice === null && deliveryType === "desk") {
      setDeliveryType("home");
    }
  }, [currentTariff, deliveryType]);

  // Compute shipping fee & total
  const shippingFee = useMemo(() => {
    if (!currentTariff) return 0;
    if (deliveryType === "desk") {
      return currentTariff.deskPrice !== null ? currentTariff.deskPrice : currentTariff.homePrice;
    }
    return currentTariff.homePrice;
  }, [currentTariff, deliveryType]);

  const deliveryDelay = currentTariff?.delay || "";
  const grandTotal = s.cartTotal + (currentTariff ? shippingFee : 0);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>Votre panier est vide.</p>
        <button
          onClick={() => s.goShop({})}
          className="mt-3 text-sm dk-focus rounded"
          style={{ color: "var(--teal)" }}
        >
          Découvrir les produits
        </button>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Errors = {};
    if (!form.name.trim()) err.name = "Nom et prénom requis";
    if (!/^0[5-7][0-9]{8}$/.test(form.phone.replace(/\s/g, ""))) {
      err.phone = "Numéro invalide (ex: 0555 12 34 56)";
    }
    if (!form.wilaya) err.wilaya = "Veuillez choisir votre wilaya";
    if (!form.commune.trim()) err.commune = "Commune requise";
    if (!form.address.trim()) {
      err.address = deliveryType === "desk"
        ? "Précisez votre adresse ou l'agence Anderson de retrait"
        : "Adresse complète requise";
    }

    setErrors(err);

    if (Object.keys(err).length === 0) {
      s.placeOrder({
        ...form,
        deliveryType,
        shippingFee: currentTariff ? shippingFee : 0,
        deliveryDelay,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Return & Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => s.goBack()}
          className="h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold dk-surface border dk-focus hover:opacity-80 transition-all"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" style={{ color: "var(--teal)" }} />
          <span>Retour</span>
        </button>
        <h1 className="dk-heading text-xl sm:text-2xl font-bold" style={{ color: "var(--text)" }}>
          Finaliser ma commande
        </h1>
      </div>

      {/* Official Delivery Partner Card */}
      <div
        className="mb-6 p-4 sm:p-5 rounded-2xl border dk-surface shadow-sm relative overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border shadow-sm shrink-0" style={{ borderColor: "var(--border)" }}>
            <AndersonLogo size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transporteur Partenaire
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                {ANDERSON_COMPANY_INFO.name}
              </span>
            </div>
            <p className="text-xs font-medium flex items-center gap-1.5 mt-1" style={{ color: "var(--text)" }}>
              <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <span>Expédition rapide depuis <strong>Alger (16)</strong> vers toutes les wilayas</span>
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary & Cart Items */}
      <div className="dk-surface rounded-2xl p-4 sm:p-5 mb-6 border" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-400">
          Articles de votre commande ({items.length})
        </p>

        <div className="space-y-3 divide-y" style={{ borderColor: "var(--border)" }}>
          {items.map((i) => (
            <div key={i.key} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 shrink-0">
                  <ProductTile
                    Icon={i.product.icon}
                    imageUrl={i.product.imageUrl}
                    images={i.product.images}
                    name={i.product.name}
                    variant={2}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate text-xs sm:text-sm" style={{ color: "var(--text)" }}>
                    {i.product.name} {i.variant ? `(${i.variant})` : ""}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    Qté : {i.qty} × {formatDZD(i.product.price)}
                  </p>
                </div>
              </div>
              <span className="font-bold font-mono text-xs sm:text-sm shrink-0" style={{ color: "var(--text)" }}>
                {formatDZD(i.product.price * i.qty)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="mt-4 pt-3 border-t space-y-2 text-xs sm:text-sm" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--text-dim)" }}>Sous-total articles</span>
            <span className="font-semibold font-mono" style={{ color: "var(--text)" }}>
              {formatDZD(s.cartTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-red-500" />
              <span style={{ color: "var(--text-dim)" }}>
                Livraison {currentTariff ? `(${deliveryType === "desk" ? "Bureau Anderson" : "À domicile"}${deliveryDelay ? ` • ${deliveryDelay}` : ""})` : ""}
              </span>
            </div>
            {currentTariff ? (
              <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">
                + {formatDZD(shippingFee)}
              </span>
            ) : (
              <span className="text-xs italic text-slate-400">
                Sélectionnez votre wilaya ci-dessous
              </span>
            )}
          </div>

          <div
            className="flex items-center justify-between text-base sm:text-lg font-bold pt-3 mt-2 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <span style={{ color: "var(--text)" }}>Total à payer</span>
            <span className="dk-heading text-lg sm:text-xl font-mono text-cyan-600 dark:text-cyan-400">
              {formatDZD(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={submit} className="space-y-5">
        <div className="dk-surface rounded-2xl p-4 sm:p-6 border space-y-4" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Coordonnées du destinataire
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                Nom et prénom <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm"
                placeholder="Ex: Mohamed Benali"
              />
              {errors.name && <p className="text-xs mt-1 text-red-500 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                Numéro de téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm"
                placeholder="05 / 06 / 07 XX XX XX XX"
              />
              {errors.phone && <p className="text-xs mt-1 text-red-500 font-medium">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Wilaya & Delivery mode selector */}
        <div className="dk-surface rounded-2xl p-4 sm:p-6 border space-y-4" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Destination & Choix de livraison
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                Wilaya de destination <span className="text-red-500">*</span>
              </label>
              <select
                value={form.wilaya}
                onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm"
              >
                <option value="">-- Choisissez votre wilaya --</option>
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              {errors.wilaya && <p className="text-xs mt-1 text-red-500 font-medium">{errors.wilaya}</p>}
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                Commune de livraison <span className="text-red-500">*</span>
              </label>
              <input
                value={form.commune}
                onChange={(e) => setForm({ ...form, commune: e.target.value })}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm"
                placeholder="Ex: Alger Centre, Bab Ezzouar, Es Sénia..."
              />
              {errors.commune && <p className="text-xs mt-1 text-red-500 font-medium">{errors.commune}</p>}
            </div>
          </div>

          {/* Delivery Method Options (Domicile vs Stopdesk) */}
          <div className="pt-2">
            <label className="text-xs font-bold block mb-2" style={{ color: "var(--text)" }}>
              Mode de livraison Anderson Logistics <span className="text-red-500">*</span>
            </label>

            {currentTariff ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Option À Domicile */}
                <button
                  type="button"
                  onClick={() => setDeliveryType("home")}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                    deliveryType === "home"
                      ? "border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-500/5 shadow-md"
                      : "dk-surface-2 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${deliveryType === "home" ? "bg-cyan-500 text-white" : "dk-surface border text-slate-400"}`}>
                        <Home className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                          À domicile
                        </p>
                        <p className="text-xs text-slate-400">
                          Livré direct à votre adresse
                        </p>
                      </div>
                    </div>
                    {deliveryType === "home" && (
                      <CheckCircle2 className="h-5 w-5 text-cyan-500 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <Clock className="h-3 w-3" />
                      Délai : {currentTariff.delay}
                    </span>
                    <span className="text-base font-black font-mono text-cyan-600 dark:text-cyan-400">
                      {formatDZD(currentTariff.homePrice)}
                    </span>
                  </div>
                </button>

                {/* 2. Option Bureau / Stopdesk */}
                {currentTariff.deskPrice !== null ? (
                  <button
                    type="button"
                    onClick={() => setDeliveryType("desk")}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                      deliveryType === "desk"
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5 shadow-md"
                        : "dk-surface-2 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${deliveryType === "desk" ? "bg-indigo-600 text-white" : "dk-surface border text-slate-400"}`}>
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                              Bureau (Stopdesk)
                            </p>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Économique
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Récupération agence Anderson
                          </p>
                        </div>
                      </div>
                      {deliveryType === "desk" && (
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <Clock className="h-3 w-3" />
                        Délai : {currentTariff.delay}
                      </span>
                      <span className="text-base font-black font-mono text-indigo-600 dark:text-indigo-400">
                        {formatDZD(currentTariff.deskPrice)}
                      </span>
                    </div>
                  </button>
                ) : (
                  <div
                    className="p-4 rounded-2xl border dk-surface-2 opacity-60 cursor-not-allowed flex flex-col justify-between gap-3"
                    style={{ borderColor: "var(--border)" }}
                    title="Stopdesk non disponible dans cette wilaya"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl dk-surface border text-slate-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                          Bureau (Stopdesk)
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3" />
                          Non disponible pour {currentTariff.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 italic pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                      Seule la livraison à domicile est assurée.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">
                <Truck className="h-5 w-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Choisissez une wilaya ci-dessus pour afficher automatiquement les tarifs et délais de livraison à domicile ou en bureau Anderson Logistics.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
              {deliveryType === "desk" ? "Adresse ou précision agence Anderson" : "Adresse exacte de livraison"} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm"
              placeholder={
                deliveryType === "desk"
                  ? "Indiquez l'agence Anderson de retrait souhaitée ou votre quartier / commune..."
                  : "Numéro de rue, bâtiment, repère visuel (ex: à côté de la pharmacie, en face de l'école)..."
              }
            />
            {errors.address && <p className="text-xs mt-1 text-red-500 font-medium">{errors.address}</p>}
          </div>

          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
              Instructions particulières / Remarques (facultatif)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm"
              placeholder="Disponibilité pour la livraison, créneau horaire souhaité..."
            />
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="dk-surface-2 rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/25">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: "var(--text)" }}>
                Paiement main à main à la livraison
              </p>
              <p className="text-[11px] text-slate-400">
                Réglez en espèces lors de la remise de votre colis par le livreur Anderson.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-center">
            Total : {formatDZD(grandTotal)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-2xl py-4 text-sm sm:text-base font-bold dk-btn-primary shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
        >
          <span>Confirmer et commander</span>
          <span>•</span>
          <span className="font-mono">{formatDZD(grandTotal)}</span>
        </button>

        {/* Reassurance Delivery & Payment link */}
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Livraison express 58 Wilayas & Paiement à la réception.</span>
          <button
            type="button"
            onClick={() => s.setReturnPolicyOpen(true)}
            className="text-cyan-500 hover:underline font-semibold"
          >
            Voir les conditions
          </button>
        </div>
      </form>
    </div>
  );
};
