import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAssistantAdmin } from "@/integrations/supabase/assistant-middleware";
import * as service from "./assistant.server";

export const assistantStatus = createServerFn({ method: "GET" })
  .middleware([requireAssistantAdmin])
  .handler(() => service.assistantConfiguration());
export const assistantCases = createServerFn({ method: "GET" })
  .middleware([requireAssistantAdmin])
  .handler(() => service.listCases());
export const assistantCase = createServerFn({ method: "GET" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.idSchema.parse(d))
  .handler(({ data }) => service.getCase(data.id));
export const assistantCreateCase = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.caseSchema.parse(d))
  .handler(({ data, context }) => service.createCase(data, context.userId));
export const assistantContacts = createServerFn({ method: "GET" })
  .middleware([requireAssistantAdmin])
  .handler(() => service.listContactCandidates());
export const assistantOpenContact = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.idSchema.parse(d))
  .handler(({ data, context }) => service.openContact(data.id, context.userId));
export const assistantSaveCase = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.saveCaseSchema.parse(d))
  .handler(({ data, context }) => service.saveCase(data, context.userId));
export const assistantAppendMessage = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.messageSchema.parse(d))
  .handler(({ data, context }) => service.appendMessage(data, context.userId));
export const assistantDeleteCase = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.changeSchema.parse(d))
  .handler(({ data }) => service.deleteCase(data));
export const assistantDocuments = createServerFn({ method: "GET" })
  .middleware([requireAssistantAdmin])
  .handler(() => service.listDocuments());
export const assistantDocument = createServerFn({ method: "GET" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.idSchema.parse(d))
  .handler(({ data }) => service.getDocument(data.id));
export const assistantSaveDocument = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.documentSchema.parse(d))
  .handler(({ data, context }) => service.saveDocument(data, context.userId));
export const assistantDeleteDocument = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) => service.changeSchema.parse(d))
  .handler(({ data }) => service.deleteDocument(data));
export const assistantSearch = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) =>
    z
      .object({ query: z.string().trim().min(1).max(500) })
      .strict()
      .parse(d),
  )
  .handler(({ data }) => service.searchKnowledge(data.query));
export const assistantAnalyze = createServerFn({ method: "POST" })
  .middleware([requireAssistantAdmin])
  .inputValidator((d: unknown) =>
    service.changeSchema
      .extend({ reviewed: z.literal(true), reviewToken: z.string().regex(/^[a-f0-9]{64}$/) })
      .strict()
      .parse(d),
  )
  .handler(({ data, context }) => service.runAnalysis(data, context.userId));
export const assistantAudit = createServerFn({ method: "GET" })
  .middleware([requireAssistantAdmin])
  .handler(() => service.listAudit());
