import test from "node:test";
import assert from "node:assert/strict";
import { analyzeProject } from "../src/lib/assistant-engine.server.mjs";
import { createStore } from "./helpers/assistant-store-fixture.mjs";

const SOURCE = {
  documentId: "doc-pflaster",
  title: "Pflasterarbeiten",
  source: "Freigegebener Leistungskatalog",
  version: 2,
  chunkId: "doc-pflaster:v2:1",
  text: "Bei befahrenen Einfahrten Belastung und Entwässerung klären.",
  score: 4,
};
const PROJECT = {
  title: "Einfahrt",
  customer: "Beispielkunde",
  messages: [
    {
      role: "customer",
      content: "80 m² Einfahrt in Mainz, PKW-Nutzung. Welchen Unterbau brauche ich?",
    },
  ],
  notes: "Vorhandener Belag: Betonpflaster.",
  draft: "",
  analysis: null,
};
const ANSWER = {
  summary: "Kundenanfrage zu 80 m² Einfahrt in Mainz.",
  category: "projektanfrage",
  knownFacts: ["Kundenangabe: 80 m² in Mainz, für PKW.", "Notiz: Betonpflaster vorhanden."],
  missingQuestions: ["Wie wird die Einfahrt derzeit entwässert?"],
  draft:
    "Guten Tag, wie wird die Einfahrt derzeit entwässert? Freundliche Grüße, Loni GalaBau GmbH",
  visitBriefing: ["Untergrund und vorhandene Entwässerung vor Ort prüfen."],
  needsHumanReview: false,
  reviewReason: "",
  sourceIds: [SOURCE.chunkId],
};
const config = { apiKey: "offline-test-key", model: "offline-test-model", projectId: "project-1" };

function searchResponse(index = 1, overrides = {}) {
  return {
    status: "completed",
    output: [
      {
        id: `reasoning-${index}`,
        type: "reasoning",
        summary: [],
        encrypted_content: `opaque-${index}`,
      },
      {
        type: "function_call",
        call_id: `call-${index}`,
        name: "search_knowledge",
        arguments: JSON.stringify({ query: "Pflaster Einfahrt PKW Unterbau Entwässerung" }),
        ...overrides,
      },
    ],
  };
}

function answerResponse(answer = ANSWER) {
  return {
    status: "completed",
    output: [
      {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text: JSON.stringify(answer) }],
      },
    ],
  };
}

function setup(responses, options = {}) {
  const requests = [];
  const reads = [];
  const searches = [];
  const project = structuredClone(PROJECT);
  const store = {
    getProject(id) {
      reads.push(id);
      return project;
    },
    searchKnowledge(query, settings) {
      searches.push({ query, settings });
      if (options.searchError) throw new Error("private internal failure");
      return options.sources ?? [structuredClone(SOURCE)];
    },
    updateProject() {
      assert.fail("Der Assistent darf kein Projekt schreiben.");
    },
    saveAnalysis() {
      assert.fail("Der Assistent darf keine Analyse speichern.");
    },
    addKnowledge() {
      assert.fail("Der Assistent darf kein Wissen schreiben.");
    },
  };
  const fetchImpl = async (url, request) => {
    requests.push({ url, ...request, body: JSON.parse(request.body) });
    const next = responses[requests.length - 1];
    assert.ok(next, "Kein zusätzlicher, unscripteter Netzwerkaufruf erlaubt.");
    if (next instanceof Error) throw next;
    return next.http ?? { ok: true, status: 200, json: async () => structuredClone(next) };
  };
  return { store, fetchImpl, requests, reads, searches, project };
}

test("sucht dynamisch, übernimmt Projektkontext und liefert nur gesehene Versionsquellen", async () => {
  const fixture = setup([searchResponse(), answerResponse()]);
  const result = await analyzeProject({ ...config, ...fixture });
  assert.equal(result.mode, "ai");
  assert.equal(result.draft, ANSWER.draft);
  assert.deepEqual(result.sources, [SOURCE]);
  assert.deepEqual(fixture.reads, ["project-1"]);
  assert.deepEqual(fixture.searches, [
    { query: "Pflaster Einfahrt PKW Unterbau Entwässerung", settings: { limit: 6 } },
  ]);
  assert.deepEqual(fixture.project, PROJECT);
  const [first, second] = fixture.requests;
  assert.equal(first.url, "https://api.openai.com/v1/responses");
  assert.equal(first.redirect, "error");
  assert.equal(first.body.store, false);
  assert.deepEqual(first.body.tool_choice, { type: "function", name: "search_knowledge" });
  assert.equal(first.body.parallel_tool_calls, false);
  assert.equal(first.body.text.format.strict, true);
  assert.match(first.body.input[0].content, /Betonpflaster/);
  assert.doesNotMatch(first.body.input[0].content, /Freigegebener Leistungskatalog/);
  assert.deepEqual(second.body.input[1], searchResponse().output[0]);
  assert.equal(second.body.input[2].call_id, "call-1");
  assert.equal(second.body.input[3].call_id, "call-1");
  assert.deepEqual(JSON.parse(second.body.input[3].output).sources, [SOURCE]);
  assert.equal(second.body.previous_response_id, undefined);
  assert.equal(second.body.store, false);
  assert.deepEqual(second.body.include, ["reasoning.encrypted_content"]);
});

