import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Run with Node 24: node scripts/check-assistant-workspace.mjs [pglite/dist/index.js] [migration.sql]
// Everything runs in an in-memory PostgreSQL instance. No network or live credentials.
const repositoryMigration = new URL('../supabase/bootstrap/updates/assistant_workspace.sql', import.meta.url);
const migrationPath = process.argv[3] ? resolve(process.argv[3]) : fileURLToPath(
  existsSync(repositoryMigration) ? repositoryMigration
    : new URL('../garden-zenith-42-main/supabase/bootstrap/updates/assistant_workspace.sql', import.meta.url),
);
const { PGlite } = await import(
  process.argv[2] ? pathToFileURL(resolve(process.argv[2])).href : '@electric-sql/pglite',
);
const db = new PGlite();
const actor = randomUUID();
let passed = 0;
const failures = [];

async function rows(sql, params = []) {
  return (await db.query(sql, params)).rows;
}
async function one(sql, params = []) {
  return (await rows(sql, params))[0];
}
async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push({ name, message: error.message, code: error.code });
    console.error(`FAIL ${name}: ${error.message}`);
  } finally {
    await db.exec('reset role');
  }
}
async function asRole(role, fn) {
  assert.ok(['anon', 'authenticated', 'service_role'].includes(role));
  await db.exec(`set role ${role}`);
  try { return await fn(); } finally { await db.exec('reset role'); }
}
async function createDocument(overrides = {}) {
  return asRole('service_role', () => one(`
    insert into public.assistant_documents(title,category,source,content,approved,updated_by)
    values($1,'Leistung','Synthetischer Prüffall',$2,$3,$4) returning *`, [
    overrides.title ?? 'Testwissen', overrides.content ?? 'Belastung und Entwässerung vor Ort prüfen.',
    overrides.approved ?? true, actor,
  ]));
}
async function createCase(overrides = {}) {
  return asRole('service_role', () => one(`
    insert into public.assistant_cases(contact_request_id,title,customer,notes,draft,analysis,updated_by)
    values($1,$2,$3,$4,$5,$6::jsonb,$7) returning *`, [
    overrides.contactId ?? null, overrides.title ?? 'Synthetischer Fall', 'Beispielkunde',
    overrides.notes ?? '', overrides.draft ?? '',
    overrides.analysis ? JSON.stringify(overrides.analysis) : null, actor,
  ]));
}
async function getCase(id) {
  return one('select * from public.assistant_cases where id=$1', [id]);
}
async function auditCount(id) {
  return Number((await one('select count(*)::integer as count from public.assistant_audit where entity_id=$1', [id])).count);
}
async function lease(id, { token = randomUUID(), until = 'future' } = {}) {
  const expiration = until === 'past' ? new Date(Date.now() - 60_000).toISOString()
    : until === null ? null : new Date(Date.now() + 300_000).toISOString();
  await asRole('service_role', () => db.query(`update public.assistant_cases
    set run_token=$2,run_until=$3,last_run_at=clock_timestamp() where id=$1`, [id, token, expiration]));
  return token;
}
function resultFor(document, overrides = {}) {
  return {
    summary: 'Eine synthetische Kundenanfrage.', category: 'projektanfrage', knownFacts: [],
    missingQuestions: [], draft: 'Guten Tag, vielen Dank für Ihre Anfrage.', visitBriefing: [],
    needsHumanReview: false, reviewReason: '', mode: 'ai',
    sourceIds: document ? [`${document.id}:v${document.version}:1`] : [],
    checkedSources: document ? [{ documentId: document.id, version: document.version }] : [],
    sources: document ? [{ documentId: document.id, version: document.version, chunkId: `${document.id}:v${document.version}:1`, title: document.title, source: document.source, text: document.content, score: 1 }] : [],
    ...overrides,
  };
}
async function finish(record, token, result, options = {}) {
  return asRole('service_role', async () => Boolean((await one(`select public.assistant_finish_run(
    $1::uuid,$2::uuid,$3::integer,$4::jsonb,$5::jsonb,$6::uuid) as ok`, [
    options.id ?? record.id, token, Object.hasOwn(options, 'version') ? options.version : record.version,
    options.contact === undefined ? null : JSON.stringify(options.contact),
    JSON.stringify(result), actor,
  ])).ok));
}
async function assertUnchangedFinish(record, token, result, options = {}) {
  const before = await getCase(record.id);
  const count = await auditCount(record.id);
  assert.equal(await finish(record, token, result, options), false);
  assert.deepEqual(await getCase(record.id), before);
  assert.equal(await auditCount(record.id), count);
}

