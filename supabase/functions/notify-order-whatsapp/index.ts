// Supabase Edge Function: notify-order-whatsapp
// Déclenchée automatiquement lors de l'insertion d'une nouvelle commande dans la table 'orders'
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CALLMEBOT_API_KEY = Deno.env.get("CALLMEBOT_API_KEY") || "";
const NOTIFY_PHONE = Deno.env.get("NOTIFY_WHATSAPP_PHONE") || "213775302636";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = await req.json();
    const record = payload.record || payload.order || payload;

    if (!record || !record.id) {
      return new Response(JSON.stringify({ error: "No order record found in payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const items = Array.isArray(record.items) ? record.items : [];
    const itemsList = items
      .map((it: any) => `• ${it.name}${it.variant ? ` (${it.variant})` : ""} × ${it.qty || 1} (${it.price * (it.qty || 1)} DA)`)
      .join("\n");

    const message = [
      `⚡ *NOUVELLE COMMANDE DOMOTEK (Supabase)*`,
      `━━━━━━━━━━━━━━━━━━━`,
      `📦 *Réf :* \`${record.id}\``,
      `👤 *Client :* ${record.customer_name || record.customerName || "Inconnu"}`,
      `📞 *Téléphone :* ${record.phone || "Non renseigné"}`,
      `📍 *Wilaya :* ${record.wilaya || ""}`,
      `🏙️ *Commune :* ${record.commune || ""}`,
      `🏠 *Adresse :* ${record.address || ""}`,
      record.notes ? `📝 *Notes :* ${record.notes}` : "",
      `━━━━━━━━━━━━━━━━━━━`,
      `🛒 *Articles :*`,
      itemsList,
      `━━━━━━━━━━━━━━━━━━━`,
      `💰 *TOTAL :* *${record.total} DA*`,
      `🚚 *Paiement à la livraison*`,
    ]
      .filter(Boolean)
      .join("\n");

    // Envoi via CallMeBot API si configuré
    if (CALLMEBOT_API_KEY && NOTIFY_PHONE) {
      const cleanPhone = NOTIFY_PHONE.replace(/[^0-9]/g, "");
      const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        cleanPhone
      )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(CALLMEBOT_API_KEY)}`;

      const botRes = await fetch(callmebotUrl);
      const botText = await botRes.text();

      return new Response(
        JSON.stringify({ success: true, provider: "callmebot", response: botText }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order processed by webhook", orderId: record.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
