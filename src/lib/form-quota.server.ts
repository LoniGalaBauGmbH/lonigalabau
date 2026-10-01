import { createHmac } from "node:crypto";
import { getRequest, setResponseStatus, setResponseHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export function quotaKey(secret: string, scope: string, value: string) {
  return createHmac("sha256", secret)
    .update(scope + ":" + value)
    .digest("hex");
}

/** Atomic shared limits before storage writes and mail delivery; raw IPs are never stored. */
export async function enforceFormQuota(email: string, phone?: string) {
  const request = getRequest();
  const secret =
    process.env.FORM_RATE_LIMIT_SECRET ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Das Formular ist vorübergehend nicht verfügbar.");
  // Cloudflare overwrites this header at the edge. Never trust user-controlled X-Forwarded-For.
  const address = request.headers.get("cf-connecting-ip") || "unavailable";
  const limits: [string, string, number][] = [
    ["network", address, address === "unavailable" ? 100 : 12],
  ];
  if (email.trim()) limits.push(["email", email.trim().toLowerCase(), 5]);
  if (phone) {
    let normalized = phone.replace(/\D/g, "");
    if (normalized.startsWith("00")) normalized = normalized.slice(2);
    else if (normalized.startsWith("0")) normalized = "49" + normalized.slice(1);
    normalized = normalized.replace(/^490/, "49");
    limits.push(["phone", normalized, 5]);
  }
  for (const [scope, value, limit] of limits) {
    const { data, error } = await supabaseAdmin.rpc("consume_form_quota", {
      p_key: quotaKey(secret, scope, value),
      p_limit: limit,
    });
    if (error) {
      setResponseStatus(503);
      throw new Error(
        "Das Formular ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut oder rufen Sie uns an.",
      );
    }
    if (data !== true) {
      setResponseStatus(429);
      setResponseHeader("Retry-After", "900");
      throw new Error(
        "Zu viele Anfragen in kurzer Zeit. Bitte warten Sie 15 Minuten oder kontaktieren Sie uns telefonisch.",
      );
    }
  }
}
