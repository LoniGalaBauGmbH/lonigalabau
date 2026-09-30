import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const { PGlite } = await import(
  process.argv[2] ? pathToFileURL(process.argv[2]).href : "@electric-sql/pglite"
);
const db = new PGlite();
try {
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create table public.contact_requests (id text primary key, payload text);
    create table public.applications (id text primary key, payload text);
    insert into public.contact_requests values ('old-contact', 'immutable message');
    insert into public.applications values ('old-application', 'immutable message');
    grant select, insert, delete on public.contact_requests, public.applications to service_role;
  `);
  await db.exec(
    await readFile(
      new URL("../supabase/bootstrap/updates/short_submission_tickets.sql", import.meta.url),
      "utf8",
    ),
  );
  for (const table of ["contact_requests", "applications"]) {
    const old = (await db.query(`select * from public.${table}`)).rows[0];
    assert.equal(old.ticket_number, 1000);
    assert.equal(old.ticket_format_version, 1);
    assert.equal(old.payload, "immutable message");
    const first = (
      await db.query(
        `insert into public.${table} (id, ticket_format_version) values ('new', 2) returning ticket_number`,
      )
    ).rows[0];
    assert.equal(first.ticket_number, 1001);
    await assert.rejects(
      db.exec(`insert into public.${table} (id,ticket_number) values ('manual',2000)`),
      { code: "428C9" },
    );
    await assert.rejects(
      db.exec(
        `insert into public.${table} (id,ticket_number) overriding system value values ('duplicate',1001)`,
      ),
      { code: "23505" },
    );
    await assert.rejects(
      db.exec(`insert into public.${table} (id,ticket_format_version) values ('bad-version',3)`),
      { code: "23514" },
    );
    const oldWorker = (
      await db.query(
        `insert into public.${table} (id) values ('old-worker') returning ticket_format_version`,
      )
    ).rows[0];
    assert.equal(oldWorker.ticket_format_version, 1);
    await assert.rejects(
      db.exec(
        `insert into public.${table} (id,ticket_number) overriding system value values ('too-low',999)`,
      ),
      { code: "23514" },
    );
    await db.exec(`delete from public.${table} where id='new'; set role service_role;`);
    const next = (
      await db.query(
        `insert into public.${table} (id,ticket_format_version) values ('server-write',2) returning ticket_number`,
      )
    ).rows[0];
    assert.ok(next.ticket_number > first.ticket_number, "deleted numbers must never be reused");
    await db.exec("reset role");
    const rights = (
      await db.query(
        `select has_sequence_privilege('anon','public.${table}_ticket_number_seq','USAGE') as anon, has_sequence_privilege('authenticated','public.${table}_ticket_number_seq','USAGE') as authenticated`,
      )
    ).rows[0];
    assert.equal(rights.anon, false);
    assert.equal(rights.authenticated, false);
  }
  console.log(
    "Ticket migration passed: backfill, stable payloads, unique identities, version checks, server writes and private sequences.",
  );
} finally {
  await db.close();
}
