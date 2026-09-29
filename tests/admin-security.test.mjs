import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);
const userId = "11111111-1111-4111-8111-111111111111";

// Execute the real security modules; replace only Auth, database and RPC boundaries.
// No network or production writes. Framework integration still needs a browser check.
function harness(overrides = {}) {
  const state = {
    authorization: "Bearer valid-token",
    auth: { data: { user: { id: userId } }, error: null },
    role: { data: { role: "admin" }, error: null },
    env: { SUPABASE_URL: "https://example.supabase.co", SUPABASE_PUBLISHABLE_KEY: "test-key" },
    ...overrides,
  };
  const operations = [];
  const cache = new Map();
  const client = {
    auth: {
      getUser: async (token) => {
        operations.push(["verify", token]);
        if (state.auth instanceof Error) throw state.auth;
        return state.auth;
      },
    },
  };
  function middleware(options = {}) {
    return {
      options,
      middleware: (items) => middleware({ ...options, middleware: items }),
      server: (server) => middleware({ ...options, server }),
    };
  }
  async function run(items, context, handler) {
    const flat = items.flatMap((item) => {
      const flatten = (m) => [...(m.options.middleware ?? []).flatMap(flatten), m.options.server];
      return flatten(item);
    });
    async function step(index, ctx) {
      if (index === flat.length) return handler(ctx);
      return flat[index]({
        context: ctx,
        next: (options = {}) => step(index + 1, { ...ctx, ...options.context }),
      });
    }
    return step(0, context);
  }
  function serverFn() {
    let middlewares = [];
    let validator = (data) => data;
    const builder = {
      middleware(items) {
        middlewares = items;
        return builder;
      },
      inputValidator(parse) {
        validator = parse;
        return builder;
      },
      handler(handler) {
        return (options = {}) =>
          run(middlewares, {}, (context) => handler({ context, data: validator(options.data) }));
      },
    };
    return builder;
  }
  const adminClient = {
    from(table) {
      operations.push(["table", table]);
      if (table !== "user_roles") {
        throw new Error("Business query reached");
      }
      const query = {
        select: () => query,
        eq: (key, value) => {
          operations.push(["filter", key, value]);
          return query;
        },
        maybeSingle: async () => {
          if (state.role instanceof Error) throw state.role;
          return state.role;
        },
      };
      return query;
    },
    storage: {
      from() {
        throw new Error("Private storage reached");
      },
    },
  };
  function load(path) {
    if (cache.has(path)) return cache.get(path);
    const module = { exports: {} };
    const source = readFileSync(new URL(path, root), "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
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
            operations.push(["client", options.global.headers.Authorization]);
            return client;
          },
        };
      if (id.endsWith("/client.server") || id === "./client.server")
        return { supabaseAdmin: adminClient };
      if (id.endsWith("/auth-middleware") || id === "./auth-middleware")
        return load("src/integrations/supabase/auth-middleware.ts");
      if (id.endsWith("/admin-middleware"))
        return load("src/integrations/supabase/admin-middleware.ts");
      if (id === "@/lib/validators") return load("src/lib/validators.ts");
      if (id === "./contact-attachments") return load("src/lib/contact-attachments.ts");
      if (id === "./application-document") return load("src/lib/application-document.ts");
      if (id === "./submission-email") return load("src/lib/submission-email.ts");
      if (id === "@/lib/submission-notification.server") return load("src/lib/submission-notification.server.ts");
      if (id === "@/lib/admin.functions") return load("src/lib/admin.functions.ts");
      if (id === "@/integrations/supabase/client")
        return {
          supabase: {
            auth: {
              getSession: async () => ({
                data: { session: state.authorization ? { access_token: "valid-token" } : null },
                error: null,
              }),
            },
          },
        };
      if (id === "@/hooks/useSiteImages") return {};
      if (id === "@tanstack/react-router")
        return {
          createFileRoute: () => (options) => ({ options }),
          redirect: (options) => Object.assign(new Error("Login redirect"), options),
        };
      return require(id);
    };
    vm.runInNewContext(
      outputText,
      {
        module,
        exports: module.exports,
        require: imports,
        process: { env: state.env },
        Buffer,
      },
      { filename: path },
    );
    cache.set(path, module.exports);
    return module.exports;
  }
  return { load, operations, run, client };
}

