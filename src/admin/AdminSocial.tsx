import React, { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Phone,
  Mail,
  Share2,
  ExternalLink,
  Check,
  RotateCcw,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle2,
  Youtube,
  Twitter,
  Linkedin,
  Send,
  MessageSquare,
  Globe,
  AlertCircle,
} from "lucide-react";
import type { Store } from "../types";
import { TikTokIcon, WhatsAppIcon } from "../components/ui";
import {
  DEFAULT_SOCIAL_SETTINGS,
  buildSocialUrl,
  buildWhatsAppUrl,
  formatWhatsAppRawNumber,
  type SocialSettings,
} from "../lib/socialSettings";

export const AdminSocial: React.FC<{ s: Store }> = ({ s }) => {
  const [formData, setFormData] = useState<SocialSettings>(() => ({ ...s.socialSettings }));
  const [isSaved, setIsSaved] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"footer" | "header">("footer");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setFormData({ ...s.socialSettings });
  }, [s.socialSettings]);

  const handleChange = <K extends keyof SocialSettings>(field: K, value: SocialSettings[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    s.setSocialSettings(formData);
    s.showToast("Paramètres des réseaux sociaux enregistrés avec succès !");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_SOCIAL_SETTINGS });
    s.setSocialSettings(DEFAULT_SOCIAL_SETTINGS);
    setShowResetConfirm(false);
    s.showToast("Réseaux sociaux réinitialisés aux valeurs par défaut");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Calcul du nombre de réseaux actifs
  const activeCount = [
    formData.facebookEnabled && formData.facebook,
    formData.instagramEnabled && formData.instagram,
    formData.tiktokEnabled && formData.tiktok,
    formData.whatsappEnabled && formData.whatsapp,
    formData.youtubeEnabled && formData.youtube,
    formData.twitterEnabled && formData.twitter,
    formData.linkedinEnabled && formData.linkedin,
    formData.telegramEnabled && formData.telegram,
    formData.emailEnabled && formData.email,
    formData.phoneEnabled && formData.phone,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="dk-surface rounded-2xl p-5 sm:p-6 border shadow-sm relative overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <span>Réseaux Sociaux & Contact</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-mono font-semibold">
                    {activeCount} actif{activeCount > 1 ? "s" : ""}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>
                  Configurez vos liens officiels, numéros WhatsApp et coordonnées visibles par vos clients.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5"
              style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
              title="Restaurer les valeurs d'origine"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                isSaved
                  ? "bg-emerald-500 text-white"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:shadow-cyan-500/20"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Enregistrer les liens</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Reset Modal */}
      {showResetConfirm && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-xs sm:text-sm" style={{ color: "var(--text)" }}>
              Voulez-vous rétablir les liens et coordonnées de base de DomoTek ?
            </p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ color: "var(--text-dim)" }}
            >
              Annuler
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
            >
              Confirmer
            </button>
          </div>
        </div>
      )}

      {/* Interactive Live Preview Box */}
      <div className="dk-surface rounded-2xl p-5 border shadow-sm" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-cyan-500" />
            <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>Aperçu en Direct sur la Boutique</h3>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl dk-surface-2 text-xs">
            <button
              type="button"
              onClick={() => setActivePreviewTab("footer")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activePreviewTab === "footer"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-[var(--text-dim)] hover:text-[var(--text)]"
              }`}
            >
              Pied de Page (Footer)
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab("header")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activePreviewTab === "header"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-[var(--text-dim)] hover:text-[var(--text)]"
              }`}
            >
              En-tête (Barre Contact)
            </button>
          </div>
        </div>

        {activePreviewTab === "footer" ? (
          <div className="p-4 rounded-xl border bg-[var(--surface-2)] flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text)" }}>
                Boutons réseaux sociaux affichés :
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {formData.facebookEnabled && (
                  <a
                    href={buildSocialUrl("facebook", formData.facebook)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface border border-slate-700 hover:border-blue-500 hover:text-blue-400 transition-colors"
                    title={`Facebook: ${formData.facebook || "Non configuré"}`}
                  >
                    <Facebook className="h-4 w-4 text-blue-500" />
                  </a>
                )}
                {formData.instagramEnabled && (
                  <a
                    href={buildSocialUrl("instagram", formData.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface border border-slate-700 hover:border-pink-500 hover:text-pink-400 transition-colors"
                    title={`Instagram: ${formData.instagram || "Non configuré"}`}
                  >
                    <Instagram className="h-4 w-4 text-pink-500" />
                  </a>
                )}
                {formData.tiktokEnabled && (
                  <a
                    href={buildSocialUrl("tiktok", formData.tiktok)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface border border-slate-700 hover:border-cyan-400 transition-colors"
                    title={`TikTok: ${formData.tiktok || "Non configuré"}`}
                  >
                    <TikTokIcon style={{ color: "var(--text)" }} />
                  </a>
                )}
                {formData.youtubeEnabled && (
                  <a
                    href={buildSocialUrl("youtube", formData.youtube)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface border border-slate-700 hover:border-red-500 transition-colors"
                    title={`YouTube: ${formData.youtube || "Non configuré"}`}
                  >
                    <Youtube className="h-4 w-4 text-red-500" />
                  </a>
                )}
                {formData.twitterEnabled && (
                  <a
                    href={buildSocialUrl("twitter", formData.twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface border border-slate-700 hover:border-sky-400 transition-colors"
                    title={`X / Twitter: ${formData.twitter || "Non configuré"}`}
                  >
                    <Twitter className="h-4 w-4 text-sky-400" />
                  </a>
                )}
                {formData.linkedinEnabled && (
                  <a
                    href={buildSocialUrl("linkedin", formData.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface border border-slate-700 hover:border-blue-600 transition-colors"
                    title={`LinkedIn: ${formData.linkedin || "Non configuré"}`}
                  >
                    <Linkedin className="h-4 w-4 text-blue-600" />
                  </a>
                )}
                {formData.telegramEnabled && (
                  <a
                    href={buildSocialUrl("telegram", formData.telegram)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 flex items-center justify-center rounded-xl dk-surface border border-slate-700 hover:border-sky-400 transition-colors"
                    title={`Telegram: ${formData.telegram || "Non configuré"}`}
                  >
                    <Send className="h-4 w-4 text-sky-400" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {formData.whatsappEnabled && (
                <a
                  href={buildWhatsAppUrl(formData)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 font-medium text-xs transition-colors"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  <span>WhatsApp : {formData.whatsapp || "0775 30 26 36"}</span>
                </a>
              )}
              {formData.emailEnabled && formData.email && (
                <a
                  href={`mailto:${formData.email}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 font-medium text-xs transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{formData.email}</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl border bg-[var(--teal-dim)] flex items-center justify-between text-xs" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold" style={{ color: "var(--teal)" }}>
              ⚡ DomoTek — La maison connectée, simplement
            </span>
            <span style={{ color: "var(--text-dim)" }}>🚚 Livraison 58 Wilayas | Paiement à la livraison</span>
            {formData.whatsappEnabled ? (
              <a
                href={buildWhatsAppUrl(formData)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-bold hover:underline"
                style={{ color: "var(--teal)" }}
              >
                <Phone className="h-3 w-3" /> WhatsApp: {formData.whatsapp || "0775 30 26 36"}
              </a>
            ) : (
              <span className="text-slate-500">WhatsApp désactivé</span>
            )}
          </div>
        )}
      </div>

      {/* Main Form Formats */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Messagerie Directe & Contact Urgent */}
        <div className="dk-surface rounded-2xl p-5 border shadow-sm space-y-5" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <WhatsAppIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>
                WhatsApp & Ligne Téléphonique Principale
              </h3>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Utilisé pour les boutons WhatsApp partout sur le site, le support client et l'en-tête.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* WhatsApp Field */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <WhatsAppIcon className="h-4 w-4 text-emerald-400" />
                  <span>Numéro WhatsApp Commercial</span>
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.whatsappEnabled}
                    onChange={(e) => handleChange("whatsappEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="Ex: 0775 30 26 36 ou +213775302636"
                  className="dk-input w-full rounded-xl px-3.5 py-2.5 text-xs font-mono dk-focus"
                />
                <p className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>
                  Format converti automatiquement en wa.me : <strong className="text-emerald-400">{formatWhatsAppRawNumber(formData.whatsapp)}</strong>
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                  Message pré-rempli par défaut lors du clic WhatsApp :
                </label>
                <input
                  type="text"
                  value={formData.whatsappDefaultMsg || ""}
                  onChange={(e) => handleChange("whatsappDefaultMsg", e.target.value)}
                  placeholder="Ex: Bonjour DomoTek, j'aimerais avoir des informations..."
                  className="dk-input w-full rounded-xl px-3.5 py-2 text-xs dk-focus"
                />
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {formData.whatsappEnabled ? "✅ Affiché sur le site" : "❌ Masqué sur le site"}
                </span>
                <a
                  href={buildWhatsAppUrl(formData)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Tester WhatsApp <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Direct Phone Field */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <Phone className="h-4 w-4 text-cyan-500" />
                  <span>Numéro d'Appel Direct (Téléphone)</span>
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.phoneEnabled}
                    onChange={(e) => handleChange("phoneEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Ex: 0775 30 26 36"
                  className="dk-input w-full rounded-xl px-3.5 py-2.5 text-xs font-mono dk-focus"
                />
                <p className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>
                  Permet aux clients d'appeler directement en un clic depuis leur mobile.
                </p>
              </div>

              <div className="pt-5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {formData.phoneEnabled ? "✅ Actif" : "❌ Désactivé"}
                </span>
                <a
                  href={`tel:${formData.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Tester appel tel: <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Réseaux Sociaux Principaux */}
        <div className="dk-surface rounded-2xl p-5 border shadow-sm space-y-5" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>
                Comptes & Pages Réseaux Sociaux
              </h3>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Renseignez le lien complet ou l'identifiant (@nom) de vos profils officiels.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Facebook Card */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3 transition-all" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Facebook className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>Facebook</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.facebookEnabled}
                    onChange={(e) => handleChange("facebookEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/domotek.dz"
                  className="dk-input w-full rounded-lg px-3 py-2 text-xs dk-focus"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={formData.facebookEnabled ? "text-emerald-400" : "text-slate-500"}>
                  {formData.facebookEnabled ? "Actif" : "Inactif"}
                </span>
                {formData.facebook && (
                  <a
                    href={buildSocialUrl("facebook", formData.facebook)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Tester <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Instagram Card */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3 transition-all" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>Instagram</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.instagramEnabled}
                    onChange={(e) => handleChange("instagramEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/domotek.dz ou @domotek.dz"
                  className="dk-input w-full rounded-lg px-3 py-2 text-xs dk-focus"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={formData.instagramEnabled ? "text-emerald-400" : "text-slate-500"}>
                  {formData.instagramEnabled ? "Actif" : "Inactif"}
                </span>
                {formData.instagram && (
                  <a
                    href={buildSocialUrl("instagram", formData.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:underline flex items-center gap-1"
                  >
                    Tester <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* TikTok Card */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3 transition-all" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                    <TikTokIcon style={{ color: "var(--cyan)" }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>TikTok</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tiktokEnabled}
                    onChange={(e) => handleChange("tiktokEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={(e) => handleChange("tiktok", e.target.value)}
                  placeholder="https://tiktok.com/@domotek.dz ou @domotek.dz"
                  className="dk-input w-full rounded-lg px-3 py-2 text-xs dk-focus"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={formData.tiktokEnabled ? "text-emerald-400" : "text-slate-500"}>
                  {formData.tiktokEnabled ? "Actif" : "Inactif"}
                </span>
                {formData.tiktok && (
                  <a
                    href={buildSocialUrl("tiktok", formData.tiktok)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Tester <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* YouTube Card */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3 transition-all" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                    <Youtube className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>YouTube</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.youtubeEnabled}
                    onChange={(e) => handleChange("youtubeEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.youtube}
                  onChange={(e) => handleChange("youtube", e.target.value)}
                  placeholder="https://youtube.com/@domotek ou @domotek"
                  className="dk-input w-full rounded-lg px-3 py-2 text-xs dk-focus"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={formData.youtubeEnabled ? "text-emerald-400" : "text-slate-500"}>
                  {formData.youtubeEnabled ? "Actif" : "Inactif"}
                </span>
                {formData.youtube && (
                  <a
                    href={buildSocialUrl("youtube", formData.youtube)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:underline flex items-center gap-1"
                  >
                    Tester <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* X / Twitter Card */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3 transition-all" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Twitter className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>X / Twitter</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.twitterEnabled}
                    onChange={(e) => handleChange("twitterEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                  placeholder="https://x.com/domotek ou @domotek"
                  className="dk-input w-full rounded-lg px-3 py-2 text-xs dk-focus"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={formData.twitterEnabled ? "text-emerald-400" : "text-slate-500"}>
                  {formData.twitterEnabled ? "Actif" : "Inactif"}
                </span>
                {formData.twitter && (
                  <a
                    href={buildSocialUrl("twitter", formData.twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    Tester <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* LinkedIn Card */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3 transition-all" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-700/20 text-blue-400 flex items-center justify-center">
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>LinkedIn</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.linkedinEnabled}
                    onChange={(e) => handleChange("linkedinEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-700"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/domotek"
                  className="dk-input w-full rounded-lg px-3 py-2 text-xs dk-focus"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={formData.linkedinEnabled ? "text-emerald-400" : "text-slate-500"}>
                  {formData.linkedinEnabled ? "Actif" : "Inactif"}
                </span>
                {formData.linkedin && (
                  <a
                    href={buildSocialUrl("linkedin", formData.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Tester <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Telegram Card */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3 transition-all" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center">
                    <Send className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>Telegram</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.telegramEnabled}
                    onChange={(e) => handleChange("telegramEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => handleChange("telegram", e.target.value)}
                  placeholder="https://t.me/domotek ou @domotek"
                  className="dk-input w-full rounded-lg px-3 py-2 text-xs dk-focus"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={formData.telegramEnabled ? "text-emerald-400" : "text-slate-500"}>
                  {formData.telegramEnabled ? "Actif" : "Inactif"}
                </span>
                {formData.telegram && (
                  <a
                    href={buildSocialUrl("telegram", formData.telegram)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    Tester <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Email Card */}
            <div className="p-4 rounded-xl dk-surface-2 border space-y-3 transition-all" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--text)" }}>Email Support</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailEnabled}
                    onChange={(e) => handleChange("emailEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="contact@domotek.dz"
                  className="dk-input w-full rounded-lg px-3 py-2 text-xs dk-focus"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={formData.emailEnabled ? "text-emerald-400" : "text-slate-500"}>
                  {formData.emailEnabled ? "Actif" : "Inactif"}
                </span>
                {formData.email && (
                  <a
                    href={`mailto:${formData.email}`}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Tester <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar Floating / Bottom */}
        <div className="p-4 rounded-2xl dk-surface border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
              Les modifications sont appliquées instantanément sur l'ensemble de la boutique et sauvegardées.
            </span>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Enregistrer les Réseaux Sociaux</span>
          </button>
        </div>
      </form>
    </div>
  );
};
