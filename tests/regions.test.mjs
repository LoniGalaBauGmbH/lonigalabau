import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
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
    { module, exports: module.exports, require: (id) => imports[id] ?? require(id), URL },
  );
  return module.exports;
}

const content = JSON.parse(
  readFileSync(new URL("../src/content/regions.json", import.meta.url), "utf8"),
);
const seo = moduleAt("src/lib/seo.ts");
const publicImages = moduleAt("src/lib/public-image-url.ts");
const api = moduleAt("src/lib/regions.ts", {
  "@/content/regions.json": { default: content },
  "./seo": seo,
  "./public-image-url": publicImages,
});
const projectPhotoApi = moduleAt("src/lib/project-photos.ts", {
  "./public-image-url": publicImages,
});
const galleryApi = moduleAt("src/lib/region-gallery.ts", {
  "./project-photos": projectPhotoApi,
});
const photoVariants = moduleAt("src/lib/photo-variants.ts", {
  "@/content/photo-variants.json": {
    default: JSON.parse(
      readFileSync(new URL("../src/content/photo-variants.json", import.meta.url), "utf8"),
    ),
  },
  "./public-image-url": publicImages,
});
const serialize = (value) => JSON.parse(JSON.stringify(value));

function publicAssetFile(src) {
  const path = new URL(src, "https://www.loni-galabau.de").pathname.replace(/^\/__public-webp/, "");
  assert.match(path, /^\/images\/(?:projekte|optimized-v1|regionen)\//);
  return new URL("../public" + path, import.meta.url);
}

function responsiveSources(srcSet) {
  return srcSet.split(",").map((candidate) => {
    const match = candidate.trim().match(/^(\S+) (\d+)w$/);
    assert.ok(match, `Invalid responsive source: ${candidate}`);
    return { src: match[1], width: Number(match[2]) };
  });
}
const slugs = [
  "gartenbau-hattersheim",
  "gartenbau-kelsterbach",
  "gartenbau-hofheim",
  "gartenbau-kriftel",
  "gartenbau-floersheim",
  "gartenbau-hochheim",
  "gartenbau-frankfurt-hoechst",
  "gartenbau-bad-soden",
  "gartenbau-sulzbach-taunus",
  "gartenbau-eschborn",
];

test("ten requested locations have distinct content and valid service and neighbor targets", () => {
  assert.deepEqual(
    content.map((page) => page.slug),
    slugs,
  );
  for (const key of ["title", "description", "h1"]) {
    assert.equal(new Set(content.map((page) => page[key])).size, 10);
  }
  const allowedServices = new Set([
    "gartengestaltung",
    "natursteinarbeiten",
    "pflasterarbeiten",
    "bewaesserungsanlagen",
    "zaunarbeiten",
    "rasenanlagen",
    "erdarbeiten",
    "entwaesserung",
  ]);
  for (const page of content) {
    assert.equal(api.getRegion(page.slug).city, page.city);
    const paragraphs = [...page.intro, ...page.sections.flatMap((section) => section.paragraphs)];
    const links = [...paragraphs.join(" ").matchAll(/\[[^\]]+\]\(\/leistungen\/([a-z-]+)\)/g)];
    assert.ok(new Set(links.map((link) => link[1])).size >= 3, page.slug);
    for (const link of links) assert.ok(allowedServices.has(link[1]), link[1]);
    for (const neighbor of page.relatedSlugs) {
      assert.ok(slugs.includes(neighbor));
      assert.notEqual(neighbor, page.slug);
    }
    assert.ok(Number.isFinite(Date.parse(page.updatedAt)));
    assert.ok(Date.parse(page.updatedAt) <= Date.now(), "Content dates must not be in the future");
    assert.ok(page.faqs.length >= 3);
  }
  assert.throws(() => api.getRegion("gartenbau-unbekannt"), /Unbekannte/);
});

test("regional services share the real business identity without adding fictitious branches", () => {
  for (const page of content) {
    const graph = serialize(api.regionSchema(page))["@graph"];
    const company = graph.find((item) => item["@type"] === "HomeAndConstructionBusiness");
    const service = graph.find((item) => item["@type"] === "Service");
    const webpage = graph.find((item) => item["@type"] === "WebPage");
    const breadcrumb = graph.find((item) => item["@type"] === "BreadcrumbList");
    assert.equal(company["@id"], seo.ORGANIZATION_ID);
    assert.equal(company.url, "https://www.loni-galabau.de/");
    assert.equal(company.address.streetAddress, "Auf der Roos 3");
    assert.equal(company.address.addressLocality, "Hattersheim am Main");
    assert.equal(company.telephone, "+49-6190-9266134");
    assert.equal(company.areaServed.name, "Deutschland");
    assert.equal(company.geo, undefined);
    assert.equal(company.priceRange, undefined);
    assert.equal(service.provider["@id"], company["@id"]);
    assert.equal(service.areaServed.name, page.city);
    assert.equal(webpage.mainEntity["@id"], service["@id"]);
    assert.equal(webpage.url, seo.canonicalUrl("/" + page.slug));
    assert.equal(breadcrumb.itemListElement[1].item, "https://www.loni-galabau.de/einsatzgebiete");
    assert.equal(breadcrumb.itemListElement[2].item, webpage.url);
    assert.equal(graph.filter((item) => item["@type"] === "HomeAndConstructionBusiness").length, 1);
  }
});

