import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { webcrypto } from "node:crypto";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

// This file can move unchanged from tmp/ to tests/. No live clients, credentials or data.
const require = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);
const USER = "11111111-1111-4111-8111-111111111111";
const CASE = "22222222-2222-4222-8222-222222222222";
const DOC = "33333333-3333-4333-8333-333333333333";
const DOC_2 = "44444444-4444-4444-8444-444444444444";
const TOKEN = "0".repeat(64);
const jwt = (claims) =>
  `header.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.test-signature`;
const CONFIG = {
  SUPABASE_URL: "https://example.invalid",
  SUPABASE_PUBLISHABLE_KEY: "test-publishable",
  LONI_AI_ENABLED: "true",
  LONI_AI_PROCESSING_APPROVED: "true",
  OPENAI_API_KEY: "offline-test-key",
  OPENAI_MODEL: "offline-test-model",
  LONI_AI_REGION: "eu",
};
const INPUTS = {
  assistantStatus: undefined,
  assistantCases: undefined,
  assistantCase: { id: CASE },
  assistantCreateCase: {
    title: "Testanfrage",
    customer: "Fiktiver Kunde",
    content: "Fiktive Nachricht",
  },
  assistantContacts: undefined,
  assistantOpenContact: { id: CASE },
  assistantSaveCase: {
    id: CASE,
    version: 1,
    notes: "Testnotiz",
    draft: "Testentwurf",
    review_on: null,
  },
  assistantAppendMessage: { id: CASE, version: 1, role: "user", content: "Fiktive Ergänzung" },
  assistantDeleteCase: { id: CASE, version: 1 },
  assistantDocuments: undefined,
  assistantDocument: { id: DOC },
  assistantSaveDocument: {
    title: "Testwissen",
    category: "Test",
    source: "Testquelle",
    content: "Fiktiver Inhalt",
    approved: false,
  },
  assistantDeleteDocument: { id: DOC, version: 1 },
  assistantSearch: { query: "Testwissen" },
  assistantAnalyze: { id: CASE, version: 1, reviewed: true, reviewToken: TOKEN },
  assistantAudit: undefined,
};

