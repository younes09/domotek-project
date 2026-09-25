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
} from "lucide-react";
import { WhatsAppIcon } from "../components/ui";
import { formatDZD } from "../lib/format";
import { formatOrderWhatsAppMessage } from "../lib/notifications";
import type { Store } from "../types";

export const ConfirmationView: React.FC<{ s: Store }> = ({ s }) => {
  const o = s.lastOrder;
  const [copied, setCopied] = useState(false);

  const whatsappMessage = o ? formatOrderWhatsAppMessage(o) : "";
  const whatsappUrl = `https://wa.me/213775302636?text=${encodeURIComponent(whatsappMessage)}`;

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
            <span>Envoyer sur WhatsApp (0775 30 26 36)</span>
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

        {/* Customer Information */}
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl dk-surface-2 space-y-1">
            <p className="font-semibold text-slate-400">Client :</p>
            <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{o.customerName}</p>
            <p className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-mono font-medium">
              <Phone className="h-3 w-3" /> {o.phone}
            </p>
          </div>

          <div className="p-3 rounded-xl dk-surface-2 space-y-1">
            <p className="font-semibold text-slate-400">Livraison :</p>
            <p className="font-bold" style={{ color: "var(--text)" }}>
              {o.commune}, {o.wilaya}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
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

        {/* Total & Payment Method */}
        <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between text-base font-extrabold">
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
