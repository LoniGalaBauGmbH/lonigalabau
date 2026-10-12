import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/integrations/supabase/admin-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { leadQualificationUpdateSchema } from "./lead-qualification";
import { loadLeadQualificationSummary, saveLeadQualification } from "./lead-qualification.server";

export const adminLeadQualificationSummary = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => loadLeadQualificationSummary(supabaseAdmin));
export const adminSetLeadQualification = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => leadQualificationUpdateSchema.parse(input))
  .handler(async ({ data }) => saveLeadQualification(supabaseAdmin, data));