// Runs the actual TypeScript security chain, validators and service code.
// Only TanStack's transport, Supabase Auth/database and the AI engine boundary are replaced.
function harness(overrides = {}) {
  const state = {
    authorization: `Bearer ${jwt({ aal: "aal2" })}`,
    auth: { data: { user: { id: USER, factors: [{ status: "verified" }] } }, error: null },
    role: { data: { role: "admin" }, error: null },
    env: { ...CONFIG },
    ...overrides,
  };
  const operations = [];
  const modules = new Map();
  function middleware(options = {}) {
    return {
      options,
      middleware: (items) => middleware({ ...options, middleware: items }),
      server: (server) => middleware({ ...options, server }),
    };
  }
  async function run(items, handler) {
    const flatten = (item) => [
      ...(item.options.middleware ?? []).flatMap(flatten),
      item.options.server,
    ];
    const steps = items.flatMap(flatten);
    const advance = (index, context) =>
      index === steps.length
        ? handler(context)
        : steps[index]({
            context,
            next: (options = {}) => advance(index + 1, { ...context, ...options.context }),
          });
    return advance(0, {});
  }
  function serverFn() {
    let middlewares = [],
      validate = (value) => value;
    const builder = {
      middleware(items) {
        middlewares = items;
        return builder;
      },
      inputValidator(validator) {
        validate = validator;
        return builder;
      },
      handler(handler) {
        return (options = {}) =>
          run(middlewares, (context) => handler({ context, data: validate(options.data) }));
      },
    };
    return builder;
  }
  const admin = {
    from(table) {
      operations.push(["table", table]);
      if (table !== "user_roles") {
        if (state.database) return state.database.from(table);
        throw new Error("Business query reached");
      }
      const query = {
        select: () => query,
        eq(key, value) {
          operations.push(["role-filter", key, value]);
          return query;
        },
        async maybeSingle() {
          if (state.role instanceof Error) throw state.role;
          return state.role;
        },
      };
      return query;
    },
    rpc(name, args) {
      operations.push(["rpc", name]);
      if (state.database) return state.database.rpc(name, args);
      throw new Error("Business query reached");
    },
    storage: {
      from() {
        throw new Error("Unexpected private storage access");
      },
    },
  };
  function load(path) {
    if (modules.has(path)) return modules.get(path);
    const module = { exports: {} };
    const { outputText } = ts.transpileModule(readFileSync(new URL(path, root), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      fileName: path,
    });
    const imports = (id) => {
      if (id === "@tanstack/react-start")
        return { createMiddleware: middleware, createServerFn: serverFn };
      if (id === "@tanstack/react-start/server")
        return {
          getRequest: () => ({
            headers: new Headers(
              state.authorization === null ? {} : { authorization: state.authorization },
            ),
          }),
        };
      if (id === "@supabase/supabase-js")
        return {
          createClient: (_url, _key, options) => {
            operations.push(["auth-client", options.global.headers.Authorization]);
            return {
              auth: {
                getUser: async (token) => {
                  operations.push(["verify", token]);
                  if (state.auth instanceof Error) throw state.auth;
                  return state.auth;
                },
              },
            };
          },
        };
      if (id.endsWith("/client.server")) return { supabaseAdmin: admin };
      if (id.endsWith("/assistant-middleware"))
        return load("src/integrations/supabase/assistant-middleware.ts");
      if (id.endsWith("/admin-middleware"))
        return load("src/integrations/supabase/admin-middleware.ts");
      if (id.endsWith("/auth-middleware"))
        return load("src/integrations/supabase/auth-middleware.ts");
      if (id === "./assistant.server") return load("src/lib/assistant.server.ts");
      if (id === "./assistant-engine.server.mjs")
        return {
          analyzeProject: async (options) => {
            operations.push(["ai"]);
            if (state.analyze) return state.analyze(options);
            throw new Error("Unexpected AI engine access");
          },
        };
      if (id === "zod") return require("zod");
      throw new Error(`Unexpected dependency: ${id}`);
    };
    vm.runInNewContext(
      outputText,
      {
        module,
        exports: module.exports,
        require: imports,
        Buffer,
        TextEncoder,
        crypto: webcrypto,
        process: { env: state.env },
        fetch: async () => {
          operations.push(["network"]);
          throw new Error("Network access is forbidden in this test");
        },
      },
      { filename: path },
    );
    modules.set(path, module.exports);
    return module.exports;
  }
  return { state, operations, load, endpoints: () => load("src/lib/assistant.functions.ts") };
}

const privateOperations = (h) =>
  h.operations.filter(
    ([kind, table]) =>
      kind === "rpc" ||
      kind === "ai" ||
      kind === "network" ||
      (kind === "table" && table !== "user_roles"),
  );

