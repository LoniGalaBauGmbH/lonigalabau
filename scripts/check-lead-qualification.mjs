import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const { PGlite } = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : "@electric-sql/pglite");
const db = new PGlite();
try {
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE TABLE public.contact_requests (id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(), status text NOT NULL DEFAULT 'new', notes text NOT NULL DEFAULT '');
    ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON public.contact_requests FROM PUBLIC, anon, authenticated;
    GRANT ALL ON public.contact_requests TO service_role;
    INSERT INTO public.contact_requests (id, status, notes) VALUES ('existing', 'handled', 'Synthetic unchanged note');`);
  await db.exec(await readFile(new URL("../supabase/bootstrap/updates/contact_lead_qualification.sql", import.meta.url), "utf8"));
  const existing = (await db.query("SELECT * FROM public.contact_requests WHERE id = 'existing'")).rows[0];
  assert.equal(existing.lead_qualification, "unreviewed"); assert.equal(existing.lead_qualification_version, 0);
  assert.equal(existing.lead_qualification_reviewed_at, null); assert.equal(existing.discovery_source, null);
  assert.equal(existing.status, "handled"); assert.equal(existing.notes, "Synthetic unchanged note");
  for (const field of ["lead_qualification", "discovery_source"]) await assert.rejects(db.exec(`INSERT INTO public.contact_requests (id, ${field}) VALUES ('invalid', 'invalid')`), { code: "23514" });
  await assert.rejects(db.exec("INSERT INTO public.contact_requests (id, lead_qualification_version) VALUES ('invalid', -1)"), { code: "23514" });
  await assert.rejects(db.exec("UPDATE public.contact_requests SET lead_qualification = 'qualified' WHERE id = 'existing'"), { code: "23514" });
  await db.exec("UPDATE public.contact_requests SET lead_qualification = 'qualified', lead_qualification_reviewed_at = now(), lead_qualification_version = 1 WHERE id = 'existing' AND lead_qualification_version = 0");
  const stale = await db.query("UPDATE public.contact_requests SET lead_qualification = 'spam', lead_qualification_version = 1 WHERE id = 'existing' AND lead_qualification_version = 0 RETURNING id");
  assert.equal(stale.rows.length, 0);
  for (const source of ["google_search", "google_maps", "recommendation", "social_media", "returning_customer", "other"]) await db.query("INSERT INTO public.contact_requests (id, discovery_source) VALUES ($1, $2)", [source, source]);
  assert.equal((await db.query("SELECT relrowsecurity FROM pg_class WHERE oid = 'public.contact_requests'::regclass")).rows[0].relrowsecurity, true);
  for (const role of ["anon", "authenticated"]) {
    const rights = (await db.query(`SELECT has_table_privilege('${role}', 'public.contact_requests', 'SELECT') AS read, has_table_privilege('${role}', 'public.contact_requests', 'UPDATE') AS write`)).rows[0];
    assert.equal(rights.read, false); assert.equal(rights.write, false);
  }
  const indexes = (await db.query("SELECT indexname FROM pg_indexes WHERE tablename = 'contact_requests'")).rows.map((row) => row.indexname);
  assert.ok(indexes.includes("contacts_created_at_idx")); assert.ok(indexes.includes("contacts_qualification_created_idx"));
  console.log("Lead qualification SQL: defaults, six source choices, constraints, CAS, unchanged status/notes/RLS/browser rights and two indexes verified.");
} finally { await db.close(); }
