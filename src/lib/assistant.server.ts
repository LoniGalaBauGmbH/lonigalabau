import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { analyzeProject } from "./assistant-engine.server.mjs";
import type { AssistantCase, KnowledgeDocument, KnowledgeSource } from "./assistant.types";

// Server-only adapter. New private tables are isolated from the generated public-content types.
const db = supabaseAdmin as unknown as SupabaseClient;
const CASE_FIELDS =
  "id,contact_request_id,title,customer,messages,notes,draft,analysis,review_on,version,updated_at,contact:contact_requests(name,subject,message,notes)";
const DOC_FIELDS = "id,title,category,source,content,approved,version,updated_at";
export const idSchema = z.object({ id: z.string().uuid() }).strict();
export const changeSchema = idSchema.extend({ version: z.number().int().positive() }).strict();
export const documentSchema = z
  .object({
    id: z.string().uuid().optional(),
    version: z.number().int().positive().optional(),
    title: z.string().trim().min(1).max(180),
    category: z.string().trim().min(1).max(80),
    source: z.string().trim().max(500),
    content: z.string().trim().min(1).max(200000),
    approved: z.boolean(),
  })
  .strict()
  .refine((v) => !v.id || !!v.version, "Version fehlt.");
export const caseSchema = z
  .object({
    title: z.string().trim().min(1).max(180),
    customer: z.string().trim().max(180),
    content: z.string().trim().min(1).max(20000),
  })
  .strict();
export const saveCaseSchema = changeSchema
  .extend({
    notes: z.string().trim().max(20000),
    draft: z.string().trim().max(12000),
    review_on: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
  })
  .strict();
export const messageSchema = changeSchema
  .extend({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(20000) })
  .strict();