for (const [name, overrides, expected] of [
  ["anonymous", { authorization: null }, /melde dich an/],
  [
    "invalid token despite an aal2 payload",
    { auth: { data: { user: null }, error: { message: "invalid signature" } } },
    /Sitzung ist ungültig/,
  ],
  ["non-admin", { role: { data: null, error: null } }, /kein Adminzugang/],
  ["wrong role", { role: { data: { role: "viewer" }, error: null } }, /kein Adminzugang/],
  ["enrolled admin at aal1", { authorization: `Bearer ${jwt({ aal: "aal1" })}` }, /Authenticator/],
  [
    "admin without an enrolled factor",
    {
      authorization: `Bearer ${jwt({ aal: "aal1" })}`,
      auth: { data: { user: { id: USER, factors: [] } }, error: null },
    },
    /Zwei-Faktor/,
  ],
  [
    "admin with an unverified factor",
    {
      authorization: `Bearer ${jwt({ aal: "aal1" })}`,
      auth: { data: { user: { id: USER, factors: [{ status: "unverified" }] } }, error: null },
    },
    /Zwei-Faktor/,
  ],
  [
    "missing assurance claim",
    {
      authorization: `Bearer ${jwt({})}`,
      auth: { data: { user: { id: USER, factors: [] } }, error: null },
    },
    /Zwei-Faktor/,
  ],
  ["auth outage", { auth: new Error("Auth unavailable") }, /Auth unavailable/],
  [
    "role lookup outage",
    { role: new Error("Role database unavailable") },
    /Role database unavailable/,
  ],
  [
    "role lookup error",
    { role: { data: { role: "admin" }, error: { message: "failure" } } },
    /nicht geprüft/,
  ],
  ["missing auth configuration", { env: {} }, /nicht verfügbar/],
]) {
  test(`${name}: every assistant RPC fails before private reads, writes or AI`, async () => {
    const h = harness(overrides),
      endpoints = h.endpoints();
    assert.deepEqual(
      Object.keys(endpoints).sort(),
      Object.keys(INPUTS).sort(),
      "every exported RPC must have a regression fixture",
    );
    for (const [name, endpoint] of Object.entries(endpoints))
      await assert.rejects(endpoint({ data: INPUTS[name] }), expected, name);
    assert.deepEqual(privateOperations(h), []);
  });
}

test("user-editable metadata cannot replace the current database admin role", async () => {
  const h = harness({
    authorization: `Bearer ${jwt({ aal: "aal2", user_metadata: { role: "admin", isAdmin: true } })}`,
    auth: {
      data: {
        user: {
          id: USER,
          factors: [{ status: "verified" }],
          user_metadata: { role: "admin", isAdmin: true },
        },
      },
      error: null,
    },
    role: { data: null, error: null },
  });
  for (const [name, endpoint] of Object.entries(h.endpoints()))
    await assert.rejects(endpoint({ data: INPUTS[name] }), /kein Adminzugang/);
  assert.deepEqual(privateOperations(h), []);
});

test("a verified aal2 admin passes all 16 guards and current-role queries use their verified identity", async () => {
  const h = harness(),
    endpoints = h.endpoints();
  assert.equal(Object.keys(endpoints).length, 16);
  for (const [name, endpoint] of Object.entries(endpoints)) {
    if (name === "assistantStatus") {
      const status = await endpoint();
      assert.equal(status.aiReady, true);
      assert.equal(status.region, "eu");
      assert.doesNotMatch(JSON.stringify(status), /offline-test|OPENAI|SUPABASE/);
    } else await assert.rejects(endpoint({ data: INPUTS[name] }), /Business query reached/, name);
  }
  assert.equal(h.operations.filter(([kind]) => kind === "verify").length, 16);
  assert.equal(
    h.operations.filter(
      ([kind, key, value]) => kind === "role-filter" && key === "user_id" && value === USER,
    ).length,
    16,
  );
  assert.equal(h.operations.filter(([kind]) => kind === "ai" || kind === "network").length, 0);
});

test("role removal between requests is rechecked and cannot use cached authorization", async () => {
  const h = harness();
  assert.equal((await h.endpoints().assistantStatus()).aiReady, true);
  h.state.role = { data: null, error: null };
  await assert.rejects(h.endpoints().assistantStatus(), /kein Adminzugang/);
  assert.equal(h.operations.filter(([kind]) => kind === "verify").length, 2);
});

