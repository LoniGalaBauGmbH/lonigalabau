import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { contactSubmissionSchema, applicationSchema, newsletterSchema } from "@/lib/validators";
import { persistContactSubmission } from "@/lib/contact-submission.server";
import { buildPlannerPayload, plannerStateSchema } from "@/lib/garden-planner";
import { contactAttachmentSchema, MAX_CONTACT_FILES } from "@/lib/contact-attachments";
import { publicUploadSchema, preparePublicUpload } from "@/lib/public-upload.server";

export const getServices = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("id,slug,title,category,short_text,hero_image,sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("getServices DB warning:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("getServices fetch failed:", err);
    return [];
  }
});

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { data: svc, error } = await supabaseAdmin
        .from("services")
        .select("*")
        .eq("slug", data.slug)
        .eq("active", true)
        .maybeSingle();
      if (error) {
        console.warn("getServiceBySlug DB warning:", error.message);
        return null;
      }
      return svc;
    } catch (err) {
      console.warn("getServiceBySlug fetch failed:", err);
      return null;
    }
  });

export const getProjectsByService = createServerFn({ method: "GET" })
  .inputValidator((d: { serviceId: string }) => z.object({ serviceId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { data: rows, error } = await supabaseAdmin
        .from("projects")
        .select("id,title,location,description,images,featured")
        .eq("active", true)
        .eq("service_id", data.serviceId)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) {
        console.warn("getProjectsByService DB warning:", error.message);
        return [];
      }
      return rows ?? [];
    } catch (err) {
      console.warn("getProjectsByService fetch failed:", err);
      return [];
    }
  });

export const getRelatedServices = createServerFn({ method: "GET" })
  .inputValidator((d: { excludeSlug: string }) =>
    z.object({ excludeSlug: z.string().min(1).max(120) }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const { data: rows, error } = await supabaseAdmin
        .from("services")
        .select("id,slug,title,category,short_text,hero_image")
        .eq("active", true)
        .neq("slug", data.excludeSlug)
        .order("sort_order", { ascending: true })
        .limit(6);
      if (error) {
        console.warn("getRelatedServices DB warning:", error.message);
        return [];
      }
      return rows ?? [];
    } catch (err) {
      console.warn("getRelatedServices fetch failed:", err);
      return [];
    }
  });

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("id,title,location,description,images,featured,service_id")
      .eq("active", true)
      .filter("images", "neq", "{}")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("getProjects DB warning:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("getProjects fetch failed:", err);
    return [];
  }
});

export const getFeaturedProject = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("id,title,location,description,images")
      .eq("active", true)
      .filter("images", "neq", "{}")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn("getFeaturedProject DB warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("getFeaturedProject fetch failed:", err);
    return null;
  }
});

export const getJobs = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("id,slug,title,location,employment_type,description")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("getJobs DB warning:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("getJobs fetch failed:", err);
    return [];
  }
});

export const getJobBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { data: job, error } = await supabaseAdmin
        .from("jobs")
        .select("*")
        .eq("slug", data.slug)
        .eq("active", true)
        .maybeSingle();
      if (error) {
        console.warn("getJobBySlug DB warning:", error.message);
        return null;
      }
      return job;
    } catch (err) {
      console.warn("getJobBySlug fetch failed:", err);
      return null;
    }
  });

export const createContactRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSubmissionSchema.parse(d))
  .handler(({ data }) => persistContactSubmission(supabaseAdmin, data));

export const createGardenPlannerRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({
    plan: plannerStateSchema,
    attachments: z.array(contactAttachmentSchema).max(MAX_CONTACT_FILES).default([]),
  }).parse(data))
  .handler(({ data }) => persistContactSubmission(supabaseAdmin, {
    ...buildPlannerPayload(data.plan), attachments: data.attachments,
  }));

export const createApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => applicationSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("applications").insert({
      job_id: data.job_id,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      cv_path: data.cv_path || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => newsletterSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email: data.email });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });

export const getSiteImages = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "images")
      .maybeSingle();
    if (error) {
      console.warn("getSiteImages DB warning:", error.message);
      return {};
    }
    return (data?.value ?? {}) as Record<string, string>;
  } catch (err) {
    console.warn("getSiteImages fetch failed:", err);
    return {};
  }
});

// Guest files go to preconfigured private buckets. Never overwrite existing files.
export const publicUploadFile = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => publicUploadSchema.parse(d))
  .handler(async ({ data }) => {
    const file = preparePublicUpload(data);
    const bucket = supabaseAdmin.storage.from(file.bucket);
    const { error } = await bucket.upload(file.path, file.buffer, {
      contentType: file.contentType,
      upsert: false,
    });
    if (error) throw new Error("Upload fehlgeschlagen. Bitte später erneut versuchen.");

    // The uploader may preview their own photo. Store the path, never the expiring URL.
    let url = "";
    if (file.bucket === "configurator-images") {
      const { data: signed, error: signingError } = await bucket.createSignedUrl(
        file.path,
        60 * 60,
      );
      if (signingError) throw new Error("Die Bildvorschau konnte nicht erstellt werden.");
      url = signed.signedUrl;
    }
    return { url, path: file.path };
  });

export const getSitePartners = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "partners")
      .maybeSingle();
    if (error) {
      console.warn("getSitePartners DB warning:", error.message);
      return [];
    }
    return (data?.value ?? []) as Array<{ name: string; src: string }>;
  } catch (err) {
    console.warn("getSitePartners fetch failed:", err);
    return [];
  }
});
