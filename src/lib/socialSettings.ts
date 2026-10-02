/**
 * Module de gestion et synchronisation des réseaux sociaux & coordonnées pour DomoTek.
 * Permet à l'administrateur de personnaliser les liens Facebook, Instagram, TikTok, WhatsApp, etc.
 */

export interface SocialSettings {
  facebook: string;
  facebookEnabled: boolean;

  instagram: string;
  instagramEnabled: boolean;

  tiktok: string;
  tiktokEnabled: boolean;

  whatsapp: string;
  whatsappEnabled: boolean;
  whatsappDefaultMsg?: string;

  youtube: string;
  youtubeEnabled: boolean;

  twitter: string;
  twitterEnabled: boolean;

  linkedin: string;
  linkedinEnabled: boolean;

  telegram: string;
  telegramEnabled: boolean;

  email: string;
  emailEnabled: boolean;

  phone: string;
  phoneEnabled: boolean;
}

const STORAGE_KEY = "domotek_social_links_v1";
const SOCIAL_UPDATE_EVENT = "domotek_social_links_updated";

export const DEFAULT_SOCIAL_SETTINGS: SocialSettings = {
  facebook: "https://facebook.com/domotek.dz",
  facebookEnabled: true,

  instagram: "https://instagram.com/domotek.dz",
  instagramEnabled: true,

  tiktok: "https://tiktok.com/@domotek.dz",
  tiktokEnabled: true,

  whatsapp: "0775 30 26 36",
  whatsappEnabled: true,
  whatsappDefaultMsg: "Bonjour DomoTek, j'aimerais avoir des informations sur vos produits.",

  youtube: "",
  youtubeEnabled: false,

  twitter: "",
  twitterEnabled: false,

  linkedin: "",
  linkedinEnabled: false,

  telegram: "",
  telegramEnabled: false,

  email: "contact@domotek.dz",
  emailEnabled: true,

  phone: "0775 30 26 36",
  phoneEnabled: true,
};

/**
 * Nettoie et formate un numéro de téléphone algérien ou international pour l'URL WhatsApp wa.me
 */
export function formatWhatsAppRawNumber(phone: string): string {
  if (!phone) return "213775302636";
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    return "213" + cleaned.slice(1);
  }
  if (cleaned.startsWith("213") || cleaned.length >= 11) {
    return cleaned;
  }
  return "213" + cleaned;
}

/**
 * Génère le lien complet WhatsApp avec message pré-rempli optionnel
 */
export function buildWhatsAppUrl(phoneOrSettings?: string | SocialSettings, customMessage?: string): string {
  let rawPhone = "213775302636";
  let defaultMsg = "";

  if (typeof phoneOrSettings === "object" && phoneOrSettings !== null) {
    rawPhone = formatWhatsAppRawNumber(phoneOrSettings.whatsapp || "0775 30 26 36");
    defaultMsg = phoneOrSettings.whatsappDefaultMsg || "";
  } else if (typeof phoneOrSettings === "string" && phoneOrSettings.trim()) {
    if (phoneOrSettings.startsWith("http://") || phoneOrSettings.startsWith("https://")) {
      return phoneOrSettings;
    }
    rawPhone = formatWhatsAppRawNumber(phoneOrSettings);
  }

  const msg = customMessage !== undefined ? customMessage : defaultMsg;
  if (msg && msg.trim()) {
    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(msg.trim())}`;
  }
  return `https://wa.me/${rawPhone}`;
}

/**
 * Construit une URL absolue et valide pour n'importe quelle plateforme
 */
export function buildSocialUrl(platform: keyof SocialSettings, value: string): string {
  if (!value || !value.trim()) return "#";
  const val = value.trim();

  if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("mailto:") || val.startsWith("tel:")) {
    return val;
  }

  switch (platform) {
    case "facebook":
      return `https://facebook.com/${val.replace(/^@/, "")}`;
    case "instagram":
      return `https://instagram.com/${val.replace(/^@/, "")}`;
    case "tiktok": {
      const handle = val.startsWith("@") ? val : `@${val}`;
      return `https://tiktok.com/${handle}`;
    }
    case "whatsapp":
      return buildWhatsAppUrl(val);
    case "youtube":
      return val.startsWith("@") ? `https://youtube.com/${val}` : `https://youtube.com/@${val}`;
    case "twitter":
      return `https://x.com/${val.replace(/^@/, "")}`;
    case "linkedin":
      return `https://linkedin.com/company/${val}`;
    case "telegram":
      return `https://t.me/${val.replace(/^@/, "")}`;
    case "email":
      return `mailto:${val}`;
    case "phone":
      return `tel:${val.replace(/[^0-9+]/g, "")}`;
    default:
      return val;
  }
}

/**
 * Charge les paramètres des réseaux sociaux depuis le LocalStorage
 */
export function getSocialSettings(): SocialSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SOCIAL_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error("Erreur lors de la lecture des paramètres réseaux sociaux :", e);
  }
  return DEFAULT_SOCIAL_SETTINGS;
}

/**
 * Sauvegarde les paramètres des réseaux sociaux et notifie l'application
 */
export function saveSocialSettings(settings: SocialSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(SOCIAL_UPDATE_EVENT, { detail: settings }));
  } catch (e) {
    console.error("Erreur lors de la sauvegarde des paramètres réseaux sociaux :", e);
  }
}

/**
 * Réinitialise aux paramètres par défaut
 */
export function resetSocialSettings(): SocialSettings {
  saveSocialSettings(DEFAULT_SOCIAL_SETTINGS);
  return DEFAULT_SOCIAL_SETTINGS;
}

export { SOCIAL_UPDATE_EVENT };
