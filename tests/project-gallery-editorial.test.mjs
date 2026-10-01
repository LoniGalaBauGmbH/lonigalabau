import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const module = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(
    readFileSync(new URL("../src/lib/project-gallery-editorial.ts", import.meta.url), "utf8"),
    {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    },
  ).outputText,
  { module, exports: module.exports, URL },
);
const { projectGalleryEditorial, projectGalleryLastModified, GALLERY_CONTEXT_MODIFIED_AT } =
  module.exports;
const id = "86e3d235-2950-493d-b2ac-e7f9d86e01fb";
const photos = ["terrassenunterkonstruktion.webp", "natursteintreppe-in-der-bauphase.webp"];

test("gallery commentary follows reviewed images from the public site or its known image storage", () => {
  for (const prefix of [
    "/images/projekte/",
    "https://fvctfguvupdcscthrxeb.supabase.co/storage/v1/object/public/project-images/referenzen-2026/",
  ]) {
    const content = projectGalleryEditorial(
      id,
      photos.map((name) => prefix + name),
    );
    assert.ok(content);
    assert.equal(content.planningQuestions.length, 3);
    assert.equal(content.guide.slug, "garten-umgestalten-in-etappen");
  }
});

test("replaced, incomplete or unrelated pictures cannot inherit old gallery claims", () => {
  for (const images of [
    [],
    ["/images/projekte/" + photos[0]],
    ["/images/projekte/replacement.webp"],
    photos.map((name) => "https://other.example/images/projekte/" + name),
  ])
    assert.equal(projectGalleryEditorial(id, images), undefined);
  assert.equal(projectGalleryEditorial("new-project", photos), undefined);
});

test("sitemap uses the published context date while preserving later project edits", () => {
  const reviewed = photos.map((name) => "/images/projekte/" + name);
  const older = "2026-09-28T14:38:08Z";
  const newer = "2026-10-12T10:00:00Z";
  assert.equal(projectGalleryLastModified(id, reviewed, older), GALLERY_CONTEXT_MODIFIED_AT);
  assert.equal(projectGalleryLastModified(id, reviewed, newer), newer);
  assert.equal(projectGalleryLastModified(id, [], older), older);
  assert.equal(projectGalleryLastModified("new-project", reviewed, older), older);
});
