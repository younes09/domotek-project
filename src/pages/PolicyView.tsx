import React from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Truck,
  Phone,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Package,
  CreditCard,
  Lock,
  Headphones,
} from "lucide-react";
import type { Store } from "../types";
import { buildWhatsAppUrl } from "../lib/socialSettings";

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
            Politique de commande & Livraison
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
            <span>Transparence, Rapidité & Service Client</span>
          </div>

          <h1 className="dk-heading text-2xl sm:text-4xl font-extrabold leading-tight mb-3" style={{ color: "var(--text)" }}>
            Conditions de Commande, Livraison & Paiement
          </h1>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Chez <strong>DomoTek Algérie</strong>, nous nous engageons à vous offrir une expérience d'achat simple, transparente et sécurisée. Découvrez nos modalités de commande, d'expédition sur les <strong>58 Wilayas</strong> et de paiement à la livraison.
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
          <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center mb-2">
            <Truck className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-black dk-heading" style={{ color: "var(--text)" }}>58 Wilayas</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>Livraison à domicile & relais</span>
        </div>

        <div className="p-4 rounded-2xl dk-surface border text-center flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center mb-2">
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-black dk-heading" style={{ color: "var(--text)" }}>24h - 48h</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>Délai d'expédition moyen</span>
        </div>

        <div className="p-4 rounded-2xl dk-surface border text-center flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-2">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-black dk-heading" style={{ color: "var(--text)" }}>Paiement</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>À la livraison (Main à main)</span>
        </div>

        <div className="p-4 rounded-2xl dk-surface border text-center flex flex-col items-center justify-center" style={{ borderColor: "var(--border)" }}>
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-2">
            <Headphones className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-black dk-heading" style={{ color: "var(--text)" }}>Assistance</span>
          <span className="text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>Conseils & Guide WhatsApp</span>
        </div>
      </div>

      {/* Main Detailed Content Sections */}
      <div className="space-y-6">
        {/* Section 1: Processus de commande */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0">
              <Package className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              1. Passation et Confirmation de Commande
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Commander sur DomoTek est simple et direct. Aucun compte obligatoire n'est requis :
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl dk-surface-2 border flex items-start gap-2.5 text-xs sm:text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <span className="text-cyan-500 font-bold shrink-0">✓</span>
              <span><strong>Formulaire Express :</strong> Renseignez simplement votre nom, numéro de téléphone et Wilaya de destination.</span>
            </div>
            <div className="p-3 rounded-xl dk-surface-2 border flex items-start gap-2.5 text-xs sm:text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              <span className="text-cyan-500 font-bold shrink-0">✓</span>
              <span><strong>Confirmation préalable :</strong> Notre équipe vous contacte par téléphone ou WhatsApp pour valider les détails avant expédition.</span>
            </div>
          </div>
        </section>

        {/* Section 2: Expédition et Délais */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0">
              <Truck className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              2. Délais & Modalités de Livraison (58 Wilayas)
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Nous collaborons avec les leaders du transport express en Algérie pour assurer un acheminement sécurisé et rapide :
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm space-y-1" style={{ borderColor: "var(--border)" }}>
              <strong className="text-cyan-500 block">Wilayas du Nord & Centre :</strong>
              <p style={{ color: "var(--text-dim)" }}>Livraison à domicile ou en point stop-desk en <strong>24h à 48h</strong>.</p>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm space-y-1" style={{ borderColor: "var(--border)" }}>
              <strong className="text-purple-500 block">Hauts-Plateaux & Grand Sud :</strong>
              <p style={{ color: "var(--text-dim)" }}>Livraison sous <strong>48h à 72h</strong> selon la localité et l'accessibilité.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Modalités de Paiement */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              3. Modalités de Paiement (Paiement à la Livraison)
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Pour garantir votre totale tranquillité d'esprit, le règlement s'effectue <strong>en espèces (Dinars Algériens DZD) directement auprès du livreur</strong> lors de la remise de votre colis en main propre. Aucun paiement anticipé par carte n'est exigé.
          </p>
        </section>

        {/* Section 4: Réception et Vérification du Colis */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              4. Réception & Vérification du Colis
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Lors de la livraison, nous vous invitons à vérifier le bon état extérieur du colis et la conformité du bon de livraison avant de régler le montant de la commande à l'agent livreur.
          </p>
        </section>

        {/* Section 5: Confidentialité et Données */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0">
              <Lock className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              5. Confidentialité & Protection des Données
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Les informations recueillies lors de votre commande (nom, téléphone, adresse) sont strictement confidentielles. Elles ne sont ni partagées ni commercialisées, et servent uniquement au traitement et à l'acheminement de vos colis.
          </p>
        </section>

        {/* Section 6: Support et Guide d'Installation */}
        <section className="p-5 sm:p-6 rounded-2xl dk-surface border shadow-sm space-y-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <Headphones className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text)" }}>
              6. Assistance & Conseils Techniques
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Vous avez besoin d'aide pour choisir le bon module ou configurer l'application Tuya / Smart Life ? Notre service client est joignable sur WhatsApp au <strong>{s.socialSettings.whatsapp || "0775 30 26 36"}</strong> pour vous guider pas-à-pas.
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
            Une question sur votre commande ou la livraison ?
          </h2>
          <p className="text-xs sm:text-sm mt-1 max-w-md mx-auto" style={{ color: "var(--text-dim)" }}>
            Notre équipe est disponible du Samedi au Jeudi de 09h00 à 18h00 pour répondre à toutes vos questions.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {s.socialSettings?.whatsappEnabled && (
            <a
              href={buildWhatsAppUrl(s.socialSettings, "Bonjour DomoTek, j'ai une question sur la livraison ou une commande.")}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-emerald-500/40 text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>Contacter sur WhatsApp ({s.socialSettings.whatsapp || "0775 30 26 36"})</span>
            </a>
          )}

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