test("ohne Schlüssel oder Modell erfolgen keine Store- oder Netzwerkaufrufe", async () => {
  for (const missing of [{ apiKey: undefined }, { apiKey: "  " }, { model: "" }]) {
    const fixture = setup([]);
    await assert.rejects(analyzeProject({ ...config, ...fixture, ...missing }), {
      code: "AI_NOT_CONNECTED",
    });
    assert.equal(fixture.requests.length, 0);
    assert.equal(fixture.reads.length, 0);
    assert.equal(fixture.searches.length, 0);
  }
});

test("erfundene Quellen werden verworfen statt als Beleg ausgegeben", async () => {
  const fixture = setup([
    searchResponse(),
    answerResponse({ ...ANSWER, sourceIds: ["private-other-project"] }),
  ]);
  await assert.rejects(analyzeProject({ ...config, ...fixture }), { code: "AI_INVALID_SOURCES" });
});

test("unbekannte Werkzeuge und fremde Projektparameter bleiben gesperrt", async () => {
  for (const overrides of [
    { name: "send_email" },
    { name: "get_project", arguments: '{"projectId":"other"}' },
    { arguments: '{"query":"Pflaster","projectId":"other"}' },
  ]) {
    const fixture = setup([searchResponse(1, overrides)]);
    await assert.rejects(analyzeProject({ ...config, ...fixture }), (error) =>
      ["AI_TOOL_REJECTED", "AI_INVALID_TOOL_CALL"].includes(error.code),
    );
    assert.deepEqual(fixture.reads, ["project-1"]);
    assert.equal(fixture.searches.length, 0);
    assert.equal(fixture.requests.length, 1);
  }
});

test("Schleife endet spätestens nach fünf Anfragen und vier Suchen", async () => {
  const fixture = setup(Array.from({ length: 5 }, (_, index) => searchResponse(index + 1)));
  await assert.rejects(analyzeProject({ ...config, ...fixture }), { code: "AI_LIMIT_REACHED" });
  assert.equal(fixture.requests.length, 5);
  assert.equal(fixture.searches.length, 4);
  assert.equal(fixture.requests[4].body.tool_choice, "none");
});

test("nach vier Suchschritten bleibt ein strukturierter Abschluss möglich", async () => {
  const fixture = setup([
    ...Array.from({ length: 4 }, (_, index) => searchResponse(index + 1)),
    answerResponse(),
  ]);
  const result = await analyzeProject({ ...config, ...fixture });
  assert.equal(result.summary, ANSWER.summary);
  assert.equal(fixture.requests.length, 5);
  assert.equal(fixture.requests[4].body.tool_choice, "none");
});

test("Antwort ohne vorherige Suche wird nicht angenommen", async () => {
  const fixture = setup([answerResponse()]);
  await assert.rejects(analyzeProject({ ...config, ...fixture }), { code: "AI_SEARCH_REQUIRED" });
});

test("leere Suche bleibt als fehlender Beleg sichtbar und erfordert Prüfung", async () => {
  const fixture = setup([searchResponse(), answerResponse({ ...ANSWER, sourceIds: [] })], {
    sources: [],
  });
  const result = await analyzeProject({ ...config, ...fixture });
  assert.deepEqual(result.sources, []);
  assert.equal(result.needsHumanReview, true);
  assert.match(result.reviewReason, /Keine passende Wissensquelle/);
});

test("automatische Nachrichten erhalten keinen Antwortentwurf", async () => {
  const fixture = setup([
    searchResponse(),
    answerResponse({ ...ANSWER, category: "automatische_nachricht" }),
  ]);
  const result = await analyzeProject({ ...config, ...fixture });
  assert.equal(result.draft, "");
  assert.equal(result.needsHumanReview, true);
});

