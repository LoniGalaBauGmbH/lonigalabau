import { copyFileSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
if (!existsSync("dist/server/index.mjs")) throw new Error("Cloudflare Worker build missing");
copyFileSync("scripts/asset-response.mjs", "dist/server/asset-response.mjs");
copyFileSync("scripts/public-webp.mjs", "dist/server/public-webp.mjs");
copyFileSync("scripts/public-assets.mjs", "dist/server/public-assets.mjs");
const types = { js: "text/javascript", css: "text/css", png: "image/png", jpg: "image/jpeg",
  jpeg: "image/jpeg", webp: "image/webp", avif: "image/avif", svg: "image/svg+xml", woff2: "font/woff2" };
const assetPaths = readdirSync("dist/client", { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => "/" + path.relative("dist/client", path.join(entry.parentPath, entry.name)).split(path.sep).join("/"))
  .filter((name) => /^\/(?:assets|images|fonts)\/[\w/.-]+\.(?:js|css|png|jpe?g|webp|avif|svg|woff2)$/.test(name))
  .map((name) => [name, types[name.split(".").pop()]]);
writeFileSync("dist/server/public-asset-paths.mjs", `export const publicAssetPaths = new Map(${JSON.stringify(assetPaths)});\n`);
const publicFiles = readdirSync("dist/client", { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".webp"))
  .map(
    (entry) =>
      "/" +
      path
        .relative("dist/client", path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join("/"),
  )
  .filter((name) => /^\/(?:images|assets)\/[\w/.-]+\.webp$/.test(name));
writeFileSync(
  "dist/server/public-webp-paths.mjs",
  `export const publicWebpPaths = new Set(${JSON.stringify(publicFiles)});\n`,
);
writeFileSync(
  "dist/server/index.js",
  `import worker from "./index.mjs";
import { assetResponse } from "./asset-response.mjs";
import { publicWebpResponse } from "./public-webp.mjs";
import { publicWebpPaths } from "./public-webp-paths.mjs";
import { publicAssetResponse } from "./public-assets.mjs";
import { publicAssetPaths } from "./public-asset-paths.mjs";
export default {
  ...worker,
  async fetch(request, env, ctx) {
    const asset = await publicAssetResponse(request, env, publicAssetPaths);
    if (asset) return asset;
    const image = await publicWebpResponse(request, env, publicWebpPaths);
    if (image) return image;
    return assetResponse(request, await worker.fetch(request, env, ctx));
  }
};
`,
);
