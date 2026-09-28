import { readFile, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";

// Only public content, using the public key; never exports customer data or users.
const env = parseEnv(await readFile(process.argv[2] ?? ".env", "utf8"));
const url = env.SUPABASE_URL;
const key = env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Supabase URL und Publishable Key fehlen.");
const tables = ["services", "projects", "jobs"];
const snapshot = { source: url, exportedAt: new Date().toISOString(), tables: {} };
for (const table of tables) {
  const response = await fetch(`${url}/rest/v1/${table}?select=*&active=eq.true`, {
    headers: { apikey: key },
  });
  if (!response.ok)
    throw new Error(`Export von ${table} fehlgeschlagen (HTTP ${response.status}).`);
  snapshot.tables[table] = await response.json();
}
const settingsResponse = await fetch(
  `${url}/rest/v1/site_settings?select=key,value&key=in.(images,partners,tracking)`,
  {
    headers: { apikey: key },
  },
);
if (!settingsResponse.ok)
  throw new Error("Öffentliche Einstellungen konnten nicht gelesen werden.");
snapshot.tables.site_settings = await settingsResponse.json();
await writeFile(
  "supabase/bootstrap/content.snapshot.json",
  JSON.stringify(snapshot, null, 2) + "\n",
);

const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
const literal = (value) => {
  if (value === null) return "NULL";
  if (typeof value === "string") return quote(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  throw new Error("Nicht unterstützter SQL-Wert.");
};
const lines = [
  "-- Öffentliche Website-Inhalte aus dem bisherigen Projekt. Keine Kundendaten oder Konten.",
  `-- Export: ${snapshot.exportedAt}`,
  "-- Erst nach 01_schema.sql und 02_storage.sql im neuen Projekt ausführen.",
  "-- Bild-URLs werden zunächst unverändert übernommen; Quellprojekt bis zur Dateimigration behalten.",
  "BEGIN;",
  "SET LOCAL standard_conforming_strings = on;",
  "DO $$ BEGIN",
  "  IF EXISTS (SELECT 1 FROM public.services) OR EXISTS (SELECT 1 FROM public.projects) OR EXISTS (SELECT 1 FROM public.jobs) THEN",
  "    RAISE EXCEPTION 'Abbruch: Ziel enthält bereits Website-Inhalte.';",
  "  END IF;",
  "END $$;",
];
const columns = {
  services: [
    "id",
    "slug",
    "title",
    "category",
    "short_text",
    "long_text",
    "hero_image",
    "sort_order",
    "active",
    "created_at",
    "updated_at",
    "meta_title",
    "meta_description",
    "geo_focus",
    "custom_benefits",
    "custom_faqs",
  ],
  projects: [
    "id",
    "title",
    "service_id",
    "location",
    "description",
    "images",
    "featured",
    "active",
    "created_at",
    "updated_at",
  ],
  jobs: [
    "id",
    "slug",
    "title",
    "description",
    "requirements",
    "location",
    "employment_type",
    "active",
    "created_at",
    "updated_at",
  ],
};
const serviceIds = new Set(snapshot.tables.services.map((row) => row.id));
for (const table of tables) {
  for (const original of snapshot.tables[table]) {
    const row = { ...original };
    if (table === "projects" && !serviceIds.has(row.service_id)) row.service_id = null;
    const fields = columns[table].filter((field) => Object.hasOwn(row, field));
    const values = fields.map((field) => {
      const value = row[field];
      if (field === "images") return `ARRAY[${value.map(literal).join(", ")}]::text[]`;
      if (field === "custom_benefits" || field === "custom_faqs")
        return quote(JSON.stringify(value ?? [])) + "::jsonb";
      return literal(value);
    });
    lines.push(`INSERT INTO public.${table} (${fields.join(", ")}) VALUES (${values.join(", ")});`);
  }
}
for (const row of snapshot.tables.site_settings) {
  lines.push(
    `INSERT INTO public.site_settings (key, value) VALUES (${quote(row.key)}, ${quote(JSON.stringify(row.value))}::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;`,
  );
}
lines.push("COMMIT;", "");
await writeFile("supabase/bootstrap/04_content.sql", lines.join("\n"));
console.log(
  JSON.stringify(
    {
      source: url,
      exported: Object.fromEntries(
        Object.entries(snapshot.tables).map(([table, rows]) => [table, rows.length]),
      ),
      mediaHosts: [
        ...new Set(
          JSON.stringify(snapshot.tables)
            .match(/https?:\/\/[^\s"\\]+/g)
            ?.map((value) => new URL(value).host) ?? [],
        ),
      ],
    },
    null,
    2,
  ),
);
