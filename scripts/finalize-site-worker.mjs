import { copyFileSync, existsSync, writeFileSync } from "node:fs";
if (!existsSync("dist/server/index.mjs")) throw new Error("Cloudflare Worker build missing");
copyFileSync("scripts/asset-response.mjs", "dist/server/asset-response.mjs");
writeFileSync(
  "dist/server/index.js",
  `import worker from "./index.mjs";
import { assetResponse } from "./asset-response.mjs";
export default {
  ...worker,
  async fetch(request, env, ctx) {
    return assetResponse(request, await worker.fetch(request, env, ctx));
  }
};
`,
);
