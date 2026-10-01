/**
 * metaPixel.ts
 * Module d'intégration et de suivi e-commerce pour le Pixel Meta (Facebook & Instagram).
 * Permet de suivre les événements standards :
 * - PageView
 * - ViewContent (Consultation produit)
 * - AddToCart (Ajout au panier)
 * - InitiateCheckout (Début de commande)
 * - Purchase (Achat / Commande validée)
 * - Contact (Clic WhatsApp / Support)
 */

import type { Order, Product, CartItemDetailed } from "../types";

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

const STORAGE_PIXEL_KEY = "domotek_meta_pixel_id";
const DEFAULT_PIXEL_ID = "1089470470472743";

// Ensemble des IDs de pixel déjà initialisés dans la session pour éviter les doublons
const initializedPixelIds = new Set<string>();

/**
 * Récupère l'ID du Pixel Meta configuré (depuis .env, localStorage ou ID par défaut)
 */
export function getMetaPixelId(): string {
  if (typeof window === "undefined") return DEFAULT_PIXEL_ID;
  const envId = (import.meta.env.VITE_META_PIXEL_ID || "").trim();
  const savedId = (localStorage.getItem(STORAGE_PIXEL_KEY) || "").trim();
  return savedId || envId || DEFAULT_PIXEL_ID;
}

/**
 * Sauvegarde un nouvel ID Pixel Meta (depuis le panneau admin par exemple)
 */
export function setMetaPixelId(pixelId: string): void {
  if (typeof window === "undefined") return;
  const cleanId = pixelId.trim();
  if (cleanId) {
    localStorage.setItem(STORAGE_PIXEL_KEY, cleanId);
    initMetaPixel(cleanId);
  } else {
    localStorage.removeItem(STORAGE_PIXEL_KEY);
  }
}

/**
 * Initialise le script Meta Pixel de manière asynchrone et sécurisée sans doublon
 */
export function initMetaPixel(customId?: string): void {
  if (typeof window === "undefined") return;

  const pixelId = customId || getMetaPixelId();
  if (!pixelId) return;

  // Si cet ID a déjà été initialisé par index.html ou un appel précédent, on ne ré-initialise pas
  if (initializedPixelIds.has(pixelId)) {
    return;
  }

  // Si window.fbq est déjà chargé
  if (window.fbq) {
    // Si c'est l'ID par défaut et que index.html l'a déjà injecté
    if (pixelId === DEFAULT_PIXEL_ID && initializedPixelIds.size === 0) {
      initializedPixelIds.add(pixelId);
      return;
    }

    try {
      window.fbq("init", pixelId);
      initializedPixelIds.add(pixelId);
    } catch (e) {
      console.warn("Meta Pixel init notice:", e);
    }
    return;
  }

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  if (window.fbq && !initializedPixelIds.has(pixelId)) {
    window.fbq("init", pixelId);
    initializedPixelIds.add(pixelId);
  }
}

/**
 * Suivi d'une visite de page (SPA)
 */
export function trackPageView(pageName?: string): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "PageView", pageName ? { page_name: pageName } : undefined);
  } catch (err) {
    console.debug("Meta Pixel PageView error:", err);
  }
}

/**
 * Suivi d'une consultation de produit (ViewContent)
 */
export function trackViewContent(product: Product): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "ViewContent", {
      content_name: product.name,
      content_category: product.category,
      content_ids: [String(product.id)],
      content_type: "product",
      value: product.price,
      currency: "DZD",
    });
  } catch (err) {
    console.debug("Meta Pixel ViewContent error:", err);
  }
}

/**
 * Suivi de l'ajout au panier (AddToCart)
 */
export function trackAddToCart(product: Product, qty = 1, variant: string | null = null): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "AddToCart", {
      content_name: product.name,
      content_category: product.category,
      content_ids: [String(product.id)],
      content_type: "product",
      value: product.price * qty,
      currency: "DZD",
      num_items: qty,
      variant: variant || undefined,
    });
  } catch (err) {
    console.debug("Meta Pixel AddToCart error:", err);
  }
}

/**
 * Suivi de l'ouverture du formulaire de commande (InitiateCheckout)
 */
export function trackInitiateCheckout(items: CartItemDetailed[], total: number): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "InitiateCheckout", {
      content_ids: items.map((i) => String(i.productId)),
      content_type: "product",
      value: total,
      currency: "DZD",
      num_items: items.reduce((sum, i) => sum + i.qty, 0),
    });
  } catch (err) {
    console.debug("Meta Pixel InitiateCheckout error:", err);
  }
}

/**
 * Suivi de la validation d'une commande (Purchase)
 */
export function trackPurchase(order: Order): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "Purchase", {
      content_type: "product",
      value: order.total,
      currency: "DZD",
      order_id: order.id,
      num_items: order.items.reduce((sum, i) => sum + i.qty, 0),
    });
  } catch (err) {
    console.debug("Meta Pixel Purchase error:", err);
  }
}

/**
 * Suivi d'un clic de contact (Lead / WhatsApp)
 */
export function trackContact(channel = "WhatsApp"): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", "Contact", {
      channel,
      currency: "DZD",
    });
  } catch (err) {
    console.debug("Meta Pixel Contact error:", err);
  }
}
