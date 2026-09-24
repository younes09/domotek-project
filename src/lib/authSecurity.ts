/**
 * authSecurity.ts
 * Module de sécurité avancé pour l'authentification et l'accès administrateur DomoTek.
 * - Hachage cryptographique SHA-256 avec Salt
 * - Gestion de sessions sécurisées avec signature, expiration et délai d'inactivité
 * - Protection anti brute-force avec limitation du taux de tentatives et verrouillage temporaire
 * - Option de double facteur PIN
 * - Journalisation des événements de sécurité (Audit logs)
 * - Mode furtif pour masquer les liens administrateurs publics
 */

export interface SecurityConfig {
  username: string;
  passwordHash: string;
  salt: string;
  pinEnabled: boolean;
  pinHash?: string;
  pinSalt?: string;
  stealthMode: boolean; // Masque le bouton admin dans le footer
  sessionDurationMinutes: number; // Durée max de la session (ex: 120 min)
  inactivityTimeoutMinutes: number; // Déconnexion après inactivité (ex: 30 min)
  requirePasswordChange: boolean; // Si mot de passe par défaut
}

export interface SecurityLog {
  id: string;
  timestamp: number;
  type: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "LOCKOUT" | "PASSWORD_CHANGED" | "LOGOUT" | "PIN_FAILED";
  details: string;
  userAgent?: string;
}

export interface AdminSession {
  token: string;
  username: string;
  issuedAt: number;
  expiresAt: number;
  lastActiveAt: number;
  signature: string;
}

const STORAGE_KEYS = {
  CONFIG: "domotek_sec_config_v2",
  SESSION: "domotek_sec_session_v2",
  LOGS: "domotek_sec_logs_v2",
  ATTEMPTS: "domotek_sec_attempts_v2",
};

// Fallback SHA-256 implementation in case crypto.subtle is restricted in non-HTTPS environments
function fallbackSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  
  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0x0bef9a3f, 0xc67178f2
  ];

  let compositeClear = '\x80';
  while ((ascii[lengthProperty] + 1) % 64 !== 56) {
    compositeClear += '\x00';
  }
  ascii += compositeClear;
  while (ascii[lengthProperty] % 64 > 0) {
    ascii += '\x00';
  }

  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15];
      const w2 = w[i - 2];

      const a = hash[0];
      const e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

/**
 * Calcule un hachage cryptographique SHA-256 avec sel
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const combined = `${salt}:${password}:domotek_salt_2026`;
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(combined);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      // Fallback
    }
  }
  return fallbackSha256(combined);
}

/**
 * Génère une chaîne aléatoire sécurisée pour les sels et jetons
 */
export function generateRandomString(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(length);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (val) => chars[val % chars.length]).join("");
  }
  let res = "";
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

// Sel et hash par défaut pour identifiant initial (admin / admin123)
const DEFAULT_SALT = "domotek_master_salt_init";
const DEFAULT_PASS_HASH = fallbackSha256(`${DEFAULT_SALT}:admin123:domotek_salt_2026`);

const INITIAL_CONFIG: SecurityConfig = {
  username: "admin",
  passwordHash: DEFAULT_PASS_HASH,
  salt: DEFAULT_SALT,
  pinEnabled: false,
  stealthMode: false,
  sessionDurationMinutes: 240, // 4 heures
  inactivityTimeoutMinutes: 45, // 45 minutes
  requirePasswordChange: true, // Recommander de changer les identifiants par défaut
};

/**
 * Récupère la configuration de sécurité actuelle
 */
export function getSecurityConfig(): SecurityConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error("Erreur lecture configuration sécurité:", e);
  }
  return INITIAL_CONFIG;
}

/**
 * Enregistre la configuration de sécurité
 */
export function saveSecurityConfig(config: SecurityConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error("Erreur sauvegarde configuration sécurité:", e);
  }
}

/**
 * Gestion du verrouillage et des tentatives infructueuses
 */
export interface AttemptTracker {
  count: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

export function getAttemptTracker(): AttemptTracker {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (saved) {
      const parsed: AttemptTracker = JSON.parse(saved);
      // Si le verrouillage a expiré, réinitialiser
      if (parsed.lockedUntil && Date.now() > parsed.lockedUntil) {
        return { count: 0, lockedUntil: null, lastAttemptAt: Date.now() };
      }
      return parsed;
    }
  } catch {
    // Ignore
  }
  return { count: 0, lockedUntil: null, lastAttemptAt: Date.now() };
}

