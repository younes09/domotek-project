import {
  Home,
  ToggleLeft,
  ShieldCheck,
  Plug,
  RadioTower,
  Cpu,
  Lightbulb,
  Zap,
  Camera,
  Bell,
  Lock,
  Wifi,
  Sun,
  Flame,
  Thermometer,
  Key,
  Layers,
  Package,
  Tv,
  Volume2,
  Eye,
  Sliders,
  Sparkles,
  Gauge,
  Smartphone,
  Router,
  Power,
  ShieldAlert,
  Server,
  Activity,
} from "lucide-react";
import type { Category, IconType } from "../types";

export interface AvailableIcon {
  name: string;
  label: string;
  category: "Général" | "Éclairage" | "Sécurité" | "Énergie & Prises" | "Connectivité" | "Capteurs & Confort";
  icon: IconType;
}

export const AVAILABLE_CATEGORY_ICONS: AvailableIcon[] = [
  // Général
  { name: "Home", label: "Maison / Smart Home", category: "Général", icon: Home },
  { name: "Package", label: "Pack & Kits", category: "Général", icon: Package },
  { name: "Layers", label: "Scènes & Automatisations", category: "Général", icon: Layers },
  { name: "Sparkles", label: "Nouveautés / IA", category: "Général", icon: Sparkles },
  { name: "Smartphone", label: "Contrôle Mobile", category: "Général", icon: Smartphone },

  // Éclairage
  { name: "ToggleLeft", label: "Interrupteur", category: "Éclairage", icon: ToggleLeft },
  { name: "Lightbulb", label: "Ampoule / Éclairage", category: "Éclairage", icon: Lightbulb },
  { name: "Sun", label: "Lumière & Ambiance", category: "Éclairage", icon: Sun },
  { name: "Sliders", label: "Variateur / Dimmer", category: "Éclairage", icon: Sliders },

  // Sécurité
  { name: "ShieldCheck", label: "Sécurité & Protection", category: "Sécurité", icon: ShieldCheck },
  { name: "Camera", label: "Caméra / Surveillance", category: "Sécurité", icon: Camera },
  { name: "Lock", label: "Serrure Intelligente", category: "Sécurité", icon: Lock },
  { name: "Key", label: "Contrôle d'accès", category: "Sécurité", icon: Key },
  { name: "Bell", label: "Sonnette / Alarme", category: "Sécurité", icon: Bell },
  { name: "ShieldAlert", label: "Alerte intrusion", category: "Sécurité", icon: ShieldAlert },

  // Énergie & Prises
  { name: "Plug", label: "Prise connectée", category: "Énergie & Prises", icon: Plug },
  { name: "Zap", label: "Relais / Puissance", category: "Énergie & Prises", icon: Zap },
  { name: "Power", label: "Alimentation", category: "Énergie & Prises", icon: Power },
  { name: "Gauge", label: "Mesure de consommation", category: "Énergie & Prises", icon: Gauge },

  // Connectivité
  { name: "Wifi", label: "Réseau Wi-Fi", category: "Connectivité", icon: Wifi },
  { name: "RadioTower", label: "Télécommande / RF", category: "Connectivité", icon: RadioTower },
  { name: "Router", label: "Passerelle / Gateway", category: "Connectivité", icon: Router },
  { name: "Server", label: "Hub Domotique", category: "Connectivité", icon: Server },
  { name: "Cpu", label: "Accessoires & Modules", category: "Connectivité", icon: Cpu },

  // Capteurs & Confort
  { name: "Thermometer", label: "Thermostat & Climat", category: "Capteurs & Confort", icon: Thermometer },
  { name: "Flame", label: "Capteur Gaz & Fumée", category: "Capteurs & Confort", icon: Flame },
  { name: "Eye", label: "Détecteur de Mouvement", category: "Capteurs & Confort", icon: Eye },
  { name: "Activity", label: "Capteur d'environnement", category: "Capteurs & Confort", icon: Activity },
  { name: "Tv", label: "TV & Multimédia", category: "Capteurs & Confort", icon: Tv },
  { name: "Volume2", label: "Audio & Haut-parleur", category: "Capteurs & Confort", icon: Volume2 },
];

export const ICON_MAP: Record<string, IconType> = AVAILABLE_CATEGORY_ICONS.reduce(
  (acc, item) => {
    acc[item.name] = item.icon;
    return acc;
  },
  {} as Record<string, IconType>
);

export function getCategoryIcon(iconName?: string, fallback: IconType = Home): IconType {
  if (!iconName) return fallback;
  return ICON_MAP[iconName] || fallback;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { key: "smart-home", name: "Smart Home", iconName: "Home", icon: Home, desc: "Pilotez toute votre maison" },
  { key: "interrupteurs", name: "Interrupteurs intelligents", iconName: "ToggleLeft", icon: ToggleLeft, desc: "Éclairage et circuits à distance" },
  { key: "capteurs", name: "Capteurs & Sécurité", iconName: "ShieldCheck", icon: ShieldCheck, desc: "Surveillance et alertes" },
  { key: "prises", name: "Prises intelligentes", iconName: "Plug", icon: Plug, desc: "Pilotez vos appareils branchés" },
  { key: "telecommandes", name: "Télécommandes", iconName: "RadioTower", icon: RadioTower, desc: "Centralisez vos commandes" },
  { key: "accessoires", name: "Accessoires électroniques", iconName: "Cpu", icon: Cpu, desc: "Complétez votre installation" },
];

export const CATEGORIES = DEFAULT_CATEGORIES;

export function buildCategoryLabel(categories: Category[]): Record<string, string> {
  return categories.reduce((acc, c) => {
    acc[c.key] = c.name;
    return acc;
  }, {} as Record<string, string>);
}

export const CATEGORY_LABEL: Record<string, string> = buildCategoryLabel(DEFAULT_CATEGORIES);
