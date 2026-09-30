// Regenerate with: node scripts/generate-menu-images.mjs <absolute-path-to-sharp>
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const sharp = createRequire(import.meta.url)(process.argv[2] || "sharp");
const root = new URL("../", import.meta.url);
async function loadCatalog(path, dependencies = {}) {
  const source = await fs.readFile(new URL(path, root), "utf8");
  const exports = {};
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => {
      if (!(name in dependencies)) throw new Error(`Unexpected catalog dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}
const photos = await loadCatalog("src/lib/project-photos.ts");
const { serviceImageBySlug } = await loadCatalog("src/lib/service-images.ts", {
  "@/lib/project-photos": photos,
});
await fs.mkdir(new URL("public/images/menu/", root), { recursive: true });
for (const [slug, src] of Object.entries(serviceImageBySlug)) {
  const bytes = await sharp(await fs.readFile(new URL("public" + src, root)))
    .resize(176, 176, { fit: "cover" })
    .webp({ quality: 76 })
    .toBuffer();
  await fs.writeFile(new URL(`public/images/menu/${slug}.webp`, root), bytes);
  console.log(`${slug}: ${bytes.length} bytes`);
}
const feature = await sharp(
  await fs.readFile(new URL("public" + serviceImageBySlug.gartengestaltung, root)),
)
  .resize(640, 800, { fit: "cover" })
  .webp({ quality: 78 })
  .toBuffer();
await fs.writeFile(new URL("public/images/menu/gartenplaner.webp", root), feature);
console.log(`feature: ${feature.length} bytes`);