for (const [name, overrides, message] of [
  ["anonymous request", { authorization: null }, /melde dich an/],
  ["wrong auth scheme", { authorization: "Basic abc" }, /melde dich an/],
  ["empty token", { authorization: "Bearer " }, /melde dich an/],
  ["multiple tokens", { authorization: "Bearer a b" }, /melde dich an/],
  [
    "invalid or expired token",
    { auth: { data: { user: null }, error: { message: "expired" } } },
    /Sitzung ist ungültig/,
  ],
  ["Auth outage", { auth: new Error("Auth unavailable") }, /Auth unavailable/],
  ["missing configuration", { env: {} }, /nicht verfügbar/],
  ["missing role", { role: { data: null, error: null } }, /kein Adminzugang/],
  ["wrong role", { role: { data: { role: "user" }, error: null } }, /kein Adminzugang/],
  [
    "database error",
    { role: { data: { role: "admin" }, error: { message: "DB error" } } },
    /nicht geprüft/,
  ],
  ["database outage", { role: new Error("DB unavailable") }, /DB unavailable/],
]) {
  test(name + " cannot read private data or perform an admin action", async () => {
    const h = harness(overrides);
    const endpoints = {
      ...h.load("src/lib/admin.functions.ts"),
      ...h.load("src/lib/tracking.functions.ts"),
    };
    for (const [endpointName, endpoint] of Object.entries(endpoints)) {
      if (endpointName === "getTrackingSettings") continue;
      await assert.rejects(endpoint(), message, endpointName);
    }
    assert.equal(
      h.operations.some(([kind, table]) => kind === "table" && table !== "user_roles"),
      false,
    );
  });
}

test("a verified admin receives their real identity", async () => {
  const h = harness();
  const identity = await h.load("src/lib/admin.functions.ts").adminWhoami();
  assert.equal(identity.userId, userId);
  assert.equal(identity.isAdmin, true);
  assert.ok(
    h.operations.some(
      ([kind, key, value]) => kind === "filter" && key === "user_id" && value === userId,
    ),
  );
});

test("authenticated context retains the verified user's bearer token", async () => {
  const h = harness();
  const { requireSupabaseAuth } = h.load("src/integrations/supabase/auth-middleware.ts");
  const context = await h.run([requireSupabaseAuth], {}, (ctx) => ctx);
  assert.equal(context.userId, userId);
  assert.equal(context.supabase, h.client);
  assert.deepEqual(h.operations, [
    ["client", "Bearer valid-token"],
    ["verify", "valid-token"],
  ]);
});

test("a verified admin reaches the business query", async () => {
  const h = harness();
  const { adminDeleteService } = h.load("src/lib/admin.functions.ts");
  await assert.rejects(adminDeleteService({ data: { id: userId } }), /Business query reached/);
  assert.ok(h.operations.some(([kind, table]) => kind === "table" && table === "services"));
});

test("opening an admin route without a session redirects to login", async () => {
  const h = harness({ authorization: null });
  const { options } = h.load("src/routes/_authenticated.tsx").Route;
  assert.equal(options.ssr, false);
  await assert.rejects(options.beforeLoad(), (error) => error.to === "/login");
  assert.equal(h.operations.length, 0);
});

test("a browser session alone does not open the admin route", async () => {
  const h = harness({ role: { data: null, error: null } });
  await assert.rejects(
    h.load("src/routes/_authenticated.tsx").Route.options.beforeLoad(),
    /kein Adminzugang/,
  );
});

test("a verified admin can open the admin route", async () => {
  const h = harness();
  await h.load("src/routes/_authenticated.tsx").Route.options.beforeLoad();
});
