// Run with: node --env-file=.env scripts/import-project-gallery.mjs --apply
// Uploads only reviewed, metadata-free WebP exports and preserves the homepage hero.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const content = JSON.parse(fs.readFileSync("content/project-gallery.json", "utf8"));
const comparisonOnly = process.argv.includes("--comparison-only");
const aboutHeroOnly = process.argv.includes("--about-hero-only");
assert.ok(!(comparisonOnly && aboutHeroOnly), "Choose a single image import scope.");
const imageKeys = comparisonOnly
  ? ["before_garden", "after_garden"]
  : aboutHeroOnly
    ? ["about_hero_bg"]
    : null;
const imagesOnly = imageKeys !== null;
const siteImages = Object.fromEntries(
  Object.entries(content.siteImages).filter(([key]) => !imageKeys || imageKeys.includes(key)),
);
const photos = imagesOnly
  ? Object.values(siteImages).map((id) => content.photos[id])
  : Object.values(content.photos);
if (!process.argv.includes("--apply")) {
  console.log(
    `Ready: ${photos.length} photos, ${imagesOnly ? 0 : content.projects.length} galleries. Use --apply to import.`,
  );
  process.exit(0);
}
assert.equal(new URL(process.env.SUPABASE_URL).hostname, "fvctfguvupdcscthrxeb.supabase.co");
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});
const checked = async (query) => {
  const result = await query;
  if (result.error) throw result.error;
  return result.data;
};
const services = await checked(client.from("services").select("id,slug,hero_image"));
const setting = await checked(
  client.from("site_settings").select("value").eq("key", "images").maybeSingle(),
);
const existing = await checked(
  client
    .from("projects")
    .select("*")
    .in(
      "id",
      content.projects.map((p) => p.id),
    ),
);
const previousImages = setting?.value ?? {};
const backup = {
  services,
  images: previousImages,
  existing,
  createdProjectIds: content.projects
    .map((p) => p.id)
    .filter((id) => !existing.some((p) => p.id === id)),
};
const backupDir = path.join(".git", "photo-import-backups");
fs.mkdirSync(backupDir, { recursive: true });
fs.writeFileSync(path.join(backupDir, `${Date.now()}.json`), JSON.stringify(backup, null, 2));
const bucket = client.storage.from("project-images");
const files = photos.flatMap((src) => [src, src.replace(/\.webp$/, "-small.webp")]);
const present = process.argv.includes("--only-missing")
  ? new Set(
      (await checked(bucket.list(content.collection, { limit: 1000 }))).map((file) => file.name),
    )
  : new Set();
const uploads = files.filter((src) => !present.has(path.basename(src)));
for (let i = 0; i < uploads.length; i += 5) {
  await Promise.all(
    uploads.slice(i, i + 5).map(async (src) => {
      assert.match(src, /^\/images\/projekte\/[a-z0-9-]+\.webp$/);
      const bytes = fs.readFileSync(path.join("public", src));
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
      const destination = `${content.collection}/${path.basename(src)}`;
      await checked(
        bucket.upload(destination, bytes, {
          contentType: "image/webp",
          upsert: true,
          cacheControl: "31536000",
        }),
      );
    }),
  );
}
const url = (src) =>
  bucket.getPublicUrl(`${content.collection}/${path.basename(src)}`).data.publicUrl;
if (!imagesOnly) {
  for (const [slug, photoId] of Object.entries(content.services)) {
    const service = services.find((s) => s.slug === slug);
    assert.ok(service, slug);
    await checked(
      client
        .from("services")
        .update({ hero_image: url(content.photos[photoId]) })
        .eq("id", service.id),
    );
  }
  await checked(
    client.from("projects").upsert(
      content.projects.map(({ service, ...project }) => ({
        ...project,
        service_id: services.find((s) => s.slug === service).id,
        images: project.images.map(url),
      })),
      { onConflict: "id" },
    ),
  );
}
// Scoped image imports preserve every other image setting and all galleries.
if (imagesOnly || process.argv.includes("--site-images")) {
  const latest = await checked(
    client.from("site_settings").select("value").eq("key", "images").maybeSingle(),
  );
  const merged = {
    ...(latest?.value ?? {}),
    ...Object.fromEntries(
      Object.entries(siteImages).map(([key, id]) => [key, url(content.photos[id])]),
    ),
  };
  assert.equal(merged.hero_bg, latest?.value?.hero_bg);
  await checked(
    client.from("site_settings").upsert({ key: "images", value: merged }, { onConflict: "key" }),
  );
}
const verified = await checked(
  client
    .from("projects")
    .select("id,images,service_id")
    .in(
      "id",
      content.projects.map((p) => p.id),
    ),
);
assert.equal(verified.length, content.projects.length);
for (const p of verified) assert.ok(p.images.length && p.service_id);
const current = await checked(
  client.from("site_settings").select("value").eq("key", "images").maybeSingle(),
);
assert.equal(current?.value?.hero_bg, previousImages.hero_bg);
if (imagesOnly) {
  for (const [key, id] of Object.entries(siteImages)) {
    assert.equal(current?.value?.[key], url(content.photos[id]));
  }
  const withoutSelectedImages = (images) =>
    Object.fromEntries(Object.entries(images).filter(([key]) => !Object.hasOwn(siteImages, key)));
  assert.deepEqual(withoutSelectedImages(current.value), withoutSelectedImages(previousImages));
}
console.log(
  JSON.stringify({
    uploaded: uploads.length,
    services: imagesOnly ? 0 : Object.keys(content.services).length,
    galleries: imagesOnly ? 0 : verified.length,
    homepageHeroUnchanged: true,
  }),
);
