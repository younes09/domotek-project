import type { Order } from "../types";

/**
 * Demo data for the admin dashboard ONLY. This is internal scaffolding so the
 * dashboard has something to render out of the box — it is never shown to
 * storefront customers. Replace with real orders/analytics once connected
 * to a backend.
 */
export const DEMO_ORDERS: Order[] = [
  { id: "CMD-1001", customerName: "Amine Belkacem", phone: "0551 23 45 67", wilaya: "16 - Alger", commune: "Bab Ezzouar", address: "Cité 100 Logements, Bt C",
    items: [{ name: "Interrupteur WiFi intelligent 2 voies", qty: 1, price: 3600 }, { name: "Prise connectée WiFi 16A", qty: 2, price: 2500 }],
    total: 8600, status: "Confirmée", date: "2026-09-08" },
  { id: "CMD-1002", customerName: "Sarah Meziane", phone: "0662 88 11 09", wilaya: "31 - Oran", commune: "Bir El Djir", address: "Rue des Frères Bouadou",
    items: [{ name: "Détecteur d'ouverture Porte/Fenêtre", qty: 3, price: 2200 }],
    total: 6600, status: "Expédiée", date: "2026-09-10" },
  { id: "CMD-1003", customerName: "Yacine Haddad", phone: "0770 44 22 18", wilaya: "09 - Blida", commune: "Boufarik", address: "Route Nationale 29",
    items: [{ name: "Module relais WiFi pour volet roulant", qty: 2, price: 3200 }],
    total: 6400, status: "En préparation", date: "2026-09-11" },
  { id: "CMD-1004", customerName: "Imane Cherif", phone: "0540 19 77 32", wilaya: "25 - Constantine", commune: "El Khroub", address: "Cité Zouaghi",
    items: [{ name: "Sonnette vidéo WiFi", qty: 1, price: 6500 }],
    total: 6500, status: "Livrée", date: "2026-09-05" },
  { id: "CMD-1005", customerName: "Nabil Ouali", phone: "0555 66 21 40", wilaya: "06 - Béjaïa", commune: "Amizour", address: "Village Ait Ali",
    items: [{ name: "Ampoule LED WiFi RGB", qty: 4, price: 2100 }],
    total: 8400, status: "Nouvelle", date: "2026-09-13" },
];

export const DEMO_SALES = [
  { day: "Lun", ventes: 21000 }, { day: "Mar", ventes: 15400 }, { day: "Mer", ventes: 27800 },
  { day: "Jeu", ventes: 19600 }, { day: "Ven", ventes: 32200 }, { day: "Sam", ventes: 41500 },
  { day: "Dim", ventes: 24700 },
];

export const ORDER_STATUSES = ["Nouvelle", "Confirmée", "En préparation", "Expédiée", "Livrée", "Annulée"] as const;