const blockedConfigs = [
  ...[
    "LONI_AI_ENABLED",
    "LONI_AI_PROCESSING_APPROVED",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
    "LONI_AI_REGION",
  ].map((key) => [key, { ...CONFIG, [key]: undefined }]),
  ["disabled AI", { ...CONFIG, LONI_AI_ENABLED: "false" }],
  ["processing not approved", { ...CONFIG, LONI_AI_PROCESSING_APPROVED: "false" }],
  ["unknown region", { ...CONFIG, LONI_AI_REGION: "other" }],
];
for (const [name, env] of blockedConfigs) {
  test(`${name}: configuration fails closed before reading customer data or invoking AI`, async () => {
    const h = harness({ env });
    const status = await h.endpoints().assistantStatus();
    assert.equal(status.aiReady, false);
    assert.equal(status.region, null);
    await assert.rejects(
      h.endpoints().assistantAnalyze({ data: INPUTS.assistantAnalyze }),
      /freigeschaltet/,
    );
    assert.deepEqual(privateOperations(h), []);
  });
}

test("analysis requires explicit confirmation and a valid review fingerprint; caller cannot inject an actor", async () => {
  for (const patch of [
    { reviewed: false },
    { reviewed: undefined },
    { reviewToken: undefined },
    { reviewToken: "invalid" },
    { actor: "someone-else" },
  ]) {
    const h = harness();
    await assert.rejects(
      h.endpoints().assistantAnalyze({ data: { ...INPUTS.assistantAnalyze, ...patch } }),
      (error) => error.name === "ZodError",
    );
    assert.deepEqual(privateOperations(h), []);
  }
});

function fixtureDatabase() {
  const state = {
    item: {
      id: CASE,
      contact_request_id: DOC,
      title: "",
      customer: "",
      messages: [],
      notes: "Fiktive Notiz",
      draft: "",
      analysis: null,
      review_on: null,
      version: 1,
      updated_at: "2026-10-01T09:00:00Z",
      contact: {
        name: "Testkunde",
        subject: "Testprojekt",
        message: "Fiktive ursprüngliche Nachricht",
        notes: "",
      },
    },
    documents: [
      {
        id: DOC,
        title: "Testquelle A",
        category: "Test",
        content: "Testwissen Pflaster A.",
        source: "Fiktive Quelle",
        approved: true,
        version: 1,
      },
      {
        id: DOC_2,
        title: "Testquelle B",
        category: "Test",
        content: "Testwissen Pflaster B.",
        source: "Fiktive Quelle",
        approved: true,
        version: 2,
      },
    ],
    writes: [],
    finishes: [],
  };
  const database = {
    from(table) {
      let update;
      const result = () => {
        if (table === "assistant_cases")
          return { data: update ? { id: CASE } : structuredClone(state.item), error: null };
        if (table === "assistant_documents")
          return { data: structuredClone(state.documents), error: null };
        throw new Error(`Unexpected fixture table: ${table}`);
      };
      const query = {
        select: () => query,
        eq: () => query,
        in: () => query,
        or: () => query,
        update(value) {
          update = structuredClone(value);
          state.writes.push(update);
          return query;
        },
        maybeSingle: async () => result(),
        then(resolve, reject) {
          return Promise.resolve(result()).then(resolve, reject);
        },
      };
      return query;
    },
    async rpc(name, args) {
      if (name === "assistant_search")
        return { data: structuredClone(state.documents), error: null };
      if (name === "assistant_finish_run") {
        state.finishes.push(structuredClone(args));
        state.item.analysis = structuredClone(args.p_result);
        return { data: true, error: null };
      }
      throw new Error(`Unexpected fixture RPC: ${name}`);
    },
  };
  return { state, database };
}

for (const field of ["message", "notes", "subject"]) {
  test(`changed contact ${field} rejects the previously reviewed context before acquiring a lease or invoking AI`, async () => {
    const fixture = fixtureDatabase(),
      h = harness({ database: fixture.database });
    const shown = await h.endpoints().assistantCase({ data: { id: CASE } });
    assert.match(shown.reviewToken, /^[a-f0-9]{64}$/);
    fixture.state.item.contact[field] += " Nachträglich ergänzt";
    await assert.rejects(
      h
        .endpoints()
        .assistantAnalyze({ data: { ...INPUTS.assistantAnalyze, reviewToken: shown.reviewToken } }),
      /zwischenzeitlich geändert/,
    );
    assert.equal(
      fixture.state.item.version,
      shown.version,
      "contact edit deliberately leaves the case revision unchanged",
    );
    assert.deepEqual(fixture.state.writes, []);
    assert.deepEqual(fixture.state.finishes, []);
    assert.equal(h.operations.filter(([kind]) => kind === "ai" || kind === "network").length, 0);
  });
}

