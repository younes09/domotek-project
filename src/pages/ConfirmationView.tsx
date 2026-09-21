import React from "react";
import { Check } from "lucide-react";
import type { Store } from "../types";

export const ConfirmationView: React.FC<{ s: Store }> = ({ s }) => {
  const o = s.lastOrder;
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="h-14 w-14 rounded-full mx-auto flex items-center justify-center dk-chip-teal"><Check className="h-7 w-7" /></div>
      <h1 className="dk-heading text-xl font-semibold mt-4" style={{ color: "var(--text)" }}>Commande confirmée</h1>
      <p className="text-sm mt-2" style={{ color: "var(--text-dim)" }}>
        {o ? `Votre commande ${o.id} a bien été enregistrée. ` : ""}Un conseiller vous contactera pour confirmer les détails de livraison.
      </p>
      <button onClick={() => s.goHome()} className="mt-6 rounded-xl px-5 py-3 text-sm font-semibold dk-btn-primary">Retour à l'accueil</button>
    </div>
  );
};