function check(error: unknown) {
  if (error) throw new Error("Die Daten konnten nicht verarbeitet werden. Bitte erneut versuchen.");
}
function conflict() {
  throw new Error(
    "Der Eintrag wurde zwischenzeitlich geändert oder gelöscht. Bitte neu laden; Ihre Eingaben bleiben zum Kopieren erhalten.",
  );
}
export function assistantConfiguration() {
  const ready =
    process.env.LONI_AI_ENABLED === "true" &&
    process.env.LONI_AI_PROCESSING_APPROVED === "true" &&
    !!process.env.OPENAI_API_KEY &&
    !!process.env.OPENAI_MODEL &&
    ["eu", "global"].includes(process.env.LONI_AI_REGION ?? "");
  return {
    aiReady: ready,
    region: ready ? process.env.LONI_AI_REGION : null,
    mailConnected: false,
    oneDriveConnected: false,
    serverConnected: false,
  };
}
export async function listCases() {
  const { data, error } = await db
    .from("assistant_cases")
    .select(
      "id,contact_request_id,title,customer,review_on,version,updated_at,contact:contact_requests(name,subject)",
    )
    .order("updated_at", { ascending: false })
    .limit(200);
  check(error);
  return (data ?? []).map((row) => {
    const contact = row.contact as unknown as { name: string; subject: string | null } | null;
    return {
      ...row,
      title: contact?.subject || row.title || "Website-Anfrage",
      customer: contact?.name || row.customer,
    };
  });
}
export async function getCase(id: string): Promise<AssistantCase> {
  const { data, error } = await db
    .from("assistant_cases")
    .select(CASE_FIELDS)
    .eq("id", id)
    .maybeSingle();
  check(error);
  if (!data) throw new Error("Vorgang nicht gefunden.");
  const item = data as unknown as AssistantCase;
  item.title = item.contact?.subject || item.title || "Website-Anfrage";
  item.customer = item.contact?.name || item.customer;
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(
      JSON.stringify({
        title: item.title,
        contact: item.contact,
        messages: item.messages,
        notes: item.notes,
      }),
    ),
  );
  item.reviewToken = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  item.analysisStale = !!item.analysis && item.analysis.inputToken !== item.reviewToken;
  if (item.analysis) {
    const sources = item.analysis.checkedSources ?? item.analysis.sources ?? [];
    const ids = [...new Set(sources.map((s) => s.documentId))];
    const docs = ids.length
      ? await db.from("assistant_documents").select("id,version,approved").in("id", ids)
      : { data: [], error: null };
    check(docs.error);
    item.knowledgeStale = sources.some(
      (s) =>
        !docs.data?.some((d) => d.id === s.documentId && d.version === s.version && d.approved),
    );
  }
  return item;
}
export async function createCase(input: z.infer<typeof caseSchema>, actor: string) {
  const { data, error } = await db
    .from("assistant_cases")
    .insert({
      title: input.title,
      customer: input.customer,
      messages: [
        {
          id: crypto.randomUUID(),
          role: "user",
          content: input.content,
          createdAt: new Date().toISOString(),
        },
      ],
      updated_by: actor,
    })
    .select("id")
    .single();
  check(error);
  return data!.id as string;
}
export async function listContactCandidates() {
  const { data, error } = await db
    .from("contact_requests")
    .select("id,name,subject,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  check(error);
  return data ?? [];
}
export async function openContact(id: string, actor: string) {
  const prior = await db
    .from("assistant_cases")
    .select("id")
    .eq("contact_request_id", id)
    .maybeSingle();
  check(prior.error);
  if (prior.data) return prior.data.id as string;
  const result = await db
    .from("assistant_cases")
    .insert({ contact_request_id: id, updated_by: actor })
    .select("id")
    .single();
  if (result.error?.code === "23505") {
    const existing = await db
      .from("assistant_cases")
      .select("id")
      .eq("contact_request_id", id)
      .single();
    check(existing.error);
    return existing.data!.id as string;
  }
  check(result.error);
  return result.data!.id as string;
}
export async function saveCase(input: z.infer<typeof saveCaseSchema>, actor: string) {
  const { id, version, ...changes } = input;
  const result = await db
    .from("assistant_cases")
    .update({ ...changes, updated_by: actor })
    .eq("id", id)
    .eq("version", version)
    .select("id")
    .maybeSingle();
  check(result.error);
  if (!result.data) conflict();
  return getCase(id);
}
export async function appendMessage(input: z.infer<typeof messageSchema>, actor: string) {
  const item = await getCase(input.id);
  if (item.version !== input.version) conflict();
  if (item.messages.length >= 100)
    throw new Error(
      "Dieser Vorgang hat die maximale Verlaufslänge erreicht. Bitte einen Folge-Vorgang anlegen.",
    );
  const messages = [
    ...item.messages,
    {
      id: crypto.randomUUID(),
      role: input.role,
      content: input.content,
      createdAt: new Date().toISOString(),
    },
  ];
  if (new TextEncoder().encode(JSON.stringify(messages)).length > 155000)
    throw new Error("Der Verlauf ist zu umfangreich. Bitte einen Folge-Vorgang anlegen.");
  const result = await db
    .from("assistant_cases")
    .update({ messages, updated_by: actor })
    .eq("id", input.id)
    .eq("version", input.version)
    .select("id")
    .maybeSingle();
  check(result.error);
  if (!result.data) conflict();
  return getCase(input.id);
}
export async function deleteCase(input: z.infer<typeof changeSchema>) {
  const result = await db
    .from("assistant_cases")
    .delete()
    .eq("id", input.id)
    .eq("version", input.version)
    .select("id")
    .maybeSingle();
  check(result.error);
  if (!result.data) conflict();
  return { ok: true };
}
export async function listDocuments() {
  const { data, error } = await db
    .from("assistant_documents")
    .select("id,title,category,source,approved,version,updated_at")
    .order("updated_at", { ascending: false })
    .limit(500);
  check(error);
  return data ?? [];
}
export async function getDocument(id: string): Promise<KnowledgeDocument> {
  const { data, error } = await db
    .from("assistant_documents")
    .select(DOC_FIELDS)
    .eq("id", id)
    .maybeSingle();
  check(error);
  if (!data) throw new Error("Dokument nicht gefunden.");
  return data as KnowledgeDocument;
}
export async function saveDocument(input: z.infer<typeof documentSchema>, actor: string) {
  const { id, version, ...record } = input;
  const query = id
    ? db
        .from("assistant_documents")
        .update({ ...record, updated_by: actor })
        .eq("id", id)
        .eq("version", version!)
    : db.from("assistant_documents").insert({ ...record, updated_by: actor });
  const result = await query.select(DOC_FIELDS).maybeSingle();
  check(result.error);
  if (!result.data) conflict();
  return result.data as KnowledgeDocument;
}
export async function deleteDocument(input: z.infer<typeof changeSchema>) {
  const result = await db
    .from("assistant_documents")
    .delete()
    .eq("id", input.id)
    .eq("version", input.version)
    .select("id")
    .maybeSingle();
  check(result.error);
  if (!result.data) conflict();
  return { ok: true };
}
export async function searchKnowledge(query: string): Promise<KnowledgeSource[]> {
  const { data, error } = await db.rpc("assistant_search", { p_query: query });
  check(error);
  const terms = query.toLocaleLowerCase("de").match(/[\p{L}\p{N}]{3,}/gu) ?? [];
  return ((data ?? []) as KnowledgeDocument[]).map((doc) => {
    // Expose a bounded passage, never an entire document or a second customer record.
    const chunks = [];
    for (let i = 0; i < doc.content.length; i += 1400) {
      const text = doc.content.slice(i, i + 1800);
      const lower = text.toLocaleLowerCase("de");
      chunks.push({
        text,
        index: i,
        score: terms.reduce((s, t) => s + (lower.includes(t) ? 1 : 0), 0),
      });
    }
    chunks.sort((a, b) => b.score - a.score || a.index - b.index);
    const best = chunks[0];
    return {
      documentId: doc.id,
      title: doc.title,
      source: doc.source,
      version: doc.version,
      chunkId: `${doc.id}:v${doc.version}:${best.index}`,
      text: best.text,
      score: best.score,
    };
  });
}
export async function runAnalysis(
  input: z.infer<typeof changeSchema> & { reviewToken: string },
  actor: string,
) {
  if (!assistantConfiguration().aiReady)
    throw new Error(
      "Die KI-Verbindung wird nach der Datenschutz- und Anbieter-Einrichtung freigeschaltet.",
    );
  const item = await getCase(input.id);
  if (item.version !== input.version || item.reviewToken !== input.reviewToken) conflict();
  const token = crypto.randomUUID(),
    now = new Date();
  const acquired = await db
    .from("assistant_cases")
    .update({
      run_token: token,
      run_until: new Date(now.getTime() + 300000).toISOString(),
      last_run_at: now.toISOString(),
    })
    .eq("id", item.id)
    .eq("version", item.version)
    .or(`run_until.is.null,run_until.lt.${now.toISOString()}`)
    .or(`last_run_at.is.null,last_run_at.lt.${new Date(now.getTime() - 60000).toISOString()}`)
    .select("id")
    .maybeSingle();
  check(acquired.error);
  if (!acquired.data)
    throw new Error(
      "Die Anfrage wird bereits bearbeitet oder wurde vor kurzem analysiert. Bitte eine Minute warten.",
    );
  try {
    // The displayed, confirmed input is minimized: no address/email/phone fields or attachments.
    // Free text can still contain personal data; the UI requires review before each API run.
    const project = {
      title: item.title,
      customer: "Kunde",
      notes: [item.contact?.notes, item.notes].filter(Boolean).join("\n"),
      messages: [
        ...(item.contact ? [{ role: "user", content: item.contact.message }] : []),
        ...item.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    };
    const endpoint =
      process.env.LONI_AI_REGION === "eu"
        ? "https://eu.api.openai.com/v1/responses"
        : "https://api.openai.com/v1/responses";
    const checkedSources = new Map<string, { documentId: string; version: number }>();
    const result = await analyzeProject({
      projectId: item.id,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
      store: {
        getProject: () => project,
        searchKnowledge: async (query: string) => {
          const results = await searchKnowledge(query);
          for (const source of results) {
            const previous = checkedSources.get(source.documentId);
            if (previous && previous.version !== source.version) conflict();
            checkedSources.set(source.documentId, {
              documentId: source.documentId,
              version: source.version,
            });
          }
          return results;
        },
      },
      fetchImpl: (_url, options) => fetch(endpoint, { ...options, redirect: "error" }),
    });
    // Store only source references. Revoked/deleted document text is never retained in analyses.
    result.sources = result.sources.map(
      ({ text: _text, score: _score, ...reference }) => reference,
    );
    result.inputToken = item.reviewToken;
    result.checkedSources = [...checkedSources.values()];
    const saved = await db.rpc("assistant_finish_run", {
      p_id: item.id,
      p_token: token,
      p_version: item.version,
      p_contact: item.contact,
      p_result: result,
      p_actor: actor,
    });
    check(saved.error);
    if (!saved.data) conflict();
    return getCase(item.id);
  } finally {
    await db
      .from("assistant_cases")
      .update({ run_token: null, run_until: null })
      .eq("id", item.id)
      .eq("run_token", token);
  }
}
export async function listAudit() {
  const { data, error } = await db
    .from("assistant_audit")
    .select("id,entity_type,action,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  check(error);
  return data ?? [];
}
