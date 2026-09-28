import { createHmac } from "node:crypto";
import { getRequestHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function checkFormQuota(action: "contact" | "application" | "upload" | "newsletter") {
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Das Formular ist vorübergehend nicht verfügbar.");
  // Cloudflare supplies this header. Do not trust user-controlled X-Forwarded-For.
  const address = getRequestHeader("cf-connecting-ip") || "local-or-unidentified";
  const key = createHmac("sha256", secret)
    .update(action + ":" + address)
    .digest("hex");
  const { data, error } = await supabaseAdmin.rpc("consume_form_quota", {
    p_key: key,
    p_limit: action === "upload" ? 20 : 6,
  });
  if (error)
    throw new Error("Das Formular ist vorübergehend nicht verfügbar. Bitte rufen Sie uns an.");
  if (data !== true)
    throw new Error("Zu viele Versuche. Bitte warten Sie 15 Minuten oder rufen Sie uns an.");
}
