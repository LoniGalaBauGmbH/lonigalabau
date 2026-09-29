// Regenerate with: node scripts/generate-email-logos.mjs <absolute-path-to-sharp>
import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] || "sharp");
const root = new URL("../", import.meta.url);
const inputs = [
  {
    source: "src/assets/logo-loni.svg",
    filename: "loni-galabau.png",
    content_id: "loni-logo",
    width: 480,
    white: true,
  },
  {
    source: "src/assets/logo-gartenverband.svg",
    filename: "gartenverband.png",
    content_id: "gartenverband-logo",
    width: 160,
    white: true,
  },
];
const attachments = [];
for (const item of inputs) {
  let svg = await fs.readFile(new URL(item.source, root), "utf8");
  if (item.white) svg = svg.replace(/#[a-fA-F0-9]{6}\b/g, "#ffffff");
  const png = await sharp(Buffer.from(svg), { density: 192 })
    .resize({ width: item.width })
    .png()
    .toBuffer();
  attachments.push({
    filename: item.filename,
    content: png.toString("base64"),
    content_type: "image/png",
    content_id: item.content_id,
  });
  console.log(item.filename + ": " + png.length + " bytes");
}
await fs.writeFile(
  new URL("src/lib/email-logo-assets.server.ts", root),
  "// Generated from the original SVG logos by scripts/generate-email-logos.mjs.\n// Embedded PNGs keep mail clients independent of remote image downloads.\nexport const EMAIL_LOGO_ATTACHMENTS = " +
    JSON.stringify(attachments, null, 2) +
    ";\n",
);
