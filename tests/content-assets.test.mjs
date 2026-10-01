import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { summarizeGuides } from "../scripts/generate-guide-index.mjs";
const json = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
test("guide summaries stay in sync with the complete articles", () => {
  assert.deepEqual(
    json("../src/content/ratgeber-index.json"),
    summarizeGuides(json("../src/content/ratgeber.json")),
  );
});
test("responsive photo catalog points to complete, smaller published assets", () => {
  for (const [filename, photo] of Object.entries(json("../src/content/photo-variants.json"))) {
    assert.ok(photo.widths.includes(640));
    const original = statSync(
      new URL(`../public/images/projekte/${filename}`, import.meta.url),
    ).size;
    for (const width of photo.widths) {
      assert.ok(width <= photo.width, `${filename} must not be upscaled`);
      for (const format of ["avif", "webp"]) {
        const size = statSync(
          new URL(
            `../public/images/optimized-v1/${filename.replace(/\.webp$/, "")}-${width}.${format}`,
            import.meta.url,
          ),
        ).size;
        assert.ok(size > 0 && size < original, `${filename} ${width} ${format}`);
      }
    }
  }
});
