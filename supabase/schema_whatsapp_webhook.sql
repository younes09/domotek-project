-- =========================================================================
-- CONFIGURATION DU WEBHOOK SUPABASE POUR LES NOTIFICATIONS WHATSAPP
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase (SQL Editor)
-- =========================================================================

-- 1. Activer l'extension pg_net si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

-- 2. Création de la fonction déclencheur (Trigger Function)
CREATE OR REPLACE FUNCTION public.handle_new_order_whatsapp_webhook()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url text := 'https://VOTRE_PROJET.functions.supabase.co/notify-order-whatsapp';
  service_role_key text := 'VOTRE_SERVICE_ROLE_KEY';
  payload jsonb;
BEGIN
  -- Construire le payload de la commande
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'orders',
    'schema', 'public',
    'record', jsonb_build_object(
      'id', NEW.id,
      'customer_name', NEW.customer_name,
      'phone', NEW.phone,
      'wilaya', NEW.wilaya,
      'commune', NEW.commune,
      'address', NEW.address,
      'notes', NEW.notes,
      'items', NEW.items,
      'total', NEW.total,
      'status', NEW.status,
      'created_at', NEW.created_at
    )
  );

  -- Appel asynchrone non-bloquant vers la fonction Supabase Edge / Webhook
  PERFORM extensions.http_post(
    edge_function_url,
    payload::text,
    'application/json',
    ARRAY[
      extensions.http_header('Authorization', 'Bearer ' || service_role_key),
      extensions.http_header('Content-Type', 'application/json')
    ]
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- En cas d'erreur réseau, ne pas bloquer l'enregistrement de la commande
  RAISE WARNING 'Échec du déclenchement du webhook WhatsApp: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attacher le Trigger à la table 'orders'
DROP TRIGGER IF EXISTS tr_notify_order_whatsapp ON public.orders;

CREATE TRIGGER tr_notify_order_whatsapp
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_order_whatsapp_webhook();
