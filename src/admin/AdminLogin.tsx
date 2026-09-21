import React, { useState } from "react";
import { Lock, User, ArrowLeft, ShieldCheck, KeyRound, AlertCircle } from "lucide-react";
import { Logo } from "../components/Logo";
import type { Store } from "../types";

export const AdminLogin: React.FC<{ s: Store; onLogin: () => void }> = ({ s, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      // Demo credentials check: admin / admin123
      if ((username.trim().toLowerCase() === "admin" || username.trim().toLowerCase() === "domotek") && password === "admin123") {
        onLogin();
        s.showToast("Connexion administration réussie");
      } else if (username.trim() && password === "admin123") {
        onLogin();
        s.showToast("Connexion administration réussie");
      } else {
        setError("Identifiant ou mot de passe incorrect. (Démo: admin / admin123)");
      }
      setLoading(false);
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo onClick={() => s.goHome()} className="h-12 sm:h-14" theme={s.theme} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Espace Administrateur Sécurisé
          </div>
          <h2 className="dk-heading text-2xl font-extrabold text-white">
            Connexion au Panel de Gestion
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Gérez vos stocks, commandes et relation client en toute sécurité.
          </p>
        </div>

        {/* Form Card */}
        <div className="dk-surface rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-5 bg-[#1a2235]">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Identifiant</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="dk-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/90 text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="dk-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/90 text-white placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              <span>{loading ? "Vérification..." : "Se connecter"}</span>
            </button>
          </form>

          {/* Demo hint pill */}
          <div className="pt-3 border-t border-slate-800 text-center space-y-2">
            <p className="text-[11px] text-slate-400">Identifiants de démonstration :</p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 transition-all inline-flex items-center gap-1.5"
            >
              <span>Utilisateur : <strong>admin</strong></span>
              <span>•</span>
              <span>Pass : <strong>admin123</strong></span>
            </button>
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center">
          <button
            onClick={() => s.goHome()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour au magasin DomoTek
          </button>
        </div>
      </div>
    </div>
  );
};

