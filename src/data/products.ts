import { ToggleLeft, Bell, Plug, RadioTower, ShieldCheck, Zap, Lightbulb, Video, Cpu } from "lucide-react";
import type { Product } from "../types";

/**
 * PLACEHOLDER CATALOG
 * ---------------------------------------------------------------------
 * These 12 products are realistic placeholders only — names, categories,
 * prices, stock states and copy. No real specifications, ratings or
 * business claims are invented here. Replace this array with the real
 * DomoTek catalog (ideally sourced from a CMS / backend / spreadsheet
 * import) before going live. Keep the same shape so every component
 * that consumes `Product` keeps working unchanged.
 * ---------------------------------------------------------------------
 */
export const PRODUCTS: Product[] = [
  {
    id: 1, slug: "interrupteur-wifi-1-voie", name: "Interrupteur WiFi intelligent 1 voie", category: "interrupteurs", icon: ToggleLeft,
    shortDesc: "Contrôlez votre éclairage à distance depuis votre smartphone.",
    longDesc: "Remplacez votre interrupteur classique par ce modèle connecté et pilotez votre éclairage depuis l'application, où que vous soyez.",
    price: 2800, oldPrice: null, stock: "in", isNew: true, isBestSeller: false,
  },
  {
    id: 2, slug: "interrupteur-wifi-2-voies", name: "Interrupteur WiFi intelligent 2 voies", category: "interrupteurs", icon: ToggleLeft,
    shortDesc: "Pilotez deux circuits indépendants depuis une seule application.",
    longDesc: "Idéal pour une pièce à deux points lumineux, cet interrupteur double vous permet de gérer chaque circuit séparément, à la main ou à distance.",
    price: 3600, oldPrice: 4200, stock: "in", isNew: false, isBestSeller: true,
  },
  {
    id: 3, slug: "detecteur-ouverture-porte-fenetre", name: "Détecteur d'ouverture Porte/Fenêtre", category: "capteurs", icon: Bell,
    shortDesc: "Recevez une alerte dès qu'une porte ou une fenêtre s'ouvre.",
    longDesc: "Ce détecteur se fixe discrètement sur vos portes et fenêtres et vous prévient en temps réel sur votre téléphone en cas d'ouverture.",
    price: 2200, oldPrice: null, stock: "in", isNew: false, isBestSeller: true,
  },
  {
    id: 4, slug: "prise-connectee-16a", name: "Prise connectée WiFi 16A", category: "prises", icon: Plug,
    shortDesc: "Allumez et éteignez vos appareils depuis votre smartphone.",
    longDesc: "Branchez cette prise entre le mur et votre appareil pour le rendre pilotable à distance et programmable selon vos habitudes.",
    price: 2500, oldPrice: null, stock: "in", isNew: true, isBestSeller: false,
  },
  {
    id: 5, slug: "telecommande-rf-4-canaux", name: "Télécommande RF universelle 4 canaux", category: "telecommandes", icon: RadioTower,
    shortDesc: "Centralisez le pilotage de plusieurs appareils sur une télécommande.",
    longDesc: "Une seule télécommande pour regrouper le contrôle de plusieurs équipements compatibles de votre installation.",
    price: 1800, oldPrice: null, stock: "low", isNew: false, isBestSeller: false,
  },
  {
    id: 6, slug: "capteur-mouvement-pir", name: "Capteur de mouvement PIR WiFi", category: "capteurs", icon: ShieldCheck,
    shortDesc: "Détectez les mouvements dans une pièce et recevez une notification.",
    longDesc: "Placez ce capteur dans une pièce ou une entrée pour être averti de toute présence, de jour comme de nuit.",
    price: 2600, oldPrice: 3000, stock: "in", isNew: false, isBestSeller: false,
  },
  {
    id: 7, slug: "module-relais-volet-roulant", name: "Module relais WiFi pour volet roulant", category: "interrupteurs", icon: Zap,
    shortDesc: "Motorisez le pilotage de votre volet roulant électrique.",
    longDesc: "Ce module se raccorde à votre moteur de volet roulant existant et vous permet de le commander depuis votre smartphone.",
    price: 3200, oldPrice: null, stock: "in", isNew: false, isBestSeller: true,
  },
  {
    id: 8, slug: "ampoule-led-wifi-rgb", name: "Ampoule LED WiFi RGB", category: "smart-home", icon: Lightbulb,
    shortDesc: "Changez la couleur et l'intensité de votre éclairage depuis l'application.",
    longDesc: "Une ambiance différente pour chaque moment de la journée, réglable directement depuis votre téléphone.",
    price: 2100, oldPrice: null, stock: "in", isNew: true, isBestSeller: false,
    variants: { label: "Culot", options: ["E27", "B22"] },
  },
  {
    id: 9, slug: "sonnette-video-wifi", name: "Sonnette vidéo WiFi", category: "capteurs", icon: Video,
    shortDesc: "Voyez et parlez à vos visiteurs depuis votre smartphone.",
    longDesc: "Cette sonnette connectée vous permet de voir qui se trouve à votre porte et d'y répondre, même à distance.",
    price: 6500, oldPrice: 7500, stock: "low", isNew: false, isBestSeller: false,
  },
  {
    id: 10, slug: "multiprise-intelligente-4-prises", name: "Multiprise intelligente WiFi 4 prises", category: "prises", icon: Plug,
    shortDesc: "Pilotez quatre appareils indépendamment depuis une seule multiprise.",
    longDesc: "Gagnez en simplicité en regroupant le contrôle de plusieurs appareils sur une seule multiprise connectée.",
    price: 4200, oldPrice: null, stock: "in", isNew: false, isBestSeller: false,
  },
  {
    id: 11, slug: "support-mural-camera", name: "Support mural pour caméra WiFi", category: "accessoires", icon: Cpu,
    shortDesc: "Fixez votre caméra connectée à l'endroit idéal.",
    longDesc: "Un support d'installation simple pour orienter votre caméra WiFi où vous en avez besoin.",
    price: 1200, oldPrice: null, stock: "low", isNew: false, isBestSeller: false,
  },
  {
    id: 12, slug: "passerelle-domotique", name: "Passerelle domotique WiFi/Zigbee", category: "smart-home", icon: Cpu,
    shortDesc: "Faites communiquer vos différents appareils connectés entre eux.",
    longDesc: "Cette passerelle centralise vos appareils compatibles pour les piloter et les faire interagir depuis une seule application.",
    price: 5800, oldPrice: null, stock: "out", isNew: false, isBestSeller: false,
  },
];
