import type { Order } from "../types";
import { formatDZD } from "./format";

export interface WhatsAppNotificationSettings {
  enabled: boolean;
  phone: string; // Ex: 213775302636
  provider: "callmebot" | "webhook" | "greenapi";
  callmebotApiKey?: string;
  webhookUrl?: string;
  greenApiInstanceId?: string;
  greenApiToken?: string;
}

const STORAGE_KEY = "domotek_whatsapp_settings_v1";

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppNotificationSettings = {
  enabled: true,
  phone: "213775302636",
  provider: "callmebot",
  callmebotApiKey: "",
  webhookUrl: "",
};

export function getWhatsAppSettings(): WhatsAppNotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_WHATSAPP_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to read WhatsApp settings:", e);
  }
  return DEFAULT_WHATSAPP_SETTINGS;
}

export function saveWhatsAppSettings(settings: WhatsAppNotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save WhatsApp settings:", e);
  }
}

/**
 * Formate le texte structuré de la commande pour WhatsApp
 */
export function formatOrderWhatsAppMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.name}${item.variant ? ` (${item.variant})` : ""} × ${item.qty} (${formatDZD(item.price * item.qty)})`
    )
    .join("\n");

  const notesText = order.notes && order.notes.trim() ? `\n📝 *Notes :* ${order.notes.trim()}` : "";

  return [
    `⚡ *NOUVELLE COMMANDE DOMOTEK*`,
    `━━━━━━━━━━━━━━━━━━━`,
    `📦 *Commande :* \`${order.id}\``,
    `📅 *Date :* ${order.date || new Date().toLocaleDateString("fr-FR")}`,
    `━━━━━━━━━━━━━━━━━━━`,
    `👤 *Client :* ${order.customerName}`,
    `📞 *Téléphone :* ${order.phone}`,
    `📍 *Wilaya :* ${order.wilaya}`,
    `🏙️ *Commune :* ${order.commune}`,
    `🏠 *Adresse :* ${order.address}${notesText}`,
    `━━━━━━━━━━━━━━━━━━━`,
    `🛒 *Articles commandés :*`,
    itemsText,
    `━━━━━━━━━━━━━━━━━━━`,
    `💰 *TOTAL :* *${formatDZD(order.total)}*`,
    `🚚 *Paiement :* À la livraison (Cash on Delivery)`,
  ].join("\n");
}

/**
 * Envoie automatiquement la notification WhatsApp en arrière-plan
 */
export async function sendOrderWhatsAppNotification(
  order: Order
): Promise<{ success: boolean; message: string }> {
  const settings = getWhatsAppSettings();
  if (!settings.enabled) {
    return { success: false, message: "Notifications WhatsApp désactivées dans les paramètres." };
  }

  const cleanPhone = settings.phone.replace(/[^0-9]/g, "");
  if (!cleanPhone) {
    return { success: false, message: "Numéro de téléphone WhatsApp non configuré." };
  }

  const message = formatOrderWhatsAppMessage(order);

  try {
    // 1. Provider: CallMeBot (Gratuit & Direct)
    if (settings.provider === "callmebot" && settings.callmebotApiKey) {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        cleanPhone
      )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(settings.callmebotApiKey.trim())}`;

      // Envoi asynchrone non-bloquant
      const response = await fetch(url, { method: "GET", mode: "no-cors" });
      return { success: true, message: "Notification WhatsApp envoyée via CallMeBot." };
    }

    // 2. Provider: Custom Webhook / Supabase Edge Function
    if (settings.provider === "webhook" && settings.webhookUrl) {
      const response = await fetch(settings.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "NEW_ORDER",
          phone: cleanPhone,
          message,
          order,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur Webhook HTTP ${response.status}`);
      }
      return { success: true, message: "Notification envoyée au Webhook avec succès." };
    }

    // 3. Provider: Green-API
    if (settings.provider === "greenapi" && settings.greenApiInstanceId && settings.greenApiToken) {
      const url = `https://api.green-api.com/waInstance${settings.greenApiInstanceId.trim()}/sendMessage/${settings.greenApiToken.trim()}`;
      const chatId = cleanPhone.includes("@c.us") ? cleanPhone : `${cleanPhone}@c.us`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur Green-API HTTP ${response.status}`);
      }
      return { success: true, message: "Notification envoyée via Green-API." };
    }

    return {
      success: false,
      message: "Clé API WhatsApp ou URL Webhook manquante. Veuillez configurer les identifiants dans l'admin.",
    };
  } catch (error: any) {
    console.error("Erreur envoi notification WhatsApp:", error);
    return {
      success: false,
      message: error?.message || "Échec de l'envoi de la notification WhatsApp.",
    };
  }
}
