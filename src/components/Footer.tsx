import React from "react";
import { Facebook, Instagram, Settings, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { TikTokIcon } from "./ui";
import type { Store } from "../types";

export const Footer: React.FC<{ s: Store }> = ({ s }) => (
  <footer className="border-t mt-12" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <Logo onClick={() => s.goHome()} className="h-11 sm:h-13" theme={s.theme} />
        <p className="text-xs sm:text-sm mt-3.5 leading-relaxed" style={{ color: "var(--text-dim)" }}>
          DomoTek — <strong className="text-cyan-400 font-semibold">La maison connectée, simplement.</strong><br />
          Contrôlez, automatisez et sécurisez votre maison avec nos interrupteurs, prises et capteurs intelligents.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <a href="#" className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface transition-colors hover:border-cyan-500/50 hover:text-cyan-400 dk-focus" aria-label="Facebook">
            <Facebook className="h-4 w-4" style={{ color: "var(--text)" }} />
          </a>
          <a href="#" className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface transition-colors hover:border-cyan-500/50 hover:text-cyan-400 dk-focus" aria-label="Instagram">
            <Instagram className="h-4 w-4" style={{ color: "var(--text)" }} />
          </a>
          <a href="#" className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface transition-colors hover:border-cyan-500/50 hover:text-cyan-400 dk-focus" aria-label="TikTok">
            <TikTokIcon style={{ color: "var(--text)" }} />
          </a>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3.5" style={{ color: "var(--text)" }}>Navigation</p>
        <div className="space-y-2.5">
          <button onClick={() => s.goHome()} className="block text-xs sm:text-sm hover:text-cyan-400 transition-colors dk-focus rounded" style={{ color: "var(--text-dim)" }}>Accueil</button>
          <button onClick={() => s.goShop({})} className="block text-xs sm:text-sm hover:text-cyan-400 transition-colors dk-focus rounded" style={{ color: "var(--text-dim)" }}>Tous les produits</button>
          <button onClick={() => s.goShop({ category: "interrupteurs" })} className="block text-xs sm:text-sm hover:text-cyan-400 transition-colors dk-focus rounded" style={{ color: "var(--text-dim)" }}>Interrupteurs Wi-Fi</button>
          <button onClick={() => s.goShop({ category: "prises" })} className="block text-xs sm:text-sm hover:text-cyan-400 transition-colors dk-focus rounded" style={{ color: "var(--text-dim)" }}>Prises Intelligentes</button>
          <button onClick={() => s.goShop({ special: "new" })} className="block text-xs sm:text-sm hover:text-cyan-400 transition-colors dk-focus rounded" style={{ color: "var(--text-dim)" }}>Nouveautés</button>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3.5" style={{ color: "var(--text)" }}>Commandes & Support</p>
        <div className="space-y-2.5 text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
          <p className="flex items-center gap-1.5"><strong style={{ color: "var(--text)" }}>Wilayas :</strong> 58 Wilayas en Algérie</p>
          <p className="flex items-center gap-1.5"><strong style={{ color: "var(--text)" }}>Paiement :</strong> À la livraison (Main à main)</p>
          <p className="flex items-center gap-1.5"><strong style={{ color: "var(--text)" }}>Garantie :</strong> Produits vérifiés</p>
          <a
            href="https://wa.me/213775302636"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 font-medium transition-colors"
          >
            <Phone className="h-3.5 w-3.5" /> 0775 30 26 36
          </a>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3.5" style={{ color: "var(--text)" }}>DomoTek Algérie</p>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
          Une technologie moderne conçue pour simplifier le contrôle de votre maison à distance depuis votre smartphone.
        </p>
        <button onClick={() => s.setView("admin")} className="mt-4 text-xs flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors dk-focus rounded" aria-label="Espace admin">
          <Settings className="h-3.5 w-3.5" /> Espace Administrateur
        </button>
      </div>
    </div>
    <div className="border-t py-5 text-center text-xs flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto px-4 sm:px-6 gap-2" style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}>
      <span>© 2026 DomoTek — Tous droits réservés.</span>
      <span>Conçu pour la maison connectée en Algérie 🇩🇿</span>
    </div>
  </footer>
);

