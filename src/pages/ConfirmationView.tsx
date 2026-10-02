import React, { useState } from "react";
import {
  CheckCircle2,
  Phone,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  FileText,
  Truck,
  Building2,
  Home,
  Clock,
} from "lucide-react";
import { WhatsAppIcon } from "../components/ui";
import { formatDZD } from "../lib/format";
import { formatOrderWhatsAppMessage } from "../lib/notifications";
import { AndersonLogo } from "../components/AndersonLogo";
import { buildWhatsAppUrl } from "../lib/socialSettings";
import type { Store } from "../types";

export const ConfirmationView: React.FC<{ s: Store }> = ({ s }) => {
  const o = s.lastOrder;
  const [copied, setCopied] = useState(false);

  const whatsappMessage = o ? formatOrderWhatsAppMessage(o) : "";
  const whatsappUrl = buildWhatsAppUrl(s.socialSettings, whatsappMessage);

  const handleCopy = () => {
    if (!whatsappMessage) return;
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    s.showToast("Récapitulatif de commande copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!o) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="h-16 w-16 rounded-full mx-auto flex items-center justify-center bg-cyan-500/10 text-cyan-500">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="dk-heading text-2xl font-bold" style={{ color: "var(--text)" }}>
          Aucune commande récente
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
          Vous n'avez pas encore passé de commande ou votre session a expiré.
        </p>
        <button
          onClick={() => s.goShop({})}
          className="mt-4 px-6 py-3 rounded-xl font-bold text-sm dk-btn-primary"
        >
          Découvrir les produits
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Top Success Banner */}
      <div className="text-center space-y-3">
        <div className="h-16 w-16 rounded-full mx-auto flex items-center justify-center bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
        </div>
        <span className="inline-block text-[11px] font-bold font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          Commande enregistrée avec succès
        </span>
        <h1 className="dk-heading text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--text)" }}>
          Merci pour votre commande !
        </h1>
        <p className="text-xs sm:text-sm max-w-lg mx-auto leading-relaxed" style={{ color: "var(--text-dim)" }}>
          Votre commande <strong className="font-mono text-cyan-500 font-bold">{o.id}</strong> a bien été prise en compte. Un conseiller vous contactera par téléphone pour confirmer la livraison.
        </p>
      </div>

      {/* 🟢 WhatsApp Instant Action Hero Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 shadow-xl space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Option recommandée : Confirmation Express
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            ⚡ Traitement prioritaire
          </span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text)" }}>
          Envoyez directement votre récapitulatif prérempli sur notre WhatsApp pour accélérer la préparation et l'expédition de votre colis :
        </p>

        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,211,102,0.35)] transition-all transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-6 w-6 fill-slate-950 shrink-0" />
            <span>Envoyer sur WhatsApp ({s.socialSettings.whatsapp || "0775 30 26 36"})</span>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="py-3 px-4 rounded-xl dk-surface border text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:border-emerald-500/50 shrink-0"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
            title="Copier le texte de la commande"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copié !" : "Copier le texte"}</span>
          </button>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="dk-surface rounded-3xl p-5 sm:p-6 border space-y-4 shadow-md" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-500" />
            <h2 className="text-sm font-bold" style={{ color: "var(--text)" }}>Détails de votre commande</h2>
          </div>
          <span className="text-xs font-mono font-bold" style={{ color: "var(--text-dim)" }}>
            {o.id}
          </span>
        </div>

        {/* Customer Information & Delivery Details */}
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl dk-surface-2 space-y-1 border" style={{ borderColor: "var(--border)" }}>
            <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Destinataire</p>
            <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{o.customerName}</p>
            <p className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-mono font-medium">
              <Phone className="h-3 w-3" /> {o.phone}
            </p>
            <p className="text-[11px] pt-1" style={{ color: "var(--text-dim)" }}>
              {o.commune}, {o.wilaya}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl dk-surface-2 space-y-2 border" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                Mode de livraison
              </span>
              <AndersonLogo size="sm" showTagline={false} />
            </div>

            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${o.deliveryType === "desk" ? "bg-indigo-500/15 text-indigo-500" : "bg-cyan-500/15 text-cyan-500"}`}>
                {o.deliveryType === "desk" ? <Building2 className="h-4 w-4" /> : <Home className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-bold text-xs" style={{ color: "var(--text)" }}>
                  {o.deliveryType === "desk" ? "Bureau / Stopdesk Anderson" : "Livraison à domicile"}
                </p>
                {o.deliveryDelay && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    Délai estimé : {o.deliveryDelay}
                  </p>
                )}
              </div>
            </div>

            <p className="text-[11px] pt-1 border-t truncate" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              {o.address}
            </p>
          </div>
        </div>

        {o.notes && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
            <span className="font-bold text-cyan-600 dark:text-cyan-300">Instructions / Notes : </span>
            <span style={{ color: "var(--text)" }}>{o.notes}</span>
          </div>
        )}

        {/* Items List */}
        <div className="pt-2 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Articles commandés</p>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {o.items.map((it, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate" style={{ color: "var(--text)" }}>
                    {it.name} {it.variant ? `(${it.variant})` : ""}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                    Quantité : {it.qty} × {formatDZD(it.price)}
                  </p>
                </div>
                <span className="font-bold font-mono shrink-0" style={{ color: "var(--text)" }}>
                  {formatDZD(it.price * it.qty)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown & Total */}
        <div className="pt-3 border-t space-y-2 text-xs sm:text-sm" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--text-dim)" }}>Sous-total articles</span>
            <span className="font-semibold font-mono" style={{ color: "var(--text)" }}>
              {formatDZD(o.subtotal || o.total - (o.shippingFee || 0))}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-red-500" />
              <span style={{ color: "var(--text-dim)" }}>
                Livraison (Anderson Logistics - {o.deliveryType === "desk" ? "Stopdesk" : "À domicile"})
              </span>
            </div>
            <span className="font-semibold font-mono text-cyan-600 dark:text-cyan-400">
              {o.shippingFee && o.shippingFee > 0 ? `+ ${formatDZD(o.shippingFee)}` : "Gratuite"}
            </span>
          </div>

          <div className="flex items-center justify-between text-base font-extrabold pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <span style={{ color: "var(--text)" }}>Total de la commande :</span>
            <span className="text-xl dk-heading text-cyan-500 font-mono">{formatDZD(o.total)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs pt-1 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Paiement main à main en espèces à la livraison (58 Wilayas)</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => s.goHome()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold dk-btn-primary"
        >
          Retour à l'accueil
        </button>
        <button
          onClick={() => s.goShop({})}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold dk-btn-secondary"
        >
          Continuer mes achats
        </button>
      </div>
    </div>
  );
};
