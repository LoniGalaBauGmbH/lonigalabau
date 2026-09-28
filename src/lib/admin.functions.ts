import { notificationConfigured, notifyNewEntry } from "@/lib/notifications.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/integrations/supabase/admin-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { serviceSchema, jobSchema, projectSchema } from "@/lib/validators";

export const adminWhoami = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => ({ userId: context.userId, isAdmin: true }));

export const adminListServices = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw new Error("Daten konnten nicht geladen werden.");
      return data ?? [];
    } catch {
      throw new Error("Daten konnten nicht geladen werden. Bitte erneut versuchen.");
    }
  });

export const adminUpsertService = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => serviceSchema.parse(d))
  .handler(async ({ data }) => {
    const row = { ...data, hero_image: data.hero_image || null, category: data.category || null };
    if (data.id) {
      const { error } = await supabaseAdmin.from("services").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("services").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteService = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListJobs = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error("Daten konnten nicht geladen werden.");
      return data ?? [];
    } catch {
      throw new Error("Daten konnten nicht geladen werden. Bitte erneut versuchen.");
    }
  });

export const adminUpsertJob = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => jobSchema.parse(d))
  .handler(async ({ data }) => {
    const row = {
      ...data,
      location: data.location || null,
      employment_type: data.employment_type || null,
    };
    if (data.id) {
      const { error } = await supabaseAdmin.from("jobs").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("jobs").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteJob = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("jobs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListProjects = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error("Daten konnten nicht geladen werden.");
      return data ?? [];
    } catch {
      throw new Error("Daten konnten nicht geladen werden. Bitte erneut versuchen.");
    }
  });

export const adminUpsertProject = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => projectSchema.parse(d))
  .handler(async ({ data }) => {
    const row = {
      ...data,
      location: data.location || null,
      service_id: data.service_id ? data.service_id : null,
    };
    if (data.id) {
      const { error } = await supabaseAdmin.from("projects").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("projects").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListApplications = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("applications")
        .select("*, jobs(title, slug)")
        .order("created_at", { ascending: false });
      if (error) throw new Error("Daten konnten nicht geladen werden.");
      return data ?? [];
    } catch {
      throw new Error("Daten konnten nicht geladen werden. Bitte erneut versuchen.");
    }
  });

export const adminCvSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { path: string }) => z.object({ path: z.string().min(1).max(500) }).parse(d))
  .handler(async ({ data }) => {
    const { data: signed, error } = await supabaseAdmin.storage
      .from("cvs")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });

export const adminPhotoSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) =>
    z
      .object({
        path: z.string().regex(/^[0-9a-f-]{36}\.(jpg|png|webp)$/),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { data: signed, error } = await supabaseAdmin.storage
      .from("configurator-images")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw new Error("Das Foto konnte nicht geöffnet werden.");
    return { url: signed.signedUrl };
  });

export const adminUpdateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string; status: string }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "reviewing", "accepted", "rejected"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("applications")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListContacts = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error("Daten konnten nicht geladen werden.");
      return data ?? [];
    } catch {
      throw new Error("Daten konnten nicht geladen werden. Bitte erneut versuchen.");
    }
  });

export const adminUpdateContactStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string; status: string }) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "handled", "archived"]) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("contact_requests")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateSiteImages = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => z.record(z.string().max(2048)).parse(d))
  .handler(async ({ data }) => {
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v && v.trim() !== "") clean[k] = v.trim();
    }
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key: "images", value: clean }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUploadFile = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) =>
    z
      .object({
        bucket: z.enum(["project-images", "service-images"]),
        path: z.string().min(1).max(500),
        base64: z.string().min(1),
        contentType: z.string().min(1).max(100),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const raw = data.base64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(raw, "base64");

    const { error } = await supabaseAdmin.storage.from(data.bucket).upload(data.path, buffer, {
      contentType: data.contentType,
      upsert: true,
    });

    if (error) throw new Error(`Upload fehlgeschlagen: ${error.message}`);

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(data.bucket).getPublicUrl(data.path);

    return { url: publicUrl };
  });

export const adminUpdateSitePartners = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => z.array(z.object({ name: z.string(), src: z.string() })).parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key: "partners", value: data }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateNotes = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) =>
    z
      .object({
        table: z.enum(["contact_requests", "applications"]),
        id: z.string().uuid(),
        notes: z.string().max(20000),
        version: z.number().int().nonnegative(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { data: saved, error } = await supabaseAdmin
      .from(data.table)
      .update({ notes: data.notes, notes_version: data.version + 1 })
      .eq("id", data.id)
      .eq("notes_version", data.version)
      .select("notes, notes_version")
      .maybeSingle();
    if (error) throw new Error("Die Notiz konnte nicht gespeichert werden.");
    if (saved) return { ok: true as const, ...saved };
    const { data: current, error: readError } = await supabaseAdmin
      .from(data.table)
      .select("notes, notes_version")
      .eq("id", data.id)
      .maybeSingle();
    if (readError || !current) throw new Error("Der Datensatz ist nicht mehr verfügbar.");
    return { ok: false as const, ...current };
  });

export const adminNotificationStatus = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const [contacts, applications] = await Promise.all([
      supabaseAdmin
        .from("contact_requests")
        .select("id", { count: "exact", head: true })
        .is("notification_sent_at", null),
      supabaseAdmin
        .from("applications")
        .select("id", { count: "exact", head: true })
        .is("notification_sent_at", null),
    ]);
    if (contacts.error || applications.error)
      throw new Error("Versandstatus konnte nicht geladen werden.");
    return {
      configured: notificationConfigured(),
      pending: (contacts.count || 0) + (applications.count || 0),
    };
  });

export const adminRetryNotifications = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async () => {
    if (!notificationConfigured()) throw new Error("Resend ist noch nicht eingerichtet.");
    let sent = 0;
    for (const table of ["contact_requests", "applications"] as const) {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select("id")
        .is("notification_sent_at", null)
        .order("created_at")
        .limit(5);
      if (error) throw new Error("Ausstehende Meldungen konnten nicht geladen werden.");
      for (const row of data ?? []) if (await notifyNewEntry(table, row.id)) sent++;
    }
    return { sent };
  });
