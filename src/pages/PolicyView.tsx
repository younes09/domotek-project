import React from "react";
import {
  RotateCcw,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Phone,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  HelpCircle,
  Package,
} from "lucide-react";
import type { Store } from "../types";

export const PolicyView: React.FC<{ s: Store }> = ({ s }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <button
            onClick={() => s.goHome()}
            className="hover:text-cyan-400 transition-colors dk-focus rounded"
          >
            Accueil
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span style={{ color: "var(--text)" }} className="font-semibold">
            Politique de retour & Garantie
          </span>
        </div>

        <button
          onClick={() => s.goBack()}
          className="h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold dk-surface border dk-focus hover:opacity-80 transition-all"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" style={{ color: "var(--teal)" }} />
          <span>Retour</span>
        </button>
      </div>

      {/* Hero Banner Header */}
      <div
        className="rounded-3xl p-6 sm:p-8 border shadow-lg relative overflow-hidden mb-8"
        style={{
          background: "linear-gradient(135deg, var(--surface), var(--surface-2))",
          borderColor: "var(--border)",
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Engagement Qualité & Confiance 100%</span>
          </div>

          <h1 className="dk-heading text-2xl sm:text-4xl font-extrabold leading-tight mb-3" style={{ color: "var(--text)" }}>
            Politique de Retour, d'Échange & Garantie
          </h1>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Chez <strong>DomoTek Algérie</strong>, votre satisfaction est notre priorité. Tous nos équipements de domotique sont certifiés et accompagnés d'une garantie constructeur de <strong>12 mois</strong> et d'un droit de retour sous <strong>7 jours</strong>.
          </p>
        </div>

        {/* Decorative background glow */}
        <div
          className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: "var(--teal)" }}
        />
      </div>

      {/* Quick Summary 4-Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="p-4 rounded-2xl dk-surface border text-center flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center mb-2">
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-black dk-heading" style={{ color: "var(--text)" }}>7 Jours</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>Droit de retour & échange</span>
        </div>

        <div className="p-4 rounded-2xl dk-surface border text-center flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-2">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-black dk-heading" style={{ color: "var(--text)" }}>12 Mois</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>Garantie constructeur</span>
        </div>

        <div className="p-4 rounded-2xl dk-surface border text-center flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center mb-2">
            <Truck className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-black dk-heading" style={{ color: "var(--text)" }}>58 Wilayas</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>Expédition & SAV rapide</span>
        </div>

        <div className="p-4 rounded-2xl dk-surface border text-center flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-2">
            <RotateCcw className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-black dk-heading" style={{ color: "var(--text)" }}>100% Pris</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>En cas de défaut initial</span>
        </div>
      </div>

      {/* Main Detailed Content Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              1. Délai de rétractation et de retour
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Conformément aux normes du commerce en ligne et à notre charte de satisfaction, vous disposez d'un délai de <strong>7 jours calendaires</strong> (à compter de la date de livraison de votre colis par le transporteur) pour demander un échange ou un retour de votre équipement.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              2. Conditions d'acceptation du retour
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Pour qu'un retour ou un échange soit validé, l'article doit impérativement respecter les conditions suivantes :
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl dk-surface-2 border flex items-start gap-2.5 text-xs sm:text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Emballage d'origine intact :</strong> La boîte, les films protecteurs et les cales doivent être conservés.</span>
            </div>
            <div className="p-3 rounded-xl dk-surface-2 border flex items-start gap-2.5 text-xs sm:text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>État neuf et non utilisé :</strong> Aucun fil sectionné, aucune rayure ou trace de manipulation.</span>
            </div>
            <div className="p-3 rounded-xl dk-surface-2 border flex items-start gap-2.5 text-xs sm:text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Accessoires complets :</strong> Visserie, condensateurs, manuels d'utilisation et câbles inclus.</span>
            </div>
            <div className="p-3 rounded-xl dk-surface-2 border flex items-start gap-2.5 text-xs sm:text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Justificatif d'achat :</strong> Votre numéro de commande (ex: <code>CMD-100X</code>) ou bordereau de livraison.</span>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              3. Panne au déballage & Erreur de commande (Zéro tracas)
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Si un produit reçu présente une anomalie de fonctionnement dès son ouverture ou ne correspond pas au modèle commandé :
          </p>
          <div className="p-4 rounded-xl border bg-amber-500/10 text-xs sm:text-sm leading-relaxed" style={{ borderColor: "rgba(245, 158, 11, 0.3)", color: "var(--text)" }}>
            Contactez notre assistance client dans les <strong>48 heures</strong> suivant la livraison sur WhatsApp au <strong>0775 30 26 36</strong> avec une photo/vidéo. <strong>DomoTek prend en charge 100% des frais de réexpédition et procède à un remplacement immédiat</strong>.
          </div>
        </section>

        {/* Section 4 */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-4" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0">
              <RotateCcw className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              4. Procédure de retour pas à pas
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
              <span className="h-7 w-7 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center mb-2">
                Étape 1
              </span>
              <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Contactez le support</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
                Écrivez à notre équipe sur WhatsApp avec votre numéro de commande et la raison du retour.
              </p>
            </div>

            <div className="p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
              <span className="h-7 w-7 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center mb-2">
                Étape 2
              </span>
              <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Réexpédition</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
                Le colis est remis à notre transporteur partenaire (Anderson Logistics / Réseau 58 wilayas).
              </p>
            </div>

            <div className="p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
              <span className="h-7 w-7 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center mb-2">
                Étape 3
              </span>
              <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>Échange ou Remboursement</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
                Dès vérification dans nos ateliers, votre nouvel article vous est expédié ou votre remboursement effectué.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0">
              <Truck className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              5. Frais de livraison
            </h2>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold shrink-0">•</span>
              <span><strong>En cas de défaut technique ou d'erreur de préparation :</strong> Les frais de retour et de réexpédition sont intégralement pris en charge par DomoTek.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold shrink-0">•</span>
              <span><strong>En cas de convenance personnelle (changement d'avis) :</strong> Les frais de retour du transporteur restent à la charge du client.</span>
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              6. Garantie Matériel (12 Mois)
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Tous nos modules, interrupteurs, prises connectées et caméras bénéficient d'une <strong>garantie de 12 mois</strong> couvrant tout vice de fabrication ou dysfonctionnement électronique dans des conditions normales d'installation.
          </p>
          <p className="text-xs text-slate-400 italic">
            * Sont exclus de la garantie : les surtensions électriques externes causées par la foudre, les inversions de câblage Phase/Neutre non conformes, les chocs physiques ou l'immersion sous l'eau.
          </p>
        </section>
      </div>

      {/* Support & Contact Action Banner */}
      <div
        className="mt-8 p-6 sm:p-8 rounded-3xl border text-center flex flex-col items-center justify-center gap-4"
        style={{
          background: "var(--teal-dim)",
          borderColor: "rgba(0, 180, 255, 0.3)",
        }}
      >
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <Phone className="h-6 w-6" />
        </div>

        <div>
          <h2 className="dk-heading text-lg sm:text-xl font-bold" style={{ color: "var(--text)" }}>
            Une question sur un retour ou la garantie ?
          </h2>
          <p className="text-xs sm:text-sm mt-1 max-w-md mx-auto" style={{ color: "var(--text-dim)" }}>
            Notre équipe technique est disponible du Samedi au Jeudi de 09h00 à 18h00 pour vous accompagner.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://wa.me/213775302636?text=Bonjour%20DomoTek,%20je%20souhaite%20des%20renseignements%20sur%20un%20retour%20ou%20la%20garantie"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-emerald-500/40 text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
          >
            <Phone className="h-4 w-4" />
            <span>Contacter sur WhatsApp (0775 30 26 36)</span>
          </a>

          <button
            onClick={() => s.goShop({})}
            className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold dk-btn-secondary flex items-center gap-2 transition-all"
          >
            <ShoppingBag className="h-4 w-4 text-cyan-500" />
            <span>Découvrir la boutique</span>
          </button>
        </div>
      </div>
    </div>
  );
};
