import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function moduleAt(file, imports = {}) {
  const module = { exports: {} };
  const source = readFileSync(new URL("../" + file, import.meta.url), "utf8").replace(
    /import.meta.env.PROD/g,
    "true",
  );
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    { module, exports: module.exports, require: (id) => imports[id] ?? require(id), URL, Intl },
  );
  return module.exports;
}
const seo = moduleAt("src/lib/seo.ts");
const content = JSON.parse(
  readFileSync(new URL("../src/content/ratgeber.json", import.meta.url), "utf8"),
);
const guides = moduleAt("src/lib/ratgeber.ts", {
  "@/content/ratgeber.json": { default: content },
  "./seo": seo,
  "./public-image-url": moduleAt("src/lib/public-image-url.ts"),
});
const serialize = (value) => JSON.parse(JSON.stringify(value));

test("public business identity keeps one canonical identifier and the confirmed national service area", () => {
  const organization = serialize(seo.organizationSchema());
  assert.equal(organization["@id"], "https://www.loni-galabau.de/#organization");
  assert.equal(organization.url, "https://www.loni-galabau.de/");
  assert.equal(organization.name, "Loni GalaBau GmbH");
  assert.equal(organization.address.addressLocality, "Hattersheim am Main");
  assert.equal(organization.areaServed["@type"], "Country");
  assert.equal(organization.areaServed.name, "Deutschland");
  assert.equal(organization.telephone, "+49-6190-9266134");
  assert.equal(organization.aggregateRating, undefined);
  assert.equal(organization.sameAs, undefined);
});

test("article author, publisher and website point to the same company", () => {
  const author = serialize(seo.editorialAuthorSchema());
  const website = serialize(seo.websiteSchema());
  assert.equal(author.worksFor["@id"], seo.ORGANIZATION_ID);
  assert.equal(author.jobTitle, "Bau- & Operations Manager");
  assert.equal(author.hasCredential, undefined);
  assert.equal(website.publisher["@id"], seo.ORGANIZATION_ID);
  for (const guide of guides.guides) {
    const graph = serialize(guides.guideSchema(guide))["@graph"];
    const article = graph.find((item) => item["@type"] === "BlogPosting");
    assert.equal(article.author["@id"], seo.EDITORIAL_AUTHOR_ID);
    assert.equal(article.author.worksFor["@id"], article.publisher["@id"]);
    assert.equal(article.publisher["@id"], seo.ORGANIZATION_ID);
    assert.equal(article.datePublished, guide.publishedAt);
    assert.equal(article.dateModified, guide.updatedAt);
    assert.equal(article.mainEntityOfPage, seo.canonicalUrl("/ratgeber/" + guide.slug));
  }
});

test("collection schema reflects supplied visible items in order and connects to the website", () => {
  const graph = serialize(
    seo.publicPageSchema("/leistungen/", "Leistungen", "CollectionPage", [
      { path: "/leistungen/pflasterarbeiten", name: "Pflasterarbeiten" },
      { path: "/leistungen/erdarbeiten", name: "Erdarbeiten" },
    ]),
  )["@graph"];
  const page = graph.find((item) => item["@type"] === "CollectionPage");
  assert.equal(page.url, "https://www.loni-galabau.de/leistungen");
  assert.equal(page.isPartOf["@id"], seo.WEBSITE_ID);
  assert.deepEqual(
    page.mainEntity.itemListElement.map((item) => item.position),
    [1, 2],
  );
  assert.deepEqual(
    page.mainEntity.itemListElement.map((item) => item.url),
    [
      "https://www.loni-galabau.de/leistungen/pflasterarbeiten",
      "https://www.loni-galabau.de/leistungen/erdarbeiten",
    ],
  );
  assert.ok(graph.some((item) => item["@id"] === seo.ORGANIZATION_ID));
});

test("about and contact schemas describe the company without inventing actions or testimonials", () => {
  for (const type of ["AboutPage", "ContactPage"]) {
    const graph = serialize(seo.publicPageSchema("/kontakt", "Kontakt", type))["@graph"];
    const page = graph.find((item) => item["@type"] === type);
    assert.equal(page.mainEntity["@id"], seo.ORGANIZATION_ID);
    assert.equal(page.potentialAction, undefined);
    assert.equal(page.review, undefined);
  }
});

test("schema serialization keeps potentially active HTML inert", () => {
  const schema = seo.publicPageSchema("/projekte", "Galerien", "CollectionPage", [
    { path: "/projekte/example", name: '</script><script>alert("x")</script>' },
  ]);
  const serialized = seo.safeJsonLd(schema);
  assert.equal(serialized.includes("</script>"), false);
  assert.equal(
    JSON.parse(serialized)["@graph"][2].mainEntity.itemListElement[0].name,
    '</script><script>alert("x")</script>',
  );
});
