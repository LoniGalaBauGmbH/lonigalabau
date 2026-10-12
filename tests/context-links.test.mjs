import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function moduleAt(file, imports = {}) {
  const module = { exports: {} };
  const source = readFileSync(new URL("../" + file, import.meta.url), "utf8");
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    { module, exports: module.exports, require: (id) => imports[id] ?? require(id) },
  );
  return module.exports;
}

const summaries = JSON.parse(
  readFileSync(new URL("../src/content/ratgeber-index.json", import.meta.url), "utf8"),
);
const editorial = moduleAt("src/lib/guide-index.ts", {
  "@/content/ratgeber-index.json": { default: summaries },
});
const parser = moduleAt("src/lib/context-links.ts", { "./guide-index": editorial });
const serialize = (value) => JSON.parse(JSON.stringify(value));
const parse = (value) => serialize(parser.parseContextLinks(value));

test("context links preserve surrounding text and support service and guide destinations together", () => {
  assert.deepEqual(
    parse(
      "Vorher [Pflaster](/leistungen/pflasterarbeiten), danach [Rasen vergleichen](/ratgeber/rollrasen-oder-einsaat).",
    ),
    [
      { kind: "text", text: "Vorher " },
      { kind: "link", label: "Pflaster", section: "leistungen", slug: "pflasterarbeiten" },
      { kind: "text", text: ", danach " },
      {
        kind: "link",
        label: "Rasen vergleichen",
        section: "ratgeber",
        slug: "rollrasen-oder-einsaat",
      },
      { kind: "text", text: "." },
    ],
  );
});

test("unknown, external, protocol and modified destinations stay plain text", () => {
  for (const text of [
    "[Unbekannt](/leistungen/baumarbeiten)",
    "[Unbekannt](/ratgeber/unbekannt)",
    "[Extern](https://example.org/ratgeber/rollrasen-oder-einsaat)",
    "[Extern](//example.org)",
    "[Skript](javascript:alert(1))",
    "[Daten](data:text/html,test)",
    "[Query](/ratgeber/rollrasen-oder-einsaat?redirect=https://example.org)",
    "[Fragment](/ratgeber/rollrasen-oder-einsaat#fremd)",
    "[Pfad](/ratgeber/rollrasen-oder-einsaat/../kontakt)",
    "[Leerzeichen](/ratgeber/rollrasen-oder-einsaat )",
    "[Unvollständig](/ratgeber/rollrasen-oder-einsaat",
    "[   ](/ratgeber/rollrasen-oder-einsaat)",
    "[Mehr\nZeilen](/ratgeber/rollrasen-oder-einsaat)",
    "<img src=x onerror=alert(1)>",
    "",
  ]) {
    assert.deepEqual(parse(text), [{ kind: "text", text }], text);
  }
});

test("invalid markup between valid links is preserved rather than dropped", () => {
  const parts = parse(
    "[Grün](/leistungen/rasenanlagen) [unbekannt](/ratgeber/kein-beitrag) [Wasser](/ratgeber/gartenbewaesserung-planen)",
  );
  assert.equal(parts[1].text, " [unbekannt](/ratgeber/kein-beitrag) ");
  assert.deepEqual(
    parts.filter((part) => part.kind === "link").map((part) => part.slug),
    ["rasenanlagen", "gartenbewaesserung-planen"],
  );
});

test("all published guide slugs and the existing service links are accepted", () => {
  for (const guide of summaries) {
    const [part] = parse(`[Thema](/ratgeber/${guide.slug})`);
    assert.equal(part.kind, "link");
    assert.equal(part.section, "ratgeber");
    assert.equal(part.slug, guide.slug);
  }
  for (const slug of [
    "gartengestaltung",
    "pflasterarbeiten",
    "natursteinarbeiten",
    "zaunarbeiten",
    "rasenanlagen",
    "bewaesserungsanlagen",
    "erdarbeiten",
    "entwaesserung",
  ]) {
    const [part] = parse(`[Leistung](/leistungen/${slug})`);
    assert.equal(part.kind, "link");
    assert.equal(part.section, "leistungen");
    assert.equal(part.slug, slug);
  }
});

test("repeated parsing has no shared regular-expression cursor", () => {
  const text = "[Wasser](/ratgeber/gartenbewaesserung-planen)";
  assert.deepEqual(parse(text), parse(text));
});

test("every published article has distinct existing editorial recommendations without self-links", () => {
  const known = new Set(summaries.map((guide) => guide.slug));
  assert.deepEqual(new Set(Object.keys(editorial.relatedGuideSlugs)), known);
  for (const article of summaries) {
    const related = editorial.getRelatedGuides(article.slug);
    assert.ok(related.length >= 2 && related.length <= 3, article.slug);
    assert.equal(new Set(related.map((guide) => guide.slug)).size, related.length, article.slug);
    for (const guide of related) {
      assert.ok(known.has(guide.slug), guide.slug);
      assert.notEqual(guide.slug, article.slug);
    }
  }
});

test("lawn and irrigation readers get the closely related companion guide first", () => {
  assert.equal(
    editorial.getRelatedGuides("rollrasen-oder-einsaat")[0].slug,
    "gartenbewaesserung-planen",
  );
  assert.equal(
    editorial.getRelatedGuides("gartenbewaesserung-planen")[0].slug,
    "rollrasen-oder-einsaat",
  );
});

test("paving and terrace drainage readers can discover the natural stone guide", () => {
  for (const slug of ["pflasterarbeiten-kosten-einfahrt", "terrasse-entwaesserung-planen"]) {
    assert.ok(
      editorial
        .getRelatedGuides(slug)
        .some((guide) => guide.slug === "naturstein-terrasse-materialwahl"),
      slug,
    );
  }
});

test("unknown article names and inherited object keys do not receive arbitrary recommendations", () => {
  for (const slug of ["", "nicht-veroeffentlicht", "toString", "__proto__", "constructor"]) {
    assert.deepEqual(serialize(editorial.getRelatedGuides(slug)), [], slug);
  }
});
