import type { AssistantAnalysis, KnowledgeSource } from "./assistant.types";
export function analyzeProject(options: {
  store: {
    getProject(id: string): unknown;
    searchKnowledge(query: string, options?: { limit: number }): Promise<KnowledgeSource[]>;
  };
  projectId: string;
  fetchImpl?: typeof fetch;
  apiKey?: string;
  model?: string;
}): Promise<AssistantAnalysis>;
