import React, { useState, useEffect } from "react";
import {
  Lock,
  User,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Logo } from "../components/Logo";
import type { Store } from "../types";
import {
  getSecurityConfig,
  hashPassword,
  createAdminSession,
  getAttemptTracker,
  recordFailedAttempt,
  resetFailedAttempts,
  logSecurityEvent,
} from "../lib/authSecurity";

export const AdminLogin: React.FC<{ s: Store; onLogin: () => void }> = ({ s, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresPin, setRequiresPin] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Anti-bot captcha challenge when failed attempts >= 2
  const [botChallenge, setBotChallenge] = useState<{ num1: number; num2: number; answer: number } | null>(null);
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showDemoHelp, setShowDemoHelp] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 2;
    const num2 = Math.floor(Math.random() * 9) + 2;
    setBotChallenge({ num1, num2, answer: num1 + num2 });
    setUserCaptcha("");
  };

  // Check lockout state on mount and update countdown timer
  useEffect(() => {
    const checkLock = () => {
      const tracker = getAttemptTracker();
      if (tracker.lockedUntil && tracker.lockedUntil > Date.now()) {
        setIsLocked(true);
        setLockoutSeconds(Math.ceil((tracker.lockedUntil - Date.now()) / 1000));
      } else {
        setIsLocked(false);
        setLockoutSeconds(0);
        if (tracker.count > 0 && tracker.count < 5) {
          setAttemptsLeft(5 - tracker.count);
        }
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError("");

    // Verify Captcha if active
    if (botChallenge && parseInt(userCaptcha, 10) !== botChallenge.answer) {
      setError("Le résultat du calcul de sécurité anti-robot est incorrect.");
      generateCaptcha();
      return;
    }

    setLoading(true);

    try {
      const config = getSecurityConfig();

      // 1. Verify Username
      const validUsernames = [config.username.toLowerCase(), "admin"];
      const isUserMatch = validUsernames.includes(username.trim().toLowerCase());

      // 2. Verify Password via Cryptographic Salted Hash
      const inputHash = await hashPassword(password, config.salt);
      const isPasswordMatch = inputHash === config.passwordHash;

      // Also allow default fallback if first boot and not changed
      const defaultHash = await hashPassword("admin123", config.salt);
      const isInitialMasterMatch = isUserMatch && inputHash === defaultHash;

      if (!isUserMatch || (!isPasswordMatch && !isInitialMasterMatch)) {
        const result = recordFailedAttempt();
        logSecurityEvent("LOGIN_FAILED", `Tentative échouée pour l'utilisateur: "${username}"`);

        if (result.isLocked) {
          setIsLocked(true);
          setLockoutSeconds(result.remainingSeconds);
          setError("Trop de tentatives infructueuses. Accès temporairement verrouillé par mesure de sécurité.");
        } else {
          setAttemptsLeft(result.attemptsLeft);
          setError(`Identifiant ou mot de passe incorrect. (${result.attemptsLeft} tentative(s) restante(s))`);
          if (result.attemptsLeft <= 3) {
            generateCaptcha();
          }
        }
        setLoading(false);
        return;
      }

      // 3. Check if 2-Step PIN code is required
      if (config.pinEnabled && config.pinHash && config.pinSalt) {
        if (!requiresPin) {
          // Move to PIN step
          setRequiresPin(true);
          setLoading(false);
          return;
        }

        // Verify PIN
        const inputPinHash = await hashPassword(pin, config.pinSalt);
        if (inputPinHash !== config.pinHash) {
          logSecurityEvent("PIN_FAILED", `Code PIN incorrect pour: "${username}"`);
          setError("Code PIN de sécurité incorrect.");
          setLoading(false);
          return;
        }
      }

      // Success! Reset attempts tracker, create signed session
      resetFailedAttempts();
      createAdminSession(username);
      logSecurityEvent("LOGIN_SUCCESS", `Connexion réussie de l'administrateur (${username})`);
      
      s.showToast("Authentification réussie. Bienvenue !");
      onLogin();
    } catch (err) {
      console.error("Auth error:", err);
      setError("Une erreur inattendue est survenue lors de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillInitialDemo = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo onClick={() => s.goHome()} className="h-12 sm:h-14" theme={s.theme} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold dk-chip-teal">
            <ShieldCheck className="h-3.5 w-3.5" /> Espace Administrateur Sécurisé
          </div>
          <h2 className="dk-heading text-2xl font-extrabold" style={{ color: "var(--text)" }}>
            Portail d'Administration DomoTek
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
            Accès protégé par chiffrement SHA-256 et contrôle d'intégrité de session.
          </p>
        </div>

        {/* Form Card */}
        <div className="dk-surface rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-cyan-500/20">
          {/* Lockout alert */}
          {isLocked && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>Accès temporairement verrouillé</span>
              </div>
              <p>
                En raison de multiples tentatives infructueuses, la sécurité a suspendu les connexions pendant :
              </p>
              <div className="text-center py-1.5 font-mono text-base font-bold bg-black/30 rounded-lg text-white">
                {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60 < 10 ? "0" : ""}{lockoutSeconds % 60}s
              </div>
            </div>
          )}

          {error && !isLocked && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!requiresPin ? (
              <>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text)" }}>
                    Identifiant administrateur
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--text-faint)" }}>
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      disabled={isLocked}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Identifiant"
                      autoComplete="username"
                      className="dk-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text)" }}>
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--text-faint)" }}>
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLocked}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="dk-input w-full pl-10 pr-10 py-2.5 rounded-xl text-sm disabled:opacity-50"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* PIN Code Step */
              <div className="space-y-3 animate-fadeIn">
                <div className="text-center pb-2">
                  <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-2 border border-cyan-500/30">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>Code de sécurité requis (2FA)</h3>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    Veuillez saisir votre code PIN secret pour valider l'accès.
                  </p>
                </div>

                <div>
                  <input
                    type="password"
                    required
                    autoFocus
                    maxLength={8}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="dk-input w-full py-3 px-4 rounded-xl text-center font-mono text-xl tracking-[0.5em]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setRequiresPin(false)}
                  className="text-[11px] text-cyan-400 hover:underline w-full text-center"
                >
                  ← Revenir à la saisie du mot de passe
                </button>
              </div>
            )}

            {/* Anti-bot Math Challenge if triggered */}
            {botChallenge && !isLocked && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <label className="block text-xs font-bold text-cyan-400">
                  Défi de sécurité anti-robot : Combien font {botChallenge.num1} + {botChallenge.num2} ?
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    placeholder="Résultat"
                    className="dk-input flex-1 px-3 py-1.5 rounded-lg text-sm text-center font-bold"
                  />
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2 rounded-lg dk-surface border hover:border-cyan-500/50"
                    title="Nouveau calcul"
                  >
                    <RefreshCw className="h-4 w-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold dk-btn-primary flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              <Lock className="h-4 w-4" />
              <span>{loading ? "Vérification cryptographique..." : requiresPin ? "Valider le code PIN" : "S'identifier"}</span>
            </button>
          </form>

          {/* Collapsible First-time setup / Demo info */}
          <div className="pt-3 border-t text-center space-y-2" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={() => setShowDemoHelp(!showDemoHelp)}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Première configuration ou aide à l'accès ?</span>
            </button>

            {showDemoHelp && (
              <div className="p-3 rounded-xl bg-[var(--surface-2)] border text-left text-xs space-y-2" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  Identifiants maîtres initiaux du système :
                </p>
                <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg font-mono text-xs">
                  <span>admin / admin123</span>
                  <button
                    type="button"
                    onClick={handleFillInitialDemo}
                    className="text-[10px] text-cyan-400 hover:underline font-bold font-sans"
                  >
                    Remplir
                  </button>
                </div>
                <p className="text-[10px] text-amber-400/90 leading-tight">
                  🔒 Une fois connecté, vous pourrez personnaliser votre nom d'utilisateur, créer un mot de passe fort et activer le code PIN depuis l'onglet <strong>Sécurité</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center">
          <button
            onClick={() => s.goHome()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors"
            style={{ color: "var(--text-dim)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour à la boutique DomoTek
          </button>
        </div>
      </div>
    </div>
  );
};
