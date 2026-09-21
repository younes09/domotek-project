import React, { useState } from "react";
import {
  ChevronRight,
  Sparkles,
  Heart,
  Leaf,
  ShieldCheck,
  Settings,
  LayoutGrid,
  Lightbulb,
  Plug,
  Zap,
  Phone,
  ArrowRight,
  MessageCircle,
  Star,
  CheckCircle2,
  Tv,
  Moon,
  Sun,
  Lock,
  Wifi,
  Smartphone,
  Check,
  ToggleLeft,
} from "lucide-react";
import { TrustBadges } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import type { Store } from "../types";

export const HomeView: React.FC<{ s: Store }> = ({ s }) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Interactive Live Switch Simulator state
  const [lightState, setLightState] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<"cinema" | "night" | "leave" | "morning">("cinema");

  // Filter products based on selected tab
  const filteredProducts = s.products.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "eclairage") return p.category === "interrupteurs" || p.category === "smart-home";
    if (activeTab === "prises") return p.category === "prises";
    if (activeTab === "volets") return p.slug.includes("volet") || p.category === "interrupteurs";
    if (activeTab === "securite") return p.category === "capteurs";
    return true;
  });

  const categoryTabs = [
    { id: "all", label: "Tous les produits", count: s.products.length, Icon: LayoutGrid },
    { id: "eclairage", label: "Éclairage", count: s.products.filter((p) => p.category === "interrupteurs" || p.category === "smart-home").length, Icon: Lightbulb },
    { id: "prises", label: "Prises", count: s.products.filter((p) => p.category === "prises").length, Icon: Plug },
    { id: "volets", label: "Volets", count: s.products.filter((p) => p.slug.includes("volet")).length, Icon: Zap },
    { id: "securite", label: "Sécurité", count: s.products.filter((p) => p.category === "capteurs").length, Icon: ShieldCheck },
  ];

  const scenarios = {
    cinema: {
      title: "Mode Soirée Cinéma",
      subtitle: "Ambiance tamisée et immersion totale d'un seul geste",
      Icon: Tv,
      devices: [
        { name: "Plafonnier Salon", state: "Éteint (0%)", active: false },
        { name: "Ruban LED d'ambiance", state: "Bleu nuit (25%)", active: true },
        { name: "Volets roulants", state: "Fermés à 100%", active: true },
        { name: "Prise Home Cinéma", state: "Allumée (Active)", active: true },
      ],
      whatsappMsg: "Bonjour DomoTek, je souhaite créer un scénario Cinéma pour mon salon.",
    },
    night: {
      title: "Mode Bonne Nuit",
      subtitle: "Extinction générale et sécurité maximale quand vous dormez",
      Icon: Moon,
      devices: [
        { name: "Toutes les lumières", state: "Éteintes d'un clic", active: false },
        { name: "Capteurs de portes", state: "Armés en surveillance", active: true },
        { name: "Veilleuse couloir", state: "Allumée (10%)", active: true },
        { name: "Appareils en veille", state: "Coupés (0 watt)", active: false },
      ],
      whatsappMsg: "Bonjour DomoTek, je veux sécuriser et automatiser ma maison la nuit.",
    },
    leave: {
      title: "Mode Départ Maison",
      subtitle: "Zéro doute en partant : tout est sous contrôle à distance",
      Icon: Lock,
      devices: [
        { name: "Prises non-essentielles", state: "Coupées automatiquement", active: false },
        { name: "Détecteurs mouvement", state: "Alertes activées sur mobile", active: true },
        { name: "Simulation de présence", state: "Allumage aléatoire programmé", active: true },
        { name: "Climatisation / Chauffage", state: "Mode Éco activé", active: true },
      ],
      whatsappMsg: "Bonjour DomoTek, comment programmer l'extinction automatique quand je quitte mon domicile ?",
    },
    morning: {
      title: "Mode Réveil Douceur",
      subtitle: "Commencez la journée avec une maison prête dès le lever",
      Icon: Sun,
      devices: [
        { name: "Volets motorisés", state: "Ouverture graduelle à 7h30", active: true },
        { name: "Lumières chaudes", state: "Allumage progressif", active: true },
        { name: "Prise Chauffe-eau/Café", state: "Prêt au réveil", active: true },
        { name: "Notification météo", state: "Envoyée sur smartphone", active: true },
      ],
      whatsappMsg: "Bonjour DomoTek, quels modules me conseillez-vous pour automatiser mes volets et prises au réveil ?",
    },
  };

  const reviews = [
    {
      name: "Karim M.",
      wilaya: "Alger (Hydra)",
      rating: 5,
      date: "Il y a 3 jours",
      comment: "Super satisfait ! J'ai installé les modules switch 2CH derrière mes interrupteurs existants en 15 minutes. Contrôle fluide depuis l'application Tuya et par la voix avec Google Home.",
    },
    {
      name: "Samir B.",
      wilaya: "Oran (Akid Lotfi)",
      rating: 5,
      date: "Il y a 1 semaine",
      comment: "Livraison rapide en 48h avec paiement à la livraison. Le support sur WhatsApp m'a guidé pas à pas pour le branchement avec le fil neutre. Service impeccable !",
    },
    {
      name: "Amine T.",
      wilaya: "Constantine",
      rating: 5,
      date: "Il y a 2 semaines",
      comment: "Les modules volets roulants ont transformé ma maison. Maintenant mes volets se ferment automatiquement le soir. Produits de très bonne facture, fiables.",
    },
  ];

  // Hero Hardware Showcase state
  const [activeDevice, setActiveDevice] = useState<"switch" | "plug" | "shutter" | "sensor">("switch");
  const [ambienceMode, setAmbienceMode] = useState<"day" | "sunset" | "night">("night");
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const devices = {
    switch: {
      name: "Interrupteur Tactile WiFi",
      price: "1 800 DA",
      specs: "Sans fil neutre nécessaire • Toucher en verre trempé",
      badge: "Best Seller Éclairage",
      Icon: ToggleLeft,
    },
    plug: {
      name: "Prise Intelligente WiFi 20A",
      price: "2 200 DA",
      specs: "Mesure de consommation d'énergie • Protection 20 Ampères",
      badge: "Haute Puissance",
      Icon: Plug,
    },
    shutter: {
      name: "Module Volet Roulant WiFi",
      price: "2 800 DA",
      specs: "Réglage d'ouverture au % • Compatible moteurs standards",
      badge: "Confort Absolu",
      Icon: Zap,
    },
    sensor: {
      name: "Capteur Sécurité & Mouvement PIR",
      price: "2 200 DA",
      specs: "Alerte intrusion mobile • Autonomie batterie 2 ans",
      badge: "Sécurité 24/7",
      Icon: ShieldCheck,
    },
  };

  const hotspots = [
    {
      id: 1,
      top: "28%",
      left: "22%",
      title: "Contrôle Vocal & Mobile",
      desc: "Pilotez par la voix avec Google Home & Alexa ou via l'application Tuya / Smart Life.",
    },
    {
      id: 2,
      top: "45%",
      left: "65%",
      title: "Installation Rapide (5 min)",
      desc: "Se branche simplement à la place de vos équipements existants sans gros travaux.",
    },
    {
      id: 3,
      top: "72%",
      left: "38%",
      title: "Économie & Automatisation",
      desc: "Programmez des minuteurs pour réduire automatiquement votre facture d'électricité.",
    },
  ];

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      {/* 1. HERO SECTION - FULL COVER BACKGROUND IMAGE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#111827] shadow-[0_0_60px_rgba(0,180,255,0.12)] min-h-[520px] sm:min-h-[560px] flex flex-col justify-between">
          {/* Background Image Full Cover */}
          <img
            src="/images/hero-bg.png"
            alt="DomoTek — La maison connectée, simplement"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center pointer-events-none transition-transform duration-700 hover:scale-105"
          />

          {/* Dark gradient mask tuned for text contrast on left and device clarity on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/90 sm:via-[#111827]/70 to-[#111827]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/60 pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 md:p-12 space-y-8">
            {/* Top status bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-cyan-500/40 bg-cyan-950/70 text-cyan-300 backdrop-blur-md shadow-lg">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Smart Home & Électronique Connectée en Algérie 🇩🇿</span>
              </div>

              {/* Price Pill Badge */}
              <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-white rounded-2xl px-4 py-1.5 shadow-xl flex items-center gap-2">
                <span className="text-xs text-slate-300">À partir de</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">1 800 DA</span>
              </div>
            </div>

            {/* Headline & Subtitle */}
            <div className="max-w-2xl space-y-5">
              <h1 className="dk-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-md">
                Votre maison <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 drop-shadow-[0_0_35px_rgba(0,180,255,0.4)]">
                  devient connectée.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-xl drop-shadow">
                Des solutions intelligentes, simples et fiables pour moderniser votre quotidien. Contrôlez l'éclairage, vos volets et prises depuis votre smartphone ou par la voix.
              </p>

              {/* Primary Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => s.goShop({})}
                  className="group relative overflow-hidden bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(0,180,255,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                  <span>Découvrir les produits</span>
                  <ChevronRight className="h-5 w-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="https://wa.me/213775302636?text=Bonjour%20DomoTek,%20j'aimerais%20avoir%20des%20informations%20sur%20vos%20solutions%20maison%20connectée."
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-4 rounded-xl text-sm font-bold border border-emerald-500/40 bg-emerald-950/60 backdrop-blur-md text-emerald-300 hover:bg-emerald-900/70 hover:border-emerald-500/60 transition-all flex items-center gap-2.5 shadow-lg"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Conseil WhatsApp : <strong>0775 30 26 36</strong></span>
                </a>
              </div>

              {/* Social Proof Stats Under Hero CTA */}
              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-white font-bold text-sm">4.9/5</span>
                  <span className="text-slate-300">(+1 200 foyers équipés)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Livraison 58 Wilayas & Paiement main à main</span>
                </div>
              </div>
            </div>

            {/* Feature Bar (4 item pills under Hero content) */}
            <div className="pt-8 border-t border-slate-700/60 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="glass-card-hover rounded-2xl p-3.5 flex items-center gap-3.5 border border-slate-700/60 bg-slate-950/50 backdrop-blur-md">
                <div className="h-11 w-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Plus de confort</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">Contrôlez sans vous lever</p>
                </div>
              </div>

              <div className="glass-card-hover rounded-2xl p-3.5 flex items-center gap-3.5 border border-slate-700/60 bg-slate-950/50 backdrop-blur-md">
                <div className="h-11 w-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Leaf className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Maison plus économe</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">Jusqu'à -30% sur l'énergie</p>
                </div>
              </div>

              <div className="glass-card-hover rounded-2xl p-3.5 flex items-center gap-3.5 border border-slate-700/60 bg-slate-950/50 backdrop-blur-md">
                <div className="h-11 w-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Contrôle & Sécurité</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">Alertes instantanées</p>
                </div>
              </div>

              <div className="glass-card-hover rounded-2xl p-3.5 flex items-center gap-3.5 border border-slate-700/60 bg-slate-950/50 backdrop-blur-md">
                <div className="h-11 w-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Settings className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Installation facile</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">Sans casser les murs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTER TABS BAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(0,180,255,0.35)] scale-105"
                    : "dk-surface-2 hover:border-cyan-500/50"
                }`}
                style={!isActive ? { color: "var(--text-dim)" } : {}}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-slate-950" : "text-cyan-500"}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isActive ? "bg-slate-950/25 text-slate-950" : "dk-surface"}`} style={!isActive ? { color: "var(--text-faint)" } : {}}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN PRODUCTS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold dk-chip-teal">
            <Sparkles className="h-3 w-3" /> Catalogue Disponible Immédiatement
          </div>
          <h2 className="dk-heading text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
            Nos solutions pour votre maison
          </h2>
          <p className="text-xs sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Des équipements domotiques fiables et rapides à installer pour rendre chaque pièce plus intelligente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} s={s} />
          ))}
        </div>

        {filteredProducts.length > 6 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => s.goShop({})}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-cyan-500/40 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/10 font-bold text-sm transition-all shadow-lg hover:border-cyan-400"
            >
              Voir tout le catalogue ({filteredProducts.length} produits) <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* 4. INTERACTIVE SMART HOME EXPERIENCE - SCENARIOS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl dk-surface p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-cyan-500 dark:text-cyan-400 tracking-wider uppercase">Expérience Interactive</span>
              <h3 className="dk-heading text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--text)" }}>
                Vivez la maison connectée en action
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
                Cliquez sur un scénario pour voir comment DomoTek orchestre automatiquement vos appareils au quotidien.
              </p>
            </div>

            {/* Scenario selector tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map((key) => {
                const sc = scenarios[key];
                const isCurrent = activeScenario === key;
                const ScIcon = sc.Icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveScenario(key)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                      isCurrent
                        ? "bg-cyan-500/15 border-cyan-500 text-cyan-700 dark:text-white shadow-[0_0_20px_rgba(0,180,255,0.25)]"
                        : "dk-surface-2 hover:border-cyan-500/40"
                    }`}
                    style={!isCurrent ? { color: "var(--text-dim)" } : {}}
                  >
                    <ScIcon className={`h-6 w-6 ${isCurrent ? "text-cyan-500 dark:text-cyan-400" : "text-slate-400"}`} />
                    <span className="text-xs sm:text-sm font-bold">{sc.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Scenario Live Dashboard Preview */}
            <div className="p-6 rounded-2xl border dk-surface-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
                <div>
                  <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                    <span>{scenarios[activeScenario].title}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>
                    {scenarios[activeScenario].subtitle}
                  </p>
                </div>
                <a
                  href={`https://wa.me/213775302636?text=${encodeURIComponent(scenarios[activeScenario].whatsappMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0"
                >
                  <Phone className="h-3.5 w-3.5 fill-slate-950" />
                  <span>Demander ce pack sur WhatsApp</span>
                </a>
              </div>

              {/* Devices simulated grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {scenarios[activeScenario].devices.map((d, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl dk-surface flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{d.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-dim)" }}>{d.state}</p>
                    </div>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${d.active ? "bg-cyan-500/20 text-cyan-500 dark:text-cyan-400" : "dk-surface-2 text-slate-400"}`}>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED REVIEWS SECTION (Algeria) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Star className="h-3.5 w-3.5 fill-amber-400" /> Retours d'expérience clients
          </div>
          <h2 className="dk-heading text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--text)" }}>
            Ils ont transformé leur maison avec DomoTek
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
            Avis vérifiés de clients satisfaits à travers les 58 Wilayas d'Algérie.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="glass-card-hover p-5 rounded-2xl dk-surface flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{rev.date}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed italic" style={{ color: "var(--text)" }}>
                  « {rev.comment} »
                </p>
              </div>

              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{rev.name}</p>
                  <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">{rev.wilaya}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  Achat vérifié
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHATSAPP VIP CONSULTATION BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 dk-surface p-6 sm:p-10 md:p-12 shadow-xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Conseiller DomoTek disponible en ligne</span>
              </div>

              <h3 className="dk-heading text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--text)" }}>
                Quel produit choisir pour votre maison ?
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-dim)" }}>
                Vous hésitez sur la compatibilité (avec ou sans neutre, volets, prises) ? Envoyez-nous simplement une photo de votre interrupteur ou tableau sur WhatsApp.
              </p>

              {/* Ready to click chips */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://wa.me/213775302636?text=Bonjour,%20je%20voudrais%20savoir%20si%20mon%20installation%20est%20compatible%20sans%20fil%20neutre."
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-all"
                  style={{ color: "var(--text)" }}
                >
                  ⚡ Compatibilité sans neutre ?
                </a>
                <a
                  href="https://wa.me/213775302636?text=Bonjour,%20j'aimerais%20automatiser%20mes%20volets%20roulants,%20que%20me%20conseillez-vous%20?"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-all"
                  style={{ color: "var(--text)" }}
                >
                  🪟 Module pour volets roulants
                </a>
              </div>

              <div className="pt-3">
                <a
                  href="https://wa.me/213775302636"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-[0_0_25px_rgba(37,211,102,0.35)] transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-5 w-5 fill-slate-950" />
                  <span>Échanger en direct sur WhatsApp</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right Side Slogan Artwork */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-6 border-t md:border-t-0 md:border-l" style={{ borderColor: "var(--border)" }}>
              <Sparkles className="h-8 w-8 text-amber-500 dark:text-amber-400 mb-3 animate-pulse" />
              <p className="font-script text-3xl sm:text-4xl text-cyan-600 dark:text-cyan-300 font-bold leading-tight">
                Une maison plus intelligente commence ici !
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--text-dim)" }}>
                DomoTek • Votre partenaire domotique en Algérie
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY DOMOTEK / TRUST BADGES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <h2 className="dk-heading text-lg font-bold mb-4" style={{ color: "var(--text)" }}>Pourquoi choisir DomoTek ?</h2>
        <TrustBadges />
      </section>
    </div>
  );
};



