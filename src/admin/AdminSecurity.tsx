import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Clock,
  History,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Smartphone,
  Check,
  X,
  Trash2,
  MessageSquare,
  Send,
} from "lucide-react";
import type { Store } from "../types";
import {
  getSecurityConfig,
  saveSecurityConfig,
  hashPassword,
  generateRandomString,
  getSecurityLogs,
  clearSecurityLogs,
  logSecurityEvent,
  evaluatePasswordStrength,
  terminateAdminSession,
  type SecurityConfig,
  type SecurityLog,
} from "../lib/authSecurity";
import {
  getWhatsAppSettings,
  saveWhatsAppSettings,
  sendOrderWhatsAppNotification,
  type WhatsAppNotificationSettings,
} from "../lib/notifications";

export const AdminSecurity: React.FC<{ s: Store }> = ({ s }) => {
  const [config, setConfig] = useState<SecurityConfig>(getSecurityConfig);
  const [logs, setLogs] = useState<SecurityLog[]>(getSecurityLogs);

  // Form states for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(config.username);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Form states for PIN code
  const [pinEnabled, setPinEnabled] = useState(config.pinEnabled);
  const [pinCode, setPinCode] = useState("");
  const [confirmPinCode, setConfirmPinCode] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");

  // Session & Stealth settings
  const [sessionDuration, setSessionDuration] = useState(config.sessionDurationMinutes);
  const [inactivityTimeout, setInactivityTimeout] = useState(config.inactivityTimeoutMinutes);
  const [stealthMode, setStealthMode] = useState(config.stealthMode);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // WhatsApp Notification settings
  const [waSettings, setWaSettings] = useState<WhatsAppNotificationSettings>(getWhatsAppSettings);
  const [waTestStatus, setWaTestStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [waIsTesting, setWaIsTesting] = useState(false);

  const passStrength = evaluatePasswordStrength(newPassword);

  useEffect(() => {
    setConfig(getSecurityConfig());
    setLogs(getSecurityLogs());
    setWaSettings(getWhatsAppSettings());
  }, []);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");
    setIsUpdatingPass(true);

    try {
      // 1. Check current password
      const currentHash = await hashPassword(currentPassword, config.salt);
      if (currentHash !== config.passwordHash) {
        setPassError("L'ancien mot de passe saisi est incorrect.");
        setIsUpdatingPass(false);
        return;
      }

      // 2. Validate new password
      if (newPassword.length < 8) {
        setPassError("Le nouveau mot de passe doit comporter au moins 8 caractères.");
        setIsUpdatingPass(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setPassError("La confirmation ne correspond pas au nouveau mot de passe.");
        setIsUpdatingPass(false);
        return;
      }

      // 3. Generate new salt and hash
      const newSalt = generateRandomString(16);
      const newHash = await hashPassword(newPassword, newSalt);

      const updatedConfig: SecurityConfig = {
        ...config,
        username: newUsername.trim() || "admin",
        passwordHash: newHash,
        salt: newSalt,
        requirePasswordChange: false,
      };

      saveSecurityConfig(updatedConfig);
      setConfig(updatedConfig);
      logSecurityEvent("PASSWORD_CHANGED", `Identifiants mis à jour pour l'utilisateur: ${updatedConfig.username}`);
      setLogs(getSecurityLogs());

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPassSuccess("Vos identifiants et mot de passe ont été mis à jour avec succès !");
      s.showToast("Identifiants de sécurité mis à jour");
    } catch (err) {
      setPassError("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");

    if (!pinEnabled) {
      const updatedConfig = { ...config, pinEnabled: false };
      saveSecurityConfig(updatedConfig);
      setConfig(updatedConfig);
      logSecurityEvent("PASSWORD_CHANGED", "Double facteur PIN désactivé");
      setPinSuccess("Code PIN désactivé.");
      s.showToast("Code PIN désactivé");
      return;
    }

    if (pinCode.length < 4 || pinCode.length > 8 || !/^\d+$/.test(pinCode)) {
      setPinError("Le code PIN doit comporter entre 4 et 8 chiffres uniquement.");
      return;
    }

    if (pinCode !== confirmPinCode) {
      setPinError("Les codes PIN saisis ne correspondent pas.");
      return;
    }

    const pinSalt = generateRandomString(16);
    const pinHash = await hashPassword(pinCode, pinSalt);

    const updatedConfig: SecurityConfig = {
      ...config,
      pinEnabled: true,
      pinHash,
      pinSalt,
    };

    saveSecurityConfig(updatedConfig);
    setConfig(updatedConfig);
    logSecurityEvent("PASSWORD_CHANGED", "Code PIN de sécurité configuré");
    setLogs(getSecurityLogs());
    setPinCode("");
    setConfirmPinCode("");
    setPinSuccess("Code PIN de sécurité activé avec succès !");
    s.showToast("Code PIN activé");
  };

  const handleSaveSessionSettings = () => {
    const updatedConfig: SecurityConfig = {
      ...config,
      sessionDurationMinutes: Number(sessionDuration),
      inactivityTimeoutMinutes: Number(inactivityTimeout),
      stealthMode,
    };

    saveSecurityConfig(updatedConfig);
    setConfig(updatedConfig);
    setSettingsSaved(true);
    s.showToast("Paramètres de sécurité enregistrés");
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveWhatsAppSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveWhatsAppSettings(waSettings);
    s.showToast("Configuration WhatsApp enregistrée !");
  };

  const handleTestWhatsApp = async () => {
    setWaIsTesting(true);
    setWaTestStatus(null);
    saveWhatsAppSettings(waSettings);

    const testOrder = {
      id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: "Test Notification DomoTek",
      phone: waSettings.phone || "0775302636",
      wilaya: "16 - Alger",
      commune: "Bab Ezzouar",
      address: "Boutique DomoTek (Test Direct)",
      notes: "Ceci est un test de notification automatique WhatsApp.",
      items: [
        { name: "Interrupteur Wi-Fi 2 Voies", qty: 2, price: 3600 },
        { name: "Prise Intelligente 16A", qty: 1, price: 2500 },
      ],
      total: 9700,
      status: "Nouvelle" as const,
      date: new Date().toISOString().slice(0, 10),
    };

    const res = await sendOrderWhatsAppNotification(testOrder);
    setWaIsTesting(false);
    if (res.success) {
      setWaTestStatus({ ok: true, msg: res.message });
      s.showToast("Message WhatsApp de test envoyé !");
    } else {
      setWaTestStatus({ ok: false, msg: res.message });
    }
  };

  const handleClearLogs = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer l'historique du journal de sécurité ?")) {
      clearSecurityLogs();
      setLogs([]);
      s.showToast("Journal de sécurité effacé");
    }
  };

  const handleForceLogoutAll = () => {
    if (window.confirm("Voulez-vous déconnecter immédiatement cette session et forcer une reconnexion ?")) {
      logSecurityEvent("LOGOUT", "Fermeture forcée de la session par l'administrateur");
      terminateAdminSession();
      window.location.reload();
    }
  };

  // Calculate Security Health Score
  const isDefaultPass = config.requirePasswordChange;
  const hasPin = config.pinEnabled;
  const isStealth = config.stealthMode;
  let healthScore = 100;
  if (isDefaultPass) healthScore -= 40;
  if (!hasPin) healthScore -= 15;
  if (!isStealth) healthScore -= 10;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="dk-surface rounded-2xl p-5 sm:p-6 border border-cyan-500/20 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl ${healthScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"}`}>
              {healthScore >= 80 ? <ShieldCheck className="h-7 w-7" /> : <ShieldAlert className="h-7 w-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Centre de Sécurité & Protection</h2>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  healthScore >= 80 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                }`}>
                  Indice de protection : {healthScore}%
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>
                Contrôle d'accès crypté, double facteur, limitation anti force-brute et audit des connexions.
              </p>
            </div>
          </div>

          <button
            onClick={handleForceLogoutAll}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Déconnecter la session</span>
          </button>
        </div>

        {/* Warning if default credentials */}
        {isDefaultPass && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <div>
              <strong className="font-bold">Avertissement de sécurité critique :</strong> Vous utilisez les identifiants par défaut du système (<code className="font-mono bg-black/30 px-1 rounded">admin / admin123</code>). Veuillez définir un nouveau mot de passe fort ci-dessous pour protéger votre boutique.
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Change Username & Password */}
        <div className="dk-surface rounded-2xl p-5 sm:p-6 border space-y-4" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
            <KeyRound className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>Identifiants & Mot de passe Admin</h3>
          </div>

          {passError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <X className="h-4 w-4 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "var(--text)" }}>
                Nom d'utilisateur administrateur
              </label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="dk-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "var(--text)" }}>
                Mot de passe actuel (requis pour confirmer)
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="dk-input w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "var(--text)" }}>
                Nouveau mot de passe fort
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Au moins 8 caractères, majuscule, chiffre..."
                  className="dk-input w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span style={{ color: "var(--text-faint)" }}>Force du mot de passe :</span>
                    <span className="font-bold">{passStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passStrength.color}`}
                      style={{ width: `${passStrength.score}%` }}
                    />
                  </div>
                  {passStrength.feedback.length > 0 && (
                    <p className="text-[10px] text-amber-400">Requis : {passStrength.feedback.join(" • ")}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "var(--text)" }}>
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="dk-input w-full px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPass}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold dk-btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isUpdatingPass ? "Chiffrement et mise à jour..." : "Enregistrer les nouveaux identifiants"}</span>
            </button>
          </form>
        </div>

        {/* Card 2: 2-Step PIN code & Session Security */}
        <div className="space-y-6">
          {/* PIN Verification Section */}
          <div className="dk-surface rounded-2xl p-5 sm:p-6 border space-y-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>Double Facteur PIN (2FA)</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                config.pinEnabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-700 text-slate-300"
              }`}>
                {config.pinEnabled ? "Actif" : "Désactivé"}
              </span>
            </div>

            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Exige un code PIN secret à 4-8 chiffres en complément du mot de passe lors de chaque connexion.
            </p>

            {pinError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <X className="h-4 w-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {pinSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0" />
                <span>{pinSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSavePin} className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinEnabled}
                  onChange={(e) => setPinEnabled(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-500 h-4 w-4 bg-slate-800 border-slate-700"
                />
                <span style={{ color: "var(--text)" }}>Activer la protection par code PIN</span>
              </label>

              {pinEnabled && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold mb-1" style={{ color: "var(--text)" }}>Code PIN (4-8 chiffres)</label>
                    <input
                      type="password"
                      maxLength={8}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="••••"
                      className="dk-input w-full px-3 py-2 rounded-xl text-center font-mono text-sm tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1" style={{ color: "var(--text)" }}>Confirmer le PIN</label>
                    <input
                      type="password"
                      maxLength={8}
                      value={confirmPinCode}
                      onChange={(e) => setConfirmPinCode(e.target.value)}
                      placeholder="••••"
                      className="dk-input w-full px-3 py-2 rounded-xl text-center font-mono text-sm tracking-widest"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl text-xs font-bold border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
              >
                Enregistrer la configuration PIN
              </button>
            </form>
          </div>

          {/* Session Expiry & Stealth Settings */}
          <div className="dk-surface rounded-2xl p-5 sm:p-6 border space-y-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <Clock className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>Sessions & Confidentialité</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                  Durée maximale de validité d'une session
                </label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  className="dk-input w-full px-3 py-2 rounded-xl text-xs"
                >
                  <option value={60}>1 Heure</option>
                  <option value={120}>2 Heures</option>
                  <option value={240}>4 Heures (Recommandé)</option>
                  <option value={480}>8 Heures</option>
                  <option value={1440}>24 Heures</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                  Déconnexion automatique après inactivité
                </label>
                <select
                  value={inactivityTimeout}
                  onChange={(e) => setInactivityTimeout(Number(e.target.value))}
                  className="dk-input w-full px-3 py-2 rounded-xl text-xs"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes (Recommandé)</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stealthMode}
                    onChange={(e) => setStealthMode(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-cyan-500 h-4 w-4 mt-0.5 bg-slate-800 border-slate-700"
                  />
                  <div>
                    <span style={{ color: "var(--text)" }}>Mode Furtif (Accès 100% masqué aux visiteurs)</span>
                    <p className="text-[11px] font-normal mt-0.5" style={{ color: "var(--text-faint)" }}>
                      L'accès administrateur est discret : utilisez le raccourci <code className="font-mono bg-black/20 px-1 rounded">Ctrl + Shift + L</code> ou <code className="font-mono bg-black/20 px-1 rounded">Alt + L</code> (ou triple clic sur le copyright).
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveSessionSettings}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold dk-btn-primary flex items-center justify-center gap-1.5"
              >
                {settingsSaved ? <Check className="h-4 w-4" /> : null}
                <span>{settingsSaved ? "Paramètres enregistrés !" : "Appliquer les paramètres"}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Background Notifications Card */}
          <div className="dk-surface rounded-2xl p-5 sm:p-6 border space-y-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>Notifications WhatsApp en Direct</h3>
                  <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                    Recevez automatiquement chaque commande client sur votre téléphone.
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  waSettings.enabled
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {waSettings.enabled ? "Activé" : "Désactivé"}
              </span>
            </div>

            {waTestStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  waTestStatus.ok
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {waTestStatus.ok ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />}
                <span>{waTestStatus.msg}</span>
              </div>
            )}

            <form onSubmit={handleSaveWhatsAppSettings} className="space-y-3.5">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={waSettings.enabled}
                  onChange={(e) => setWaSettings({ ...waSettings, enabled: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-500 h-4 w-4 bg-slate-800 border-slate-700"
                />
                <span style={{ color: "var(--text)" }}>Activer l'envoi automatique sur WhatsApp</span>
              </label>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text)" }}>
                  Numéro WhatsApp destinataire (avec indicatif pays)
                </label>
                <input
                  type="text"
                  required
                  placeholder="213775302636"
                  value={waSettings.phone}
                  onChange={(e) => setWaSettings({ ...waSettings, phone: e.target.value })}
                  className="dk-input w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold"
                />
                <p className="text-[10px] mt-1" style={{ color: "var(--text-faint)" }}>
                  Exemple : <code className="font-mono">213775302636</code> (Algérie +213 sans le 0 au début).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                  Méthode de livraison WhatsApp
                </label>
                <select
                  value={waSettings.provider}
                  onChange={(e) =>
                    setWaSettings({
                      ...waSettings,
                      provider: e.target.value as "callmebot" | "webhook" | "greenapi",
                    })
                  }
                  className="dk-input w-full px-3 py-2 rounded-xl text-xs"
                >
                  <option value="callmebot">CallMeBot WhatsApp (Gratuit / Immédiat)</option>
                  <option value="webhook">Webhook / Supabase Edge Function</option>
                  <option value="greenapi">Green-API WhatsApp</option>
                </select>
              </div>

              {waSettings.provider === "callmebot" && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[11px]" style={{ color: "var(--text)" }}>
                      Clé API CallMeBot (Gratuite)
                    </label>
                    <a
                      href="https://www.callmebot.com/blog/free-api-whatsapp-messages/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Comment obtenir ma clé en 1 min ?
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="Ex : 1234567"
                    value={waSettings.callmebotApiKey || ""}
                    onChange={(e) => setWaSettings({ ...waSettings, callmebotApiKey: e.target.value })}
                    className="dk-input w-full px-3 py-1.5 rounded-lg text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    💡 Pour obtenir votre clé gratuite : envoyez le message <code className="font-mono bg-black/40 text-emerald-400 px-1 rounded">I allow callmebot to send me messages</code> par WhatsApp au numéro <code className="font-mono text-cyan-300">+34 644 44 24 53</code>. Le bot vous répondra instantanément avec votre clé API.
                  </p>
                </div>
              )}

              {waSettings.provider === "webhook" && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs">
                  <label className="block font-bold text-[11px]" style={{ color: "var(--text)" }}>
                    URL du Webhook / Supabase Edge Function
                  </label>
                  <input
                    type="url"
                    placeholder="https://votre-projet.functions.supabase.co/notify-order-whatsapp"
                    value={waSettings.webhookUrl || ""}
                    onChange={(e) => setWaSettings({ ...waSettings, webhookUrl: e.target.value })}
                    className="dk-input w-full px-3 py-1.5 rounded-lg text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-400">
                    Déployez la fonction Deno fournie dans <code className="font-mono text-cyan-300">supabase/functions/notify-order-whatsapp</code>.
                  </p>
                </div>
              )}

              {waSettings.provider === "greenapi" && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[11px] mb-1" style={{ color: "var(--text)" }}>
                        Instance ID
                      </label>
                      <input
                        type="text"
                        placeholder="1101823..."
                        value={waSettings.greenApiInstanceId || ""}
                        onChange={(e) => setWaSettings({ ...waSettings, greenApiInstanceId: e.target.value })}
                        className="dk-input w-full px-3 py-1.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[11px] mb-1" style={{ color: "var(--text)" }}>
                        API Token
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={waSettings.greenApiToken || ""}
                        onChange={(e) => setWaSettings({ ...waSettings, greenApiToken: e.target.value })}
                        className="dk-input w-full px-3 py-1.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold dk-btn-primary flex items-center justify-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Enregistrer la config</span>
                </button>

                <button
                  type="button"
                  disabled={waIsTesting}
                  onClick={handleTestWhatsApp}
                  className="py-2 px-3.5 rounded-xl text-xs font-bold border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50 transition-all"
                  title="Envoyer un message de test sur votre WhatsApp"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{waIsTesting ? "Envoi..." : "Tester"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Card 3: Security Audit Logs */}
      <div className="dk-surface rounded-2xl p-5 sm:p-6 border space-y-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>Journal d'Audit & Tentatives de Connexion</h3>
              <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                Historique des 50 derniers événements de sécurité enregistrés sur votre navigateur.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogs(getSecurityLogs())}
              className="p-2 rounded-lg dk-surface border hover:border-cyan-500/50 transition-colors text-xs flex items-center gap-1"
              style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
              title="Actualiser"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleClearLogs}
              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors text-xs flex items-center gap-1 font-semibold"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Effacer le journal</span>
            </button>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8 text-xs" style={{ color: "var(--text-faint)" }}>
            Aucun événement de sécurité enregistré pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-[11px] font-bold" style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}>
                  <th className="py-2.5 px-3">Date & Heure</th>
                  <th className="py-2.5 px-3">Type d'événement</th>
                  <th className="py-2.5 px-3">Détails</th>
                  <th className="py-2.5 px-3">Appareil / Navigateur</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {logs.map((log) => {
                  let badge = "bg-slate-700 text-slate-300";
                  if (log.type === "LOGIN_SUCCESS") badge = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                  if (log.type === "LOGIN_FAILED" || log.type === "PIN_FAILED") badge = "bg-red-500/20 text-red-400 border border-red-500/30";
                  if (log.type === "LOCKOUT") badge = "bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold";
                  if (log.type === "PASSWORD_CHANGED") badge = "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";

                  return (
                    <tr key={log.id} className="hover:bg-cyan-500/5 transition-colors">
                      <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                        {new Date(log.timestamp).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${badge}`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-medium" style={{ color: "var(--text)" }}>
                        {log.details}
                      </td>
                      <td className="py-2 px-3 text-[11px] truncate max-w-[200px]" style={{ color: "var(--text-faint)" }}>
                        {log.userAgent || "Navigateur web standard"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