export function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number; attemptsLeft: number } {
  const tracker = getAttemptTracker();
  const maxAttempts = 5;
  const lockoutDurationMs = 5 * 60 * 1000; // 5 minutes

  tracker.count += 1;
  tracker.lastAttemptAt = Date.now();

  if (tracker.count >= maxAttempts) {
    tracker.lockedUntil = Date.now() + lockoutDurationMs;
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(tracker));
    logSecurityEvent("LOCKOUT", `Trop de tentatives échouées (${tracker.count}). Accès verrouillé pour 5 minutes.`);
    return { isLocked: true, remainingSeconds: 300, attemptsLeft: 0 };
  }

  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(tracker));
  return {
    isLocked: false,
    remainingSeconds: 0,
    attemptsLeft: Math.max(0, maxAttempts - tracker.count),
  };
}

export function resetFailedAttempts(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  } catch {
    // Ignore
  }
}

/**
 * Journalisation des événements de sécurité
 */
export function getSecurityLogs(): SecurityLog[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore
  }
  return [];
}

export function logSecurityEvent(type: SecurityLog["type"], details: string): void {
  try {
    const logs = getSecurityLogs();
    const newLog: SecurityLog = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      type,
      details,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : undefined,
    };
    const updated = [newLog, ...logs].slice(0, 50); // Garde les 50 derniers événements
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error("Impossible d'enregistrer le log de sécurité:", e);
  }
}

export function clearSecurityLogs(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  } catch {
    // Ignore
  }
}

/**
 * Gestion de la session active avec signature
 */
function createSignature(token: string, username: string, expiresAt: number): string {
  return fallbackSha256(`sig:${token}:${username}:${expiresAt}:domotek_session_secret`);
}

export function createAdminSession(username: string): AdminSession {
  const config = getSecurityConfig();
  const token = generateRandomString(32);
  const now = Date.now();
  const expiresAt = now + config.sessionDurationMinutes * 60 * 1000;
  const signature = createSignature(token, username, expiresAt);

  const session: AdminSession = {
    token,
    username,
    issuedAt: now,
    expiresAt,
    lastActiveAt: now,
    signature,
  };

  try {
    sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    // Sauvegarder aussi dans localStorage avec clé signée pour persistance onglet
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (e) {
    console.error("Erreur enregistrement session:", e);
  }

  return session;
}

export function validateCurrentSession(): { valid: boolean; session: AdminSession | null; reason?: string } {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEYS.SESSION) || localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!saved) return { valid: false, session: null, reason: "Aucune session active" };

    const session: AdminSession = JSON.parse(saved);
    const now = Date.now();

    // 1. Vérification de l'intégrité de la signature
    const expectedSig = createSignature(session.token, session.username, session.expiresAt);
    if (session.signature !== expectedSig) {
      terminateAdminSession();
      return { valid: false, session: null, reason: "Signature de session invalide (altération détectée)" };
    }

    // 2. Vérification de l'expiration totale
    if (now > session.expiresAt) {
      terminateAdminSession();
      return { valid: false, session: null, reason: "Session expirée" };
    }

    // 3. Vérification du délai d'inactivité
    const config = getSecurityConfig();
    const inactivityMs = config.inactivityTimeoutMinutes * 60 * 1000;
    if (now - session.lastActiveAt > inactivityMs) {
      terminateAdminSession();
      return { valid: false, session: null, reason: "Session fermée suite à une longue inactivité" };
    }

    return { valid: true, session };
  } catch (e) {
    terminateAdminSession();
    return { valid: false, session: null, reason: "Erreur lecture session" };
  }
}

export function touchAdminSession(): void {
  try {
    const res = validateCurrentSession();
    if (res.valid && res.session) {
      res.session.lastActiveAt = Date.now();
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(res.session));
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(res.session));
    }
  } catch {
    // Ignore
  }
}

export function terminateAdminSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem("domotek_admin_auth"); // Nettoyage de l'ancienne clé non sécurisée
  } catch {
    // Ignore
  }
}

/**
 * Calcul du score de robustesse du mot de passe (0 à 100)
 */
export function evaluatePasswordStrength(password: string): { score: number; label: string; color: string; feedback: string[] } {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 25;
  else feedback.push("Au moins 8 caractères");

  if (password.length >= 12) score += 15;

  if (/[A-Z]/.test(password)) score += 20;
  else feedback.push("Au moins une majuscule");

  if (/[0-9]/.test(password)) score += 20;
  else feedback.push("Au moins un chiffre");

  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  else feedback.push("Au moins un caractère spécial (!@#$...)");

  if (score < 40) return { score, label: "Très faible", color: "text-red-500 bg-red-500", feedback };
  if (score < 65) return { score, label: "Moyen", color: "text-amber-500 bg-amber-500", feedback };
  if (score < 85) return { score, label: "Fort", color: "text-emerald-500 bg-emerald-500", feedback };
  return { score: 100, label: "Excellent", color: "text-cyan-400 bg-cyan-400", feedback: [] };
}
