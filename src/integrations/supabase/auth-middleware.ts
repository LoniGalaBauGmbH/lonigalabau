import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Authentication must succeed before any protected server function can run.
export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const authorization = getRequest().headers.get("authorization");
    const token = authorization?.match(/^Bearer ([^\s]+)$/i)?.[1];
    if (!token) throw new Error("Bitte melde dich an.");

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      throw new Error("Die Anmeldung ist derzeit nicht verfügbar.");
    }

    const supabase = createClient<Database>(url, key, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Validate against Supabase Auth; never trust a client-supplied user ID.
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user?.id) {
      throw new Error("Deine Sitzung ist ungültig. Bitte melde dich erneut an.");
    }

    return next({ context: { supabase, userId: data.user.id } });
  },
);
