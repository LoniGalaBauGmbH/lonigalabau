import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/integrations/supabase/admin-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { serviceSchema, jobSchema, projectSchema } from "@/lib/validators";
import { notifySavedSubmission } from "@/lib/submission-notification.server";

export const adminSendSubmissionNotification = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) =>
    z
      .object({ table: z.enum(["contact_requests", "applications"]), id: z.string().uuid() })
      .parse(data),
  )
  .handler(({ data }) => notifySavedSubmission(supabaseAdmin, data.table, data.id));

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
      if (error) return [];
      return data ?? [];
    } catch {
      return [];
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
      if (error) return [];
      return data ?? [];
    } catch {
      return [];
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
      if (error) return [];
      return data ?? [];
    } catch {
      return [];
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
      if (error) return [];
      return withDeliveryStatus(data ?? []);
    } catch {
      return [];
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
        path: z.string().regex(/^[0-9a-f-]{36}\.(jpg|png|webp|pdf)$/),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const bucket = supabaseAdmin.storage.from("configurator-images");
    const { data: info } = await bucket.info(data.path);
    const name =
      typeof info?.metadata?.originalName === "string" ? info.metadata.originalName : data.path;
    const { data: signed, error } = await bucket.createSignedUrl(
      data.path,
      60 * 10,
      data.path.endsWith(".pdf") ? { download: name } : undefined,
    );
    if (error) throw new Error("Der Anhang konnte nicht geöffnet werden.");
    return { url: signed.signedUrl, name };
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
      if (error) return [];
      return withDeliveryStatus(data ?? []);
    } catch {
      return [];
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

export const adminSaveNotes = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) =>
    z
      .object({
        table: z.enum(["contact_requests", "applications"]),
        id: z.string().uuid(),
        notes: z.string().max(20000),
        version: z.number().int().min(0),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from(data.table)
      .update({ notes: data.notes, notes_version: data.version + 1 })
      .eq("id", data.id)
      .eq("notes_version", data.version)
      .select("notes_version")
      .maybeSingle();
    if (error) throw new Error("Die Notizen konnten nicht gespeichert werden.");
    if (!row)
      throw new Error(
        "Der Vorgang wurde inzwischen geändert. Bitte neu öffnen und Ihre Notizen abgleichen.",
      );
    return { version: row.notes_version };
  });

export const adminDeleteSubmission = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) =>
    z
      .object({
        table: z.enum(["contact_requests", "applications"]),
        id: z.string().uuid(),
        confirmation: z.literal("LÖSCHEN"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from(data.table)
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Der Vorgang konnte nicht geladen werden.");
    const paths = "image_paths" in row ? row.image_paths : row.cv_path ? [row.cv_path] : [];
    if (paths.length) {
      const { error: storageError } = await supabaseAdmin.storage
        .from(data.table === "applications" ? "cvs" : "configurator-images")
        .remove(paths);
      if (storageError)
        throw new Error(
          "Anhänge konnten nicht vollständig gelöscht werden. Der Vorgang bleibt zur erneuten Bearbeitung erhalten.",
        );
    }
    const { error: deletionError } = await supabaseAdmin
      .from(data.table)
      .delete()
      .eq("id", data.id);
    if (deletionError)
      throw new Error("Der Vorgang konnte nicht gelöscht werden. Bitte erneut versuchen.");
    return { ok: true };
  });

async function withDeliveryStatus<T extends { notification_email_id: string | null }>(rows: T[]) {
  const ids = rows.map((row) => row.notification_email_id).filter((id): id is string => !!id);
  if (!ids.length)
    return rows.map((row) => ({ ...row, notification_status: null as string | null }));
  const { data, error } = await supabaseAdmin
    .from("email_delivery")
    .select("email_id,status")
    .in("email_id", ids);
  const statuses = new Map((data || []).map((row) => [row.email_id, row.status]));
  return rows.map((row) => ({
    ...row,
    notification_status: error ? "unknown" : statuses.get(row.notification_email_id || "") || null,
  }));
}
