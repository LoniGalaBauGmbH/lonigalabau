import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/integrations/supabase/admin-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { loadIncomingContactSummary } from "./incoming-contact-summary.server";

export const adminIncomingContactsSummary = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => loadIncomingContactSummary(supabaseAdmin));