test("a changed case revision rejects analysis before its lease or AI call", async () => {
  const fixture = fixtureDatabase(),
    h = harness({ database: fixture.database });
  const shown = await h.endpoints().assistantCase({ data: { id: CASE } });
  fixture.state.item.version += 1;
  await assert.rejects(
    h
      .endpoints()
      .assistantAnalyze({ data: { ...INPUTS.assistantAnalyze, reviewToken: shown.reviewToken } }),
    /zwischenzeitlich geändert/,
  );
  assert.deepEqual(fixture.state.writes, []);
  assert.equal(h.operations.filter(([kind]) => kind === "ai" || kind === "network").length, 0);
});

test("contact changes after analysis mark the old result stale", async () => {
  const fixture = fixtureDatabase(),
    h = harness({ database: fixture.database });
  const shown = await h.endpoints().assistantCase({ data: { id: CASE } });
  fixture.state.item.analysis = { inputToken: shown.reviewToken, sources: [], checkedSources: [] };
  assert.equal((await h.endpoints().assistantCase({ data: { id: CASE } })).analysisStale, false);
  fixture.state.item.contact.message += " Neue Kundenanforderung";
  assert.equal((await h.endpoints().assistantCase({ data: { id: CASE } })).analysisStale, true);
});

test("finish receives all retrieved source revisions, even sources omitted from the model citations", async () => {
  const fixture = fixtureDatabase();
  const h = harness({
    database: fixture.database,
    analyze: async ({ store }) => {
      const sources = await store.searchKnowledge("Pflaster");
      assert.equal(sources.length, 2);
      return { draft: "Fiktiver Entwurf", sourceIds: [sources[0].chunkId], sources: [sources[0]] };
    },
  });
  const shown = await h.endpoints().assistantCase({ data: { id: CASE } });
  await h
    .endpoints()
    .assistantAnalyze({ data: { ...INPUTS.assistantAnalyze, reviewToken: shown.reviewToken } });
  const saved = fixture.state.finishes[0];
  assert.equal(saved.p_actor, USER);
  assert.equal(saved.p_result.inputToken, shown.reviewToken);
  assert.deepEqual(saved.p_result.checkedSources, [
    { documentId: DOC, version: 1 },
    { documentId: DOC_2, version: 2 },
  ]);
  assert.equal(saved.p_result.sources.length, 1);
  assert.equal(saved.p_result.sources[0].text, undefined);
  assert.equal(saved.p_result.sources[0].score, undefined);
  assert.equal(h.operations.filter(([kind]) => kind === "network").length, 0);
});

test("a source changing between two searches aborts before finish and releases the lease", async () => {
  const fixture = fixtureDatabase();
  const h = harness({
    database: fixture.database,
    analyze: async ({ store }) => {
      await store.searchKnowledge("Pflaster");
      fixture.state.documents[0].version += 1;
      await store.searchKnowledge("Pflaster erneut");
      assert.fail("changed source must stop the analysis");
    },
  });
  const shown = await h.endpoints().assistantCase({ data: { id: CASE } });
  await assert.rejects(
    h
      .endpoints()
      .assistantAnalyze({ data: { ...INPUTS.assistantAnalyze, reviewToken: shown.reviewToken } }),
    /zwischenzeitlich geändert/,
  );
  assert.deepEqual(fixture.state.finishes, []);
  assert.deepEqual(fixture.state.writes.at(-1), { run_token: null, run_until: null });
});