test("Fehler werden mit stabilen Codes ohne private Rohdaten gemeldet", async () => {
  const cases = [
    [
      {
        status: "completed",
        output: [{ type: "message", content: [{ type: "refusal", refusal: "private detail" }] }],
      },
      "AI_REFUSAL",
    ],
    [{ status: "incomplete", output: [] }, "AI_INCOMPLETE"],
    [{ status: "completed", output: null }, "AI_MALFORMED_RESPONSE"],
    [
      {
        http: {
          ok: true,
          status: 200,
          json: async () => {
            throw new Error("private detail");
          },
        },
      },
      "AI_MALFORMED_RESPONSE",
    ],
    [{ http: { ok: false, status: 401 } }, "AI_AUTH_FAILED"],
    [{ http: { ok: false, status: 429 } }, "AI_RATE_LIMITED"],
    [{ http: { ok: false, status: 500 } }, "AI_PROVIDER_ERROR"],
    [new DOMException("private detail", "TimeoutError"), "AI_TIMEOUT"],
    [new Error("private detail"), "AI_UNAVAILABLE"],
  ];
  for (const [response, code] of cases) {
    const fixture = setup([response]);
    await assert.rejects(
      analyzeProject({ ...config, ...fixture }),
      (error) => error.code === code && !error.message.includes("private"),
    );
  }
});

test("Suchfehler werden nicht als leere fachliche Antwort behandelt", async () => {
  const fixture = setup([searchResponse()], { searchError: true });
  await assert.rejects(analyzeProject({ ...config, ...fixture }), { code: "AI_SEARCH_FAILED" });
  assert.equal(fixture.requests.length, 1);
});

test("mehr als drei Rückfragen, zusätzliche Felder und falsche Datentypen werden abgewiesen", async () => {
  for (const answer of [
    { ...ANSWER, missingQuestions: ["1?", "2?", "3?", "4?"] },
    { ...ANSWER, draft: "1? 2? 3? 4?" },
    { ...ANSWER, missingQuestions: ["1? 2?"] },
    { ...ANSWER, needsHumanReview: "false" },
    { ...ANSWER, sendNow: true },
  ]) {
    const fixture = setup([searchResponse(), answerResponse(answer)]);
    await assert.rejects(analyzeProject({ ...config, ...fixture }), { code: "AI_INVALID_RESULT" });
  }
});

test("Quellenänderung unter derselben chunkId wird erkannt", async () => {
  const fixture = setup([searchResponse(1), searchResponse(2)]);
  let count = 0;
  fixture.store.searchKnowledge = () => [{ ...SOURCE, version: ++count }];
  await assert.rejects(analyzeProject({ ...config, ...fixture }), { code: "AI_SOURCE_CONFLICT" });
});

test("fremde Projekte und übergroßer Kontext werden vor einem KI-Aufruf gestoppt", async () => {
  const missing = setup([]);
  missing.store.getProject = () => null;
  await assert.rejects(analyzeProject({ ...config, ...missing }), { code: "NOT_FOUND" });
  assert.equal(missing.requests.length, 0);
  const huge = setup([]);
  huge.project.notes = "a".repeat(160_001);
  await assert.rejects(analyzeProject({ ...config, ...huge }), { code: "AI_CONTEXT_TOO_LARGE" });
  assert.equal(huge.requests.length, 0);
});

test("Agentengrenze: nur gelieferte Quellen, genau ein Projekt und keine Schreibeffekte", async () => {
  const store = createStore(":memory:");
  try {
    store.saveDocument({
      title: "Interne Pflasterrichtlinie",
      category: "Leistung",
      approved: true,
      content: "Bei einer Einfahrt für PKW sind Unterbau und Entwässerung zu prüfen.",
    });
    store.saveDocument({
      title: "Nicht freigegebener Pflasterpreis",
      category: "Preis",
      approved: false,
      content: "Geheime interne Beispielpreise für PKW-Einfahrten.",
    });
    const project = store.createProject({
      title: "Einfahrt",
      customer: "Beispielkunde",
      content: PROJECT.messages[0].content,
    });
    store.createProject({
      title: "Anderes Projekt",
      customer: "Fremder Kunde",
      content: "Private fremde Kundeninformation.",
    });
    const projectsBefore = store.listProjects();
    const documentsBefore = store.listDocuments();
    let count = 0;
    const fetchImpl = async (_url, request) => {
      const payload = JSON.parse(request.body);
      assert.doesNotMatch(
        request.body,
        /Private fremde Kundeninformation|Geheime interne Beispielpreise/,
      );
      if (++count === 1) return { ok: true, json: async () => searchResponse() };
      const { sources } = JSON.parse(payload.input.at(-1).output);
      assert.equal(sources.length, 1);
      assert.equal(sources[0].title, "Interne Pflasterrichtlinie");
      assert.equal(sources[0].source, "");
      return {
        ok: true,
        json: async () => answerResponse({ ...ANSWER, sourceIds: [sources[0].chunkId] }),
      };
    };
    const result = await analyzeProject({ ...config, store, fetchImpl, projectId: project.id });
    assert.equal(result.sources[0].version, 1);
    assert.equal(result.sources[0].source, "");
    assert.equal(count, 2);
    assert.deepEqual(store.listProjects(), projectsBefore);
    assert.deepEqual(store.listDocuments(), documentsBefore);
  } finally {
    store.close();
  }
});