test("regional overview exposes every destination once with consistent canonical URLs", () => {
  const graph = serialize(api.regionsOverviewSchema())["@graph"];
  const items = graph.find((item) => item["@type"] === "CollectionPage").mainEntity.itemListElement;
  assert.deepEqual(
    items.map((item) => item.url),
    slugs.map((slug) => seo.canonicalUrl("/" + slug)),
  );
  assert.equal(seo.STATIC_PATHS.filter((path) => path === "/einsatzgebiete").length, 1);
});

test("regional images use complete responsive public assets with real format signatures", () => {
  for (const page of content) {
    const image = api.regionImage(page);
    assert.match(image.src, /^\/__public-webp\/images\/regionen\//);
    assert.ok(image.height === 720 || image.height === 1280);
    for (const width of [640, 960]) {
      for (const format of ["avif", "webp"]) {
        const file = new URL(
          `../public/images/regionen/${page.slug}-loni-galabau-${width}.${format}`,
          import.meta.url,
        );
        assert.ok(statSync(file).size > 100);
        const bytes = readFileSync(file);
        assert.equal(
          bytes.toString("ascii", format === "avif" ? 4 : 8, 12),
          format === "avif" ? "ftypavif" : "WEBP",
        );
      }
    }
  }
});

test("each regional gallery has eight distinct catalog originals with descriptive alt text", () => {
  const catalogBySource = new Map(
    Object.values(projectPhotoApi.projectPhotos).map((photo) => [photo.src, photo]),
  );
  const documentedOriginals = new Set(
    [
      ...readFileSync(new URL("../docs/bildkatalog.md", import.meta.url), "utf8").matchAll(
        /\| \d{3} \| [^\r\n]*?\[Website\]\(\.\.\/public(\/images\/projekte\/[^)]+)\)/g,
      ),
    ].map((match) => match[1]),
  );
  for (const page of content) {
    const photos = galleryApi.getRegionGallery(page.slug);
    assert.equal(photos.length, 8, page.slug);
    assert.equal(new Set(photos.map((photo) => photo.src)).size, 8, page.slug);
    for (const photo of photos) {
      assert.match(photo.src, /^\/images\/projekte\/[a-z0-9-]+\.webp$/);
      const catalogPhoto = catalogBySource.get(photo.src);
      assert.ok(catalogPhoto, `${page.slug}: ${photo.src} must be a catalog photo`);
      assert.ok(
        documentedOriginals.has(photo.src),
        `${photo.src} needs documented photo provenance`,
      );
      assert.equal(photo.alt, catalogPhoto.alt, photo.src);
      assert.ok(photo.alt.trim().length > 0, photo.src);
      assert.ok(photo.label.trim().length > 0, photo.src);
      const original = readFileSync(publicAssetFile(photo.src));
      assert.ok(original.length > 100, photo.src);
      assert.equal(original.toString("ascii", 0, 4), "RIFF", photo.src);
      assert.equal(original.toString("ascii", 8, 12), "WEBP", photo.src);
    }
  }
});

test("gallery photo helpers provide complete optimized assets without repeating the hero", () => {
  for (const page of content) {
    const heroBytes = readFileSync(publicAssetFile(api.regionImage(page).src));
    for (const photo of galleryApi.getRegionGallery(page.slug)) {
      const optimized = photoVariants.optimizedPhoto(photo.src);
      assert.ok(optimized, `${page.slug}: ${photo.src} needs responsive derivatives`);
      assert.ok(optimized.width > 0 && optimized.height > 0, photo.src);
      assert.match(optimized.src, /^\/__public-webp\/images\/optimized-v1\//);
      const webp = responsiveSources(optimized.webp);
      const avif = responsiveSources(optimized.avif);
      assert.deepEqual(
        webp.map((variant) => variant.width),
        avif.map((variant) => variant.width),
        photo.src,
      );
      assert.ok(
        webp.some((variant) => variant.width === 640),
        photo.src,
      );
      assert.ok(
        webp.some((variant) => variant.width === 960),
        photo.src,
      );
      assert.ok(
        webp.some((variant) => variant.src === optimized.src),
        photo.src,
      );
      const originalSize = statSync(publicAssetFile(photo.src)).size;
      for (const [format, variants] of [
        ["webp", webp],
        ["avif", avif],
      ]) {
        for (const variant of variants) {
          assert.ok(variant.width <= optimized.width, `${photo.src} must not be upscaled`);
          const bytes = readFileSync(publicAssetFile(variant.src));
          assert.ok(bytes.length > 100 && bytes.length < originalSize, variant.src);
          assert.equal(
            bytes.toString("ascii", format === "avif" ? 4 : 8, 12),
            format === "avif" ? "ftypavif" : "WEBP",
            variant.src,
          );
          if (format === "webp") {
            assert.ok(!bytes.equals(heroBytes), `${page.slug}: ${photo.src} repeats the hero`);
          }
        }
      }
    }
  }
});

test("unknown locations do not inherit a regional gallery", () => {
  for (const slug of ["", "gartenbau-unbekannt", "toString", "__proto__"]) {
    assert.deepEqual(serialize(galleryApi.getRegionGallery(slug)), [], slug);
  }
});
