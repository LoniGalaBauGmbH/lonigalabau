import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Isolated PostgreSQL verification; never connects to a real Supabase project.
// npm install --no-save @electric-sql/pglite, or pass its dist/index.js path.
const { PGlite } = await import(
  process.argv[2] ? pathToFileURL(process.argv[2]).href : "@electric-sql/pglite"
);
const db = new PGlite();
const readSql = (name) =>
  readFile(new URL("../supabase/bootstrap/" + name, import.meta.url), "utf8");
let checks = 0;
const check = (condition, label) => {
  assert.ok(condition, label);
  checks++;
};
try {
  // Minimal Supabase system fixtures. Auth HTTP and Storage HTTP need a later live test.
  await db.exec(`
    CREATE ROLE anon;
    CREATE ROLE authenticated;
    CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY, email text);
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    GRANT USAGE ON SCHEMA auth TO authenticated;
    CREATE SCHEMA storage;
    CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean,
      file_size_limit bigint, allowed_mime_types text[]);
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
    CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
      LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN RETURN; END $$;
    GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO anon, authenticated;
  `);
  await db.exec(await readSql("01_schema.sql"));
  await db.exec(await readSql("02_storage.sql"));
  await db.exec(await readSql("04_content.sql"));
  await db.exec(await readSql("05_verify.sql"));
  checks++;
  const rows = async (sql) => (await db.query(sql)).rows;
  const count = async (table) =>
    Number((await rows(`SELECT count(*) AS count FROM public.${table}`))[0].count);
  for (const role of ["anon", "authenticated"]) {
    const permissions = await rows(
      `SELECT has_function_privilege('${role}', 'public.rls_auto_enable()', 'EXECUTE') AS allowed`,
    );
    check(!permissions[0].allowed, role + " cannot execute internal RLS trigger");
  }
  check((await count("services")) === 8, "all 8 services imported");
  check((await count("projects")) === 1, "project imported");
  check((await count("jobs")) === 1, "job imported");
  check((await count("site_settings")) === 3, "default public settings preserved");
  const rls = await rows(
    "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'",
  );
  check(rls.length === 8 && rls.every((row) => row.rowsecurity), "RLS enabled for all app tables");
  const buckets = await rows("SELECT id, public FROM storage.buckets ORDER BY id");
  check(buckets.length === 4, "all storage buckets present");
  check(
    buckets
      .filter((b) => !b.public)
      .map((b) => b.id)
      .join(",") === "configurator-images,cvs",
    "customer files private",
  );
  await db.exec(`
    INSERT INTO public.services (slug, title, active) VALUES ('private-test', 'Hidden', false);
    INSERT INTO public.site_settings (key, value) VALUES ('private-test', '{}');
    INSERT INTO auth.users VALUES ('11111111-1111-4111-8111-111111111111', 'admin@example.test');
  `);
  await db.exec(
    (await readSql("03_admin.sql")).replace("ADMIN_EMAIL_HIER_EINTRAGEN", "admin@example.test"),
  );
  await db.exec(
    (await readSql("03_admin.sql")).replace("ADMIN_EMAIL_HIER_EINTRAGEN", "admin@example.test"),
  );
  check((await count("user_roles")) === 1, "admin grant idempotent and linked to Auth user");

  for (const role of ["anon", "authenticated"]) {
    await db.exec(`SET ROLE ${role}`);
    check((await count("services")) === 8, role + " cannot see hidden service");
    check((await count("site_settings")) === 3, role + " cannot see private settings");
    for (const table of ["applications", "contact_requests", "newsletter_subscribers"]) {
      await assert.rejects(db.query(`SELECT * FROM public.${table}`), /permission denied/);
      checks++;
    }
    await assert.rejects(
      db.exec("INSERT INTO public.services (slug,title) VALUES ('forbidden','Forbidden')"),
      /permission denied/,
    );
    checks++;
    await assert.rejects(
      db.exec(
        "INSERT INTO public.contact_requests (name,email,message) VALUES ('Test','test@example.test','Spam')",
      ),
      /permission denied/,
    );
    checks++;
    await assert.rejects(
      db.exec(
        "INSERT INTO public.user_roles (user_id,role) VALUES ('11111111-1111-4111-8111-111111111111','admin')",
      ),
      /permission denied/,
    );
    checks++;
    await db.exec("RESET ROLE");
  }
  await db.exec(
    "SET ROLE authenticated; SET request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222'",
  );
  check((await count("user_roles")) === 0, "users cannot see other roles");
  await db.exec("SET request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111'");
  check((await count("user_roles")) === 1, "user sees own admin role");
  await db.exec("RESET ROLE; SET ROLE service_role");
  check((await count("services")) === 9, "server sees inactive content");
  await db.exec(
    "INSERT INTO public.contact_requests (name,email,message) VALUES ('Test','test@example.test','Message')",
  );
  check((await count("contact_requests")) === 1, "server can create contacts");
  await assert.rejects(
    db.exec("UPDATE public.contact_requests SET status = 'invalid'"),
    /check constraint/,
  );
  checks++;
  await assert.rejects(
    db.exec(
      "INSERT INTO public.newsletter_subscribers (email) VALUES ('Test@example.test'), ('test@example.test')",
    ),
    /unique constraint/,
  );
  checks++;
  await db.exec("RESET ROLE");
  await assert.rejects(db.exec(await readSql("01_schema.sql")), /Loni-Tabellen existieren bereits/);
  await db.exec("ROLLBACK");
  check((await count("services")) === 9, "repeated bootstrap preserves existing data");
  await assert.rejects(db.exec(await readSql("02_storage.sql")), /Loni-Buckets existieren bereits/);
  await db.exec("ROLLBACK");
  await assert.rejects(
    db.exec(await readSql("04_content.sql")),
    /Ziel enthält bereits Website-Inhalte/,
  );
  await db.exec("ROLLBACK");
  checks += 2;
  console.log(`${checks} PostgreSQL schema, import and permission checks passed.`);
} finally {
  await db.close();
}
