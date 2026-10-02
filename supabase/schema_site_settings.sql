-- =========================================================================
-- DOMOTEK - TABLE DES PARAMÈTRES DU SITE (RÉSEAUX SOCIAUX & CONTACT)
-- Exécutez ce script dans le SQL Editor de Supabase pour activer la 
-- synchronisation en ligne des réseaux sociaux sur tous les appareils.
-- =========================================================================

-- 1. Création de la table site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Activation de la sécurité RLS (Row Level Security)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Politiques d'accès : Lecture et écriture
DROP POLICY IF EXISTS "Lecture publique site_settings" ON public.site_settings;
CREATE POLICY "Lecture publique site_settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Modification site_settings" ON public.site_settings;
CREATE POLICY "Modification site_settings"
  ON public.site_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Initialisation des réseaux sociaux par défaut de DomoTek (si vide)
INSERT INTO public.site_settings (key, value)
VALUES (
  'social_links',
  '{
    "facebook": "https://facebook.com/domotek.dz",
    "facebookEnabled": true,
    "instagram": "https://instagram.com/domotek.dz",
    "instagramEnabled": true,
    "tiktok": "https://tiktok.com/@domotek.dz",
    "tiktokEnabled": true,
    "whatsapp": "0775 30 26 36",
    "whatsappEnabled": true,
    "whatsappDefaultMsg": "Bonjour DomoTek, j''aimerais avoir des informations sur vos produits.",
    "youtube": "",
    "youtubeEnabled": false,
    "twitter": "",
    "twitterEnabled": false,
    "linkedin": "",
    "linkedinEnabled": false,
    "telegram": "",
    "telegramEnabled": false,
    "email": "contact@domotek.dz",
    "emailEnabled": true,
    "phone": "0775 30 26 36",
    "phoneEnabled": true
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 5. Activation du temps réel pour cette table
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