try {
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key);
    create table public.contact_requests(
      id uuid primary key default gen_random_uuid(), name text not null,
      subject text, message text not null, notes text not null default ''
    );
    grant usage on schema public to anon,authenticated,service_role;
    grant usage on schema auth to service_role;
    grant select on auth.users to service_role;
    grant select,insert,update,delete on public.contact_requests to service_role;
  `);
  await db.query('insert into auth.users(id) values($1)', [actor]);
  await db.exec(await readFile(migrationPath, 'utf8'));

  await check('migration creates all private tables with RLS', async () => {
    const tables = await rows(`select relname,relrowsecurity from pg_class
      where relnamespace='public'::regnamespace and relname in ('assistant_cases','assistant_documents','assistant_audit') order by relname`);
    assert.equal(tables.length, 3);
    assert.ok(tables.every((table) => table.relrowsecurity));
  });

  await check('anon and authenticated cannot access tables or call RPCs', async () => {
    for (const role of ['anon', 'authenticated']) {
      await asRole(role, async () => {
        for (const table of ['assistant_cases', 'assistant_documents', 'assistant_audit']) {
          for (const privilege of ['SELECT', 'INSERT', 'UPDATE', 'DELETE']) {
            assert.equal((await one('select has_table_privilege(current_user,$1,$2) as allowed', [`public.${table}`, privilege])).allowed, false);
          }
          await assert.rejects(db.query(`select * from public.${table}`), { code: '42501' });
        }
        await assert.rejects(db.query('select * from public.assistant_search($1)', ['Pflaster']), { code: '42501' });
        await assert.rejects(db.query('select public.assistant_finish_run(null,null,null,null,null,null)'), { code: '42501' });
        for (const signature of [
          'public.assistant_record_change()', 'public.assistant_search(text)',
          'public.assistant_finish_run(uuid,uuid,integer,jsonb,jsonb,uuid)',
        ]) {
          assert.equal((await one('select has_function_privilege(current_user,$1,\'EXECUTE\') as allowed', [signature])).allowed, false);
        }
      });
    }
  });

  await check('RPCs use invoker rights and empty search_path', async () => {
    const functions = await rows(`select proname,prosecdef,proconfig from pg_proc
      where pronamespace='public'::regnamespace and proname like 'assistant_%'`);
    assert.equal(functions.length, 3);
    assert.ok(functions.every((fn) => !fn.prosecdef && fn.proconfig.includes('search_path=""')));
  });

  await check('German full-text search includes approved documents only', async () => {
    const approved = await createDocument({ title: 'Einfahrt', content: 'Die Einfahrten benötigen einen tragfähigen Unterbau.' });
    const unapproved = await createDocument({ title: 'Einfahrt Geheim', content: 'Einfahrten mit internem Versuchsunterbau.', approved: false });
    const hits = await asRole('service_role', () => rows('select id,approved from public.assistant_search($1)', ['Einfahrt']));
    assert.ok(hits.some((hit) => hit.id === approved.id));
    assert.ok(!hits.some((hit) => hit.id === unapproved.id));
    assert.ok(hits.every((hit) => hit.approved));
    await asRole('service_role', () => db.query('update public.assistant_documents set approved=false where id=$1', [approved.id]));
    const after = await asRole('service_role', () => rows('select id from public.assistant_search($1)', ['Einfahrt']));
    assert.ok(!after.some((hit) => hit.id === approved.id));
  });

  await check('search is capped and raw SQL-like input remains data', async () => {
    for (let index = 0; index < 8; index += 1) await createDocument({ title: `Regenwasserspeicher ${index}`, content: 'Regenwasserspeicher für Bewässerung.' });
    const hits = await asRole('service_role', () => rows('select id from public.assistant_search($1)', ['Regenwasserspeicher']));
    assert.equal(hits.length, 6);
    await asRole('service_role', () => rows('select id from public.assistant_search($1)', ["'; DROP TABLE public.assistant_cases; --"]));
    assert.equal((await one("select to_regclass('public.assistant_cases') is not null as intact")).intact, true);
  });

  await check('CRUD creates actor audit entries and increments versions', async () => {
    const document = await createDocument();
    const record = await createCase();
    assert.equal(document.version, 1);
    assert.equal(record.version, 1);
    assert.equal(await auditCount(document.id), 1);
    assert.equal(await auditCount(record.id), 1);
    const updatedDoc = await asRole('service_role', () => one('update public.assistant_documents set content=$2 where id=$1 returning *', [document.id, 'Geänderter dokumentierter Ablauf.']));
    const updatedCase = await asRole('service_role', () => one('update public.assistant_cases set notes=$2 where id=$1 returning *', [record.id, 'Neue interne Notiz.']));
    assert.equal(updatedDoc.version, 2);
    assert.equal(updatedCase.version, 2);
    assert.equal(await auditCount(document.id), 2);
    assert.equal(await auditCount(record.id), 2);
    assert.deepEqual((await rows('select distinct actor_id from public.assistant_audit where entity_id in ($1,$2)', [document.id, record.id])).map((item) => item.actor_id), [actor]);
    await asRole('service_role', () => assert.rejects(db.query('update public.assistant_audit set action=\'DELETE\' where entity_id=$1', [record.id]), { code: '42501' }));
  });

  await check('lease acquisition and release do not bump case version or audit', async () => {
    const record = await createCase();
    const count = await auditCount(record.id);
    await lease(record.id);
    const leased = await getCase(record.id);
    assert.equal(leased.version, record.version);
    assert.deepEqual(leased.updated_at, record.updated_at);
    assert.equal(await auditCount(record.id), count);
    await asRole('service_role', () => db.query('update public.assistant_cases set run_token=null,run_until=null where id=$1', [record.id]));
    assert.equal((await getCase(record.id)).version, record.version);
    assert.equal(await auditCount(record.id), count);
  });

  await check('matching live lease and approved source atomically save result and release lease', async () => {
    const document = await createDocument();
    const record = await createCase();
    const token = await lease(record.id);
    const result = resultFor(document);
    assert.equal(await finish(record, token, result), true);
    const saved = await getCase(record.id);
    assert.deepEqual(saved.analysis, result);
    assert.equal(saved.draft, result.draft);
    assert.equal(saved.run_token, null);
    assert.equal(saved.run_until, null);
    assert.equal(saved.version, record.version + 1);
    assert.equal(await auditCount(record.id), 2);
    await assertUnchangedFinish(record, token, result);
  });

  await check('null token, null version, null lease token and null expiration are refused', async () => {
    const record = await createCase();
    const result = resultFor();
    const token = await lease(record.id);
    await assertUnchangedFinish(record, null, result);
    await assertUnchangedFinish(record, token, result, { version: null });
    await lease(record.id, { token: null });
    await assertUnchangedFinish(record, token, result);
    await lease(record.id, { token, until: null });
    await assertUnchangedFinish(record, token, result);
  });

  await check('expired lease and mismatched token are refused without writes', async () => {
    const record = await createCase();
    const token = await lease(record.id, { until: 'past' });
    await assertUnchangedFinish(record, token, resultFor());
    await lease(record.id, { token });
    await assertUnchangedFinish(record, randomUUID(), resultFor());
  });

  await check('changed case version refuses stale AI result', async () => {
    const record = await createCase();
    const token = await lease(record.id);
    await asRole('service_role', () => db.query('update public.assistant_cases set notes=$2 where id=$1', [record.id, 'Zwischenzeitliche Korrektur.']));
    await assertUnchangedFinish(record, token, resultFor());
  });

  await check('optimistic version predicate prevents a stale manual save and extra audit', async () => {
    const record = await createCase();
    const updated = await asRole('service_role', () => rows('update public.assistant_cases set notes=$3 where id=$1 and version=$2 returning version', [record.id, record.version, 'Neue Notiz.']));
    assert.equal(updated.length, 1);
    assert.equal(updated[0].version, record.version + 1);
    const count = await auditCount(record.id);
    const stale = await asRole('service_role', () => rows('update public.assistant_cases set notes=$3 where id=$1 and version=$2 returning version', [record.id, record.version, 'Veraltete Notiz.']));
    assert.equal(stale.length, 0);
    assert.equal((await getCase(record.id)).notes, 'Neue Notiz.');
    assert.equal(await auditCount(record.id), count);
  });

  await check('revoked, edited, deleted and unknown sources refuse AI results', async () => {
    for (const change of ['revoke', 'edit', 'delete', 'unknown']) {
      const document = await createDocument();
      const record = await createCase();
      const token = await lease(record.id);
      const result = resultFor(document);
      if (change === 'revoke') await asRole('service_role', () => db.query('update public.assistant_documents set approved=false where id=$1', [document.id]));
      if (change === 'edit') await asRole('service_role', () => db.query('update public.assistant_documents set content=$2 where id=$1', [document.id, 'Zwischenzeitlich geänderter Inhalt.']));
      if (change === 'delete') await asRole('service_role', () => db.query('delete from public.assistant_documents where id=$1', [document.id]));
      if (change === 'unknown') {
        result.sources[0].documentId = randomUUID();
        result.checkedSources[0].documentId = result.sources[0].documentId;
      }
      await assertUnchangedFinish(record, token, result);
    }
  });

  await check('source version must be present and current', async () => {
    const document = await createDocument();
    const record = await createCase();
    const token = await lease(record.id);
    const result = resultFor(document);
    delete result.sources[0].version;
    delete result.checkedSources[0].version;
    await assertUnchangedFinish(record, token, result);
  });

  await check('revoked retrieved document refuses result even when the model did not cite it', async () => {
    const cited = await createDocument();
    const uncited = await createDocument();
    const record = await createCase();
    const token = await lease(record.id);
    const result = resultFor(cited);
    result.checkedSources.push({ documentId: uncited.id, version: uncited.version });
    await asRole('service_role', () => db.query('update public.assistant_documents set approved=false where id=$1', [uncited.id]));
    await assertUnchangedFinish(record, token, result);
  });

  await check('missing or excessive source arrays and invalid draft shapes refuse result', async () => {
    const record = await createCase();
    const token = await lease(record.id);
    for (const overrides of [
      { sources: null }, { sources: Array(9).fill({}) }, { checkedSources: null },
      { checkedSources: Array(25).fill({}) }, { draft: null }, { draft: 123 },
    ]) await assertUnchangedFinish(record, token, resultFor(null, overrides));
    const missing = resultFor();
    delete missing.checkedSources;
    await assertUnchangedFinish(record, token, missing);
  });

  await check('changed or missing linked contact snapshot refuses result', async () => {
    const contact = await asRole('service_role', () => one('insert into public.contact_requests(name,subject,message,notes) values($1,$2,$3,$4) returning *', ['Testkunde', 'Terrasse', '40 m² Terrasse.', 'Bisherige Notiz.']));
    const record = await createCase({ contactId: contact.id });
    const token = await lease(record.id);
    const snapshot = { name: contact.name, subject: contact.subject, message: contact.message, notes: contact.notes };
    await assertUnchangedFinish(record, token, resultFor());
    await asRole('service_role', () => db.query('update public.contact_requests set notes=$2 where id=$1', [contact.id, 'Inzwischen geänderte Kontaktnotiz.']));
    await assertUnchangedFinish(record, token, resultFor(), { contact: snapshot });
    const current = { ...snapshot, notes: 'Inzwischen geänderte Kontaktnotiz.' };
    assert.equal(await finish(record, token, resultFor(), { contact: current }), true);
  });

  await check('human draft survives analysis, prior untouched AI draft may be replaced', async () => {
    const previous = resultFor(null, { draft: 'Alter KI-Entwurf.' });
    for (const human of [true, false]) {
      const draft = human ? 'Vom Menschen verfasster verbindlicher Entwurf.' : previous.draft;
      const record = await createCase({ draft, analysis: previous });
      const token = await lease(record.id);
      const result = resultFor(null, { draft: 'Neuer KI-Entwurf.' });
      assert.equal(await finish(record, token, result), true);
      const saved = await getCase(record.id);
      assert.equal(saved.draft, human ? draft : result.draft);
      assert.deepEqual(saved.analysis, result);
    }
  });

  await check('deleting linked contact cascades case content and case audit', async () => {
    const contact = await asRole('service_role', () => one('insert into public.contact_requests(name,message) values($1,$2) returning *', ['Löschtest', 'Synthetische Anfrage.']));
    const record = await createCase({ contactId: contact.id, notes: 'Private Notiz.', draft: 'Privater Entwurf.', analysis: resultFor() });
    assert.equal(await auditCount(record.id), 1);
    await asRole('service_role', () => db.query('delete from public.contact_requests where id=$1', [contact.id]));
    assert.equal(await getCase(record.id), undefined);
    assert.equal(await auditCount(record.id), 0);
  });

  await check('direct case and document deletion removes related audit', async () => {
    const record = await createCase();
    const document = await createDocument();
    await asRole('service_role', async () => {
      await db.query('delete from public.assistant_cases where id=$1', [record.id]);
      await db.query('delete from public.assistant_documents where id=$1', [document.id]);
    });
    assert.equal(await auditCount(record.id), 0);
    assert.equal(await auditCount(document.id), 0);
  });

  await check('contact-to-case association is unique and cannot reference a missing contact', async () => {
    const contact = await asRole('service_role', () => one('insert into public.contact_requests(name,message) values($1,$2) returning *', ['Einmalig', 'Anfrage.']));
    await createCase({ contactId: contact.id });
    await assert.rejects(createCase({ contactId: contact.id }), { code: '23505' });
    await assert.rejects(createCase({ contactId: randomUUID() }), { code: '23503' });
  });

  await check('message and analysis constraints reject invalid shapes and excessive drafts', async () => {
    const record = await createCase();
    await asRole('service_role', async () => {
      for (const [column, value] of [['messages', {}], ['analysis', []], ['messages', Array(101).fill({ role: 'user', content: 'x' })]]) {
        await assert.rejects(db.query(`update public.assistant_cases set ${column}=$2::jsonb where id=$1`, [record.id, JSON.stringify(value)]), { code: '23514' });
      }
      await assert.rejects(db.query('update public.assistant_cases set draft=$2 where id=$1', [record.id, 'a'.repeat(12_001)]), { code: '23514' });
    });
  });
} finally {
  await db.close();
}

console.log(JSON.stringify({ migration: migrationPath, passed, failed: failures.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