test("mehr als acht Belege und übergroße Gesamtausgabe werden vor dem Speichern abgelehnt", async () => {
  const tooMany = setup([
    searchResponse(),
    answerResponse({ ...ANSWER, sourceIds: Array(9).fill(SOURCE.chunkId) }),
  ]);
  await assert.rejects(analyzeProject({ ...config, ...tooMany }), { code: "AI_INVALID_RESULT" });
  const oversized = setup([searchResponse(), answerResponse()], {
    sources: [{ ...SOURCE, text: "x".repeat(49_000) }],
  });
  await assert.rejects(analyzeProject({ ...config, ...oversized }), { code: "AI_INVALID_RESULT" });
});

test("Store-Lesefehler verlassen das Modul nur als sichere AI-Fehler", async () => {
  const fixture = setup([]);
  fixture.store.getProject = () => {
    throw new Error("private database path");
  };
  await assert.rejects(
    analyzeProject({ ...config, ...fixture }),
    (error) => error.code === "AI_PROJECT_UNAVAILABLE" && !error.message.includes("private"),
  );
  assert.equal(fixture.requests.length, 0);
});

test("gespeicherte Analysen und Entwürfe schleusen entfernte Quellen nicht in neue Modellanfragen ein", async () => {
  for (const removeSource of ["delete", "unapprove", "replace"]) {
    const store = createStore(":memory:");
    try {
      const previousKnowledge =
        "ALTE_QUELLENREGEL_9876: Jede Einfahrt erhält eine besondere Pflasterprüfung.";
      const previousDraft = "ALTER_ENTWURF_6543 enthält frühere Firmeninformationen.";
      const document = store.saveDocument({
        title: "Pflaster",
        category: "Leistung",
        approved: true,
        content: previousKnowledge,
      });
      const project = store.createProject({
        title: "Einfahrt",
        customer: "Beispielkunde",
        content: PROJECT.messages[0].content,
      });
      let firstCount = 0;
      const firstAnalysis = await analyzeProject({
        ...config,
        store,
        projectId: project.id,
        fetchImpl: async (_url, request) => {
          const payload = JSON.parse(request.body);
          if (++firstCount === 1) return { ok: true, json: async () => searchResponse() };
          const { sources } = JSON.parse(payload.input.at(-1).output);
          return {
            ok: true,
            json: async () =>
              answerResponse({ ...ANSWER, draft: previousDraft, sourceIds: [sources[0].chunkId] }),
          };
        },
      });
      store.updateProject(project.id, { analysis: firstAnalysis, draft: firstAnalysis.draft });
      if (removeSource === "delete") store.deleteDocument(document.id);
      else
        store.saveDocument({
          ...document,
          approved: removeSource !== "unapprove",
          content:
            removeSource === "replace"
              ? "Aktuelle Pflasterregel: Zufahrt dokumentieren."
              : document.content,
        });
      let secondCount = 0;
      await analyzeProject({
        ...config,
        store,
        projectId: project.id,
        fetchImpl: async (_url, request) => {
          assert.ok(
            !request.body.includes(previousKnowledge),
            "Veralteter Quellentext darf nicht erneut an das Modell gelangen.",
          );
          assert.ok(
            !request.body.includes(previousDraft),
            "Frühere Entwürfe dürfen nicht als Firmenwissen weitergereicht werden.",
          );
          const payload = JSON.parse(request.body);
          const context = JSON.parse(payload.input[0].content.split("\n").slice(1).join("\n"));
          assert.deepEqual(Object.keys(context).sort(), ["customer", "messages", "notes", "title"]);
          if (++secondCount === 1) return { ok: true, json: async () => searchResponse() };
          const { sources } = JSON.parse(payload.input.at(-1).output);
          return {
            ok: true,
            json: async () =>
              answerResponse({ ...ANSWER, sourceIds: sources.map((source) => source.chunkId) }),
          };
        },
      });
      assert.equal(secondCount, 2);
    } finally {
      store.close();
    }
  }
});

test("Summary und Entwurf werden vor Rückgabe für persistente Vergleiche normalisiert", async () => {
  const fixture = setup([
    searchResponse(),
    answerResponse({ ...ANSWER, summary: `  ${ANSWER.summary}\n`, draft: `\n${ANSWER.draft}  ` }),
  ]);
  const result = await analyzeProject({ ...config, ...fixture });
  assert.equal(result.summary, ANSWER.summary);
  assert.equal(result.draft, ANSWER.draft);
});
