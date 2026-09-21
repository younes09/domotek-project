import { Home, ToggleLeft, ShieldCheck, Plug, RadioTower, Cpu } from "lucide-react";
import type { Category } from "../types";

export const CATEGORIES: Category[] = [
  { key: "smart-home", name: "Smart Home", icon: Home, desc: "Pilotez toute votre maison" },
  { key: "interrupteurs", name: "Interrupteurs intelligents", icon: ToggleLeft, desc: "Éclairage et circuits à distance" },
  { key: "capteurs", name: "Capteurs & Sécurité", icon: ShieldCheck, desc: "Surveillance et alertes" },
  { key: "prises", name: "Prises intelligentes", icon: Plug, desc: "Pilotez vos appareils branchés" },
  { key: "telecommandes", name: "Télécommandes", icon: RadioTower, desc: "Centralisez vos commandes" },
  { key: "accessoires", name: "Accessoires électroniques", icon: Cpu, desc: "Complétez votre installation" },
];

export const CATEGORY_LABEL: Record<string, string> = CATEGORIES.reduce(
  (acc, c) => { acc[c.key] = c.name; return acc; },
  {} as Record<string, string>
);
