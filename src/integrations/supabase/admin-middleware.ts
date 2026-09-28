import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "./auth-middleware";
import { supabaseAdmin } from "./client.server";

// Keep authorization outside handlers so their error handling cannot bypass it.
export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ context, next }) => {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      throw new Error("Die Zugriffsrechte konnten nicht geprüft werden.");
    }
    if (data?.role !== "admin") {
      throw new Error("Für dieses Konto ist kein Adminzugang freigeschaltet.");
    }

    return next();
  });
