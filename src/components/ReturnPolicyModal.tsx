import React, { useEffect } from "react";
import {
  X,
  Truck,
  Clock,
  CheckCircle2,
  Phone,
  CreditCard,
  Lock,
  Headphones,
  Package,
} from "lucide-react";
import type { Store } from "../types";
import { buildWhatsAppUrl } from "../lib/socialSettings";

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
              <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="dk-heading text-lg sm:text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                Politique de Commande & Livraison
              </h2>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>
                DomoTek Algérie — Modalités de commande, expédition & paiement
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
            <Truck className="h-6 w-6 text-cyan-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              <p className="font-bold">Livraison 58 Wilayas & Paiement à la réception</p>
              <p className="mt-1" style={{ color: "var(--text-dim)" }}>
                Commandez facilement sans carte bancaire : vous réglez vos achats en espèces directement auprès du livreur à la réception de votre colis.
              </p>
            </div>
          </div>

          {/* Section 1: Validation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-cyan-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                1. Passation et Confirmation de commande
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              Une fois votre panier validé, notre équipe prend contact avec vous par téléphone ou WhatsApp pour confirmer l'adresse de livraison et préparer votre colis dans les meilleurs délais.
            </div>
          </div>

          {/* Section 2: Délais de livraison */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                2. Délais d'expédition (58 Wilayas)
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border space-y-2 text-xs sm:text-sm" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold shrink-0">•</span>
                  <span><strong>Wilayas du Nord :</strong> Expédition sous 24h à 48h à domicile ou en point relais.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold shrink-0">•</span>
                  <span><strong>Wilayas du Sud :</strong> Acheminement sous 48h à 72h selon la région.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Modalités de paiement */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                3. Paiement en espèces (Cash on Delivery)
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              Le paiement s'effectue intégralement en Dinars Algériens (DZD) à la remise en main propre par le coursier.
            </div>
          </div>

          {/* Section 4: Confidentialité */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                4. Protection des coordonnées clients
              </h3>
            </div>
            <div className="p-3.5 rounded-xl dk-surface-2 border text-xs sm:text-sm leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
              Vos informations personnelles (numéro de téléphone, adresse) sont strictement réservées au traitement logistique de vos commandes et ne sont jamais transmises à des tiers.
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="p-4 sm:p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {s.socialSettings?.whatsappEnabled && (
            <a
              href={buildWhatsAppUrl(s.socialSettings, "Bonjour, j'ai une question sur ma commande ou la livraison")}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
            >
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>Assistance WhatsApp : {s.socialSettings.whatsapp || "0775 30 26 36"}</span>
            </a>
          )}

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
