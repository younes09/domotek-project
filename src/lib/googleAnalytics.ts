/**
 * googleAnalytics.ts
 * Module d'intégration et de suivi e-commerce pour Google Analytics 4 (GA4 / gtag.js).
 * Permet de suivre automatiquement les événements standards GA4 :
 * - page_view (Visite de page / SPA)
 * - view_item (Consultation de fiche produit)
 * - add_to_cart (Ajout au panier)
 * - begin_checkout (Début du processus de commande)
 * - purchase (Achat finalisé avec transaction_id et montant en DZD)
 * - contact (Clic WhatsApp / Support)
 */

import type { Order, Product, CartItemDetailed } from "../types";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const STORAGE_GA_KEY = "domotek_ga_measurement_id";
const DEFAULT_GA_ID = ""; // Laisser vide par défaut jusqu'à ce que l'utilisateur fournisse son ID G-XXXXXXXXXX

/**
 * Récupère l'ID Google Analytics 4 configuré (depuis .env ou localStorage)
 */
export function getGoogleAnalyticsId(): string {
  if (typeof window === "undefined") return DEFAULT_GA_ID;
  const envId = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
  const savedId = (localStorage.getItem(STORAGE_GA_KEY) || "").trim();
  return savedId || envId || DEFAULT_GA_ID;
}

/**
 * Sauvegarde un nouvel ID Google Analytics 4 (depuis le panneau admin)
 */
export function setGoogleAnalyticsId(id: string): void {
  if (typeof window === "undefined") return;
  const cleanId = id.trim();
  if (cleanId) {
    localStorage.setItem(STORAGE_GA_KEY, cleanId);
    initGoogleAnalytics(cleanId);
  } else {
    localStorage.removeItem(STORAGE_GA_KEY);
  }
}

/**
 * Initialise le script Google Analytics 4 (gtag.js) de manière asynchrone
 */
export function initGoogleAnalytics(customId?: string): void {
  if (typeof window === "undefined") return;

  const gaId = customId || getGoogleAnalyticsId();
  if (!gaId) return;

  // Initialiser dataLayer si inexistant
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer!.push(arguments);
    };
  }

  // Vérifier si le script gtag est déjà présent dans le DOM
  const existingScript = document.getElementById("ga-gtag-script");
  if (!existingScript) {
    const script = document.createElement("script");
    script.id = "ga-gtag-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", gaId, {
    send_page_view: false, // On gère le suivi manuel pour le routage SPA
  });
}

/**
 * Suivi d'une visite de page (SPA navigation)
 */
export function trackGAPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  const gaId = getGoogleAnalyticsId();
  if (!gaId) return;

  try {
    window.gtag("event", "page_view", {
      page_path: `#${pagePath}`,
      page_title: pageTitle || `DomoTek — ${pagePath}`,
      send_to: gaId,
    });
  } catch (err) {
    console.debug("GA4 PageView error:", err);
  }
}

/**
 * Suivi de consultation de produit (view_item)
 */
export function trackGAViewItem(product: Product): void {
  if (typeof window === "undefined" || !window.gtag) return;
  try {
    window.gtag("event", "view_item", {
      currency: "DZD",
      value: product.price,
      items: [
        {
          item_id: String(product.id),
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  } catch (err) {
    console.debug("GA4 view_item error:", err);
  }
}

/**
 * Suivi d'ajout au panier (add_to_cart)
 */
export function trackGAAddToCart(product: Product, qty = 1, variant: string | null = null): void {
  if (typeof window === "undefined" || !window.gtag) return;
  try {
    window.gtag("event", "add_to_cart", {
      currency: "DZD",
      value: product.price * qty,
      items: [
        {
          item_id: String(product.id),
          item_name: product.name,
          item_category: product.category,
          item_variant: variant || undefined,
          price: product.price,
          quantity: qty,
        },
      ],
    });
  } catch (err) {
    console.debug("GA4 add_to_cart error:", err);
  }
}

/**
 * Suivi du passage en caisse (begin_checkout)
 */
export function trackGABeginCheckout(items: CartItemDetailed[], total: number): void {
  if (typeof window === "undefined" || !window.gtag) return;
  try {
    window.gtag("event", "begin_checkout", {
      currency: "DZD",
      value: total,
      items: items.map((i) => ({
        item_id: String(i.productId),
        item_name: i.product.name,
        item_category: i.product.category,
        item_variant: i.variant || undefined,
        price: i.product.price,
        quantity: i.qty,
      })),
    });
  } catch (err) {
    console.debug("GA4 begin_checkout error:", err);
  }
}

/**
 * Suivi de la validation d'une commande (purchase)
 */
export function trackGAPurchase(order: Order): void {
  if (typeof window === "undefined" || !window.gtag) return;
  try {
    window.gtag("event", "purchase", {
      transaction_id: order.id,
      value: order.total,
      currency: "DZD",
      items: order.items.map((i) => ({
        item_name: i.name,
        item_variant: i.variant || undefined,
        price: i.price,
        quantity: i.qty,
      })),
    });
  } catch (err) {
    console.debug("GA4 purchase error:", err);
  }
}

/**
 * Suivi d'un événement de contact / lead
 */
export function trackGAContact(channel = "WhatsApp"): void {
  if (typeof window === "undefined" || !window.gtag) return;
  try {
    window.gtag("event", "generate_lead", {
      currency: "DZD",
      method: channel,
    });
  } catch (err) {
    console.debug("GA4 Contact error:", err);
  }
}
