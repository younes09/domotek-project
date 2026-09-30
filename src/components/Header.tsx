import React from "react";
import { Search, ShoppingCart, Menu, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { LampToggle } from "./LampToggle";
import type { Store } from "../types";

export const Header: React.FC<{ s: Store }> = ({ s }) => {
  const navItems = [
    { label: "Boutique", action: () => s.goShop({}) },
    { label: "Éclairage", action: () => s.goShop({ category: "interrupteurs" }) },
    { label: "Confort", action: () => s.goShop({ category: "prises" }) },
  ];

  const isDark = s.theme === "dark";

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--header-border)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* Top info announcement bar */}
      <div
        className="py-1.5 px-4 text-xs font-medium text-center"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--teal-dim)",
          color: "var(--text-dim)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <span className="hidden sm:inline-block font-bold" style={{ color: "var(--teal)" }}>
            ⚡ DomoTek — La maison connectée, simplement
          </span>
          <span className="mx-auto sm:mx-0">🚚 Livraison 58 Wilayas | Paiement à la livraison</span>
          <a
            href="https://wa.me/213775302636"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 hover:underline font-bold"
            style={{ color: "var(--teal)" }}
          >
            <Phone className="h-3 w-3" /> WhatsApp: 0775 30 26 36
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo onClick={() => s.goHome()} className="h-12 sm:h-14 md:h-16" theme={s.theme} />
            <nav className="hidden lg:flex items-center gap-5">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="text-sm font-semibold transition-colors py-1"
                  style={{ color: "var(--text-dim)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--teal)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
                >
                  {item.label}
                </button>
              ))}

              {/* ✨ Distinctive Highlighted Policy & Delivery Button */}
              <button
                onClick={() => s.setView("policy")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border dk-focus shadow-sm ${
                  s.view === "policy"
                    ? "bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20 scale-105"
                    : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 hover:border-cyan-500/50 hover:scale-[1.02]"
                }`}
                title="Consulter notre politique de commande, livraison 58 wilayas et paiement"
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Politique & Livraison</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </nav>
          </div>

          <div className="hidden md:flex flex-1 max-w-xs">
            <button
              onClick={() => s.setSearchOpen(true)}
              className="dk-input w-full rounded-xl px-3.5 py-2 flex items-center gap-2.5 text-left dk-focus"
              style={{ transition: "border-color 0.2s" }}
            >
              <Search className="h-4 w-4" style={{ color: "var(--teal)" }} />
              <span className="text-xs sm:text-sm" style={{ color: "var(--text-faint)" }}>
                Rechercher un produit...
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => s.setSearchOpen(true)}
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl dk-surface dk-focus"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" style={{ color: "var(--text-dim)" }} />
            </button>

            <a
              href="https://wa.me/213775302636"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex h-10 px-3.5 items-center gap-2 rounded-xl text-xs font-bold"
              style={{
                border: "1px solid rgba(37,211,102,0.4)",
                background: "rgba(37,211,102,0.1)",
                color: "#25d366",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              WhatsApp
            </a>

            {/* 🔆 Creative Lamp Theme Toggle */}
            <div className="relative flex items-center justify-center" title={isDark ? "Passer au thème clair" : "Passer au thème sombre"}>
              <LampToggle isDark={isDark} onToggle={s.toggleTheme} />
            </div>

            {/* 🛒 Cart Button with Attention Grabber */}
            <div className="relative">
              {s.cartPulsing && (
                <>
                  <span className="absolute -inset-1 rounded-2xl bg-cyan-400/50 animate-ping pointer-events-none" />
                  <span className="absolute -inset-1.5 rounded-2xl border-2 border-cyan-400/60 animate-pulse pointer-events-none" />
                </>
              )}

              <button
                onClick={() => {
                  s.setCartOpen(true);
                  s.setCartPulsing(false);
                  s.setFirstItemNotice(null);
                }}
                className={`relative h-10 w-10 flex items-center justify-center rounded-xl dk-surface dk-focus transition-all duration-300 ${
                  s.cartPulsing
                    ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/40 scale-105"
                    : ""
                }`}
                aria-label="Panier"
                title={s.cartPulsing ? "Cliquez pour consulter votre panier" : "Panier"}
              >
                <ShoppingCart
                  className={`h-5 w-5 transition-all duration-300 ${
                    s.cartPulsing ? "text-cyan-500 scale-110 animate-bounce" : ""
                  }`}
                  style={{ color: s.cartPulsing ? "var(--teal)" : "var(--text-dim)" }}
                />
                {s.cartCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center shadow-lg transition-transform ${
                      s.cartPulsing ? "scale-110 ring-2 ring-white dark:ring-slate-900 animate-pulse" : ""
                    }`}
                    style={{ background: "var(--teal)", color: "white" }}
                  >
                    {s.cartCount}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => s.setMobileMenuOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl dk-surface dk-focus"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" style={{ color: "var(--text-dim)" }} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
