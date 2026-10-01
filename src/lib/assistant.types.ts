export type KnowledgeDocument = {
  id: string;
  title: string;
  category: string;
  source: string;
  content: string;
  approved: boolean;
  version: number;
  updated_at: string;
};
export type KnowledgeSource = {
  documentId: string;
  title: string;
  source: string;
  version: number;
  chunkId: string;
  text?: string;
  score?: number;
};
export type AssistantAnalysis = {
  summary: string;
  category: string;
  knownFacts: string[];
  missingQuestions: string[];
  draft: string;
  visitBriefing: string[];
  needsHumanReview: boolean;
  reviewReason: string;
  sourceIds: string[];
  sources: KnowledgeSource[];
  mode: string;
  inputToken?: string;
  checkedSources?: { documentId: string; version: number }[];
};
export type CaseMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
export type AssistantCase = {
  id: string;
  contact_request_id: string | null;
  title: string;
  customer: string;
  messages: CaseMessage[];
  notes: string;
  draft: string;
  analysis: AssistantAnalysis | null;
  review_on: string | null;
  version: number;
  updated_at: string;
  contact: { name: string; subject: string | null; message: string; notes: string | null } | null;
  knowledgeStale?: boolean;
  analysisStale?: boolean;
  reviewToken: string;
};
