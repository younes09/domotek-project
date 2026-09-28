import React, { useEffect } from "react";
import {
  X,
  ShieldCheck,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Phone,
  HelpCircle,
} from "lucide-react";
import type { Store } from "../types";

export const ReturnPolicyModal: React.FC<{ s: Store }> = ({ s }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => s.setReturnPolicyOpen(false)}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl dk-surface rounded-3xl border shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col z-10"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 border-b flex items-center justify-between gap-4 sticky top-0 z-20"
          style={{ background: "var(--header-bg)", borderColor: "var(--border)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0 border border-cyan-500/25">
              <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="dk-heading text-lg sm:text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                Politique de Retour & Garantie
              </h2>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>
                DomoTek Algérie — Engagement qualité & satisfaction 100%
              </p>
            </div>
          </div>

          <button
            onClick={() => s.setReturnPolicyOpen(false)}
            className="h-9 w-9 rounded-xl flex items-center justify-center dk-surface-2 dk-focus hover:opacity-80 transition-opacity"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" style={{ color: "var(--text)" }} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 dk-scrollbar">
          {/* Top summary highlight banner */}
          <div
            className="p-4 rounded-2xl border flex items-start gap-3.5"
            style={{
              background: "var(--teal-dim)",
              borderColor: "rgba(0, 180, 255, 0.3)",
            }}
          >
            <ShieldCheck className="h-6 w-6 text-cyan-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              <p className="font-bold">Achetez en toute sérénité</p>
              <p className="mt-1" style={{ color: "var(--text-dim)" }}>
                Tous nos produits connectés sont vérifiés avant expédition et bénéficient d'une <strong>garantie de 12 mois</strong> ainsi que d'un droit de retour sous <strong>7 jours</strong>.
              </p>
            </div>
          </div>

          {/* Section 1: Délai de retour */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                1. Délai de rétractation et de retour
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              Vous disposez de <strong>7 jours calendaires</strong> à compter de la réception de votre colis par le livreur pour demander un échange ou un retour.
            </div>
          </div>

          {/* Section 2: Conditions d'éligibilité */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                2. Conditions d'acceptation du produit
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border space-y-2 text-xs sm:text-sm" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              <p>Pour être éligible à un retour, l'article doit impérativement respecter les critères suivants :</p>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Être dans son <strong>emballage d'origine intact</strong> avec films et cales de protection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Être à l'état <strong>neuf et non utilisé</strong> (aucun fil coupé, aucune trace de montage ou rayure).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Fourni avec <strong>tous ses accessoires</strong> (vis, notices d'utilisation, adaptateurs).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Présenter le reçu de livraison ou le numéro de commande (ex: <code>CMD-XXXX</code>).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Panne au déballage / Produit défectueux */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                3. Panne au déballage ou erreur de commande
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm leading-relaxed space-y-2" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              <p>
                Si le produit reçu présente un défaut de fonctionnement ou une anomalie à l'ouverture :
              </p>
              <p>
                Signalez-le à notre service client sur WhatsApp sous <strong>48 heures</strong> avec une photo ou vidéo du problème. Nous prenons en charge le remplacement à <strong>100% sans frais supplémentaires</strong>.
              </p>
            </div>
          </div>

          {/* Section 4: Procédure de retour */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-cyan-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                4. Procédure étape par étape
              </h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl dk-surface border" style={{ borderColor: "var(--border)" }}>
                <span className="h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-500 font-bold flex items-center justify-center mb-1.5">1</span>
                <strong className="block mb-0.5" style={{ color: "var(--text)" }}>Contact WhatsApp</strong>
                <p style={{ color: "var(--text-dim)" }}>Envoyez votre numéro de commande et la raison du retour au 0775 30 26 36.</p>
              </div>
              <div className="p-3 rounded-xl dk-surface border" style={{ borderColor: "var(--border)" }}>
                <span className="h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-500 font-bold flex items-center justify-center mb-1.5">2</span>
                <strong className="block mb-0.5" style={{ color: "var(--text)" }}>Expédition retour</strong>
                <p style={{ color: "var(--text-dim)" }}>Le produit est récupéré ou réexpédié via notre transporteur partenaire (58 wilayas).</p>
              </div>
              <div className="p-3 rounded-xl dk-surface border" style={{ borderColor: "var(--border)" }}>
                <span className="h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-500 font-bold flex items-center justify-center mb-1.5">3</span>
                <strong className="block mb-0.5" style={{ color: "var(--text)" }}>Échange / Remboursement</strong>
                <p style={{ color: "var(--text-dim)" }}>Dès réception et test en atelier, votre échange ou remboursement est validé.</p>
              </div>
            </div>
          </div>

          {/* Section 5: Frais de livraison */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                5. Frais d'expédition pour les retours
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm space-y-1.5" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              <p>• <strong>Défaut matériel ou erreur de commande :</strong> Les frais de retour et de réexpédition sont pris en charge à 100% par DomoTek.</p>
              <p>• <strong>Changement d'avis ou convenance personnelle :</strong> Les frais de livraison du retour restent à la charge de l'acheteur.</p>
            </div>
          </div>

          {/* Section 6: Garantie constructeur 12 mois */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                6. Garantie Matériel (12 Mois)
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              Nos équipements bénéficient d'une <strong>garantie de 12 mois</strong> contre tout défaut électronique ou vice caché dans le cadre d'un usage normal.
              <span className="block mt-1 text-[11px] text-slate-400">
                (Sont exclus de la garantie : surtensions électriques externes, court-circuit de câblage sans neutre mal raccordé, casse physique ou immersion liquide).
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="p-4 sm:p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <a
            href="https://wa.me/213775302636?text=Bonjour,%20je%20souhaite%20avoir%20des%20informations%20sur%20un%20retour%20ou%20la%20garantie"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
          >
            <Phone className="h-4 w-4 text-emerald-400" />
            <span>Assistance WhatsApp : 0775 30 26 36</span>
          </a>

          <button
            onClick={() => s.setReturnPolicyOpen(false)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold dk-btn-primary"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
