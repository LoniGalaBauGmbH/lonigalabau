import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  contactSubmissionSchema,
  applicationSubmissionSchema,
  newsletterSchema,
} from "@/lib/validators";
import { persistContactSubmission } from "@/lib/contact-submission.server";
import { persistApplicationSubmission } from "@/lib/application-submission.server";
import { attemptSubmissionEmails } from "@/lib/customer-confirmation.server";
import { buildPlannerPayload, plannerStateSchema } from "@/lib/garden-planner";
import { contactAttachmentSchema, MAX_CONTACT_FILES } from "@/lib/contact-attachments";
import { enforceFormQuota } from "@/lib/form-quota.server";

export const getServices = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("id,slug,title,category,short_text,hero_image,sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("getServices DB warning:", error.message);
      setResponseStatus(503);
      throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
    }
    return data ?? [];
  } catch (err) {
    console.warn("getServices fetch failed:", err);
    setResponseStatus(503);
    throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
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
        setResponseStatus(503);
        throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
      }
      return svc;
    } catch (err) {
      console.warn("getServiceBySlug fetch failed:", err);
      setResponseStatus(503);
      throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
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
        setResponseStatus(503);
        throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
      }
      return rows ?? [];
    } catch (err) {
      console.warn("getProjectsByService fetch failed:", err);
      setResponseStatus(503);
      throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
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
        setResponseStatus(503);
        throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
      }
      return rows ?? [];
    } catch (err) {
      console.warn("getRelatedServices fetch failed:", err);
      setResponseStatus(503);
      throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
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
      setResponseStatus(503);
      throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
    }
    return data ?? [];
  } catch (err) {
    console.warn("getProjects fetch failed:", err);
    setResponseStatus(503);
    throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
  }
});

export const getProjectById = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data: input }) => {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select(
        "id,title,description,location,images,service_id,updated_at,services(slug,title,active)",
      )
      .eq("id", input.id)
      .eq("active", true)
      .maybeSingle();
    if (error) {
      setResponseStatus(503);
      throw new Error("Die Referenzen sind vorübergehend nicht verfügbar.");
    }
    return data?.images?.length ? data : null;
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
      setResponseStatus(503);
      throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
    }
    return data;
  } catch (err) {
    console.warn("getFeaturedProject fetch failed:", err);
    setResponseStatus(503);
    throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
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
      setResponseStatus(503);
      throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
    }
    return data ?? [];
  } catch (err) {
    console.warn("getJobs fetch failed:", err);
    setResponseStatus(503);
    throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
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
        setResponseStatus(503);
        throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
      }
      return job;
    } catch (err) {
      console.warn("getJobBySlug fetch failed:", err);
      setResponseStatus(503);
      throw new Error("Die Inhalte sind vorübergehend nicht verfügbar.");
    }
  });

export const createContactRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSubmissionSchema.parse(d))
  .handler(async ({ data }) => {
    await enforceFormQuota(data.email);
    const result = await persistContactSubmission(supabaseAdmin, data);
    await attemptSubmissionEmails(supabaseAdmin, "contact_requests", result.id);
    return { ok: true };
  });

export const createGardenPlannerRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        plan: plannerStateSchema,
        attachments: z.array(contactAttachmentSchema).max(MAX_CONTACT_FILES).default([]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await enforceFormQuota(data.plan.email);
    const result = await persistContactSubmission(supabaseAdmin, {
      ...buildPlannerPayload(data.plan),
      attachments: data.attachments,
    });
    await attemptSubmissionEmails(supabaseAdmin, "contact_requests", result.id);
    return { ok: true };
  });

export const createApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => applicationSubmissionSchema.parse(d))
  .handler(async ({ data }) => {
    await enforceFormQuota(data.email);
    const result = await persistApplicationSubmission(supabaseAdmin, data);
    await attemptSubmissionEmails(supabaseAdmin, "applications", result.id);
    return { ok: true };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" }).handler(async () => {
  throw new Error("Eine Newsletter-Anmeldung wird derzeit nicht angeboten.");
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
