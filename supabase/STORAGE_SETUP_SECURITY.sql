-- =============================================================
-- SUPABASE SECURITY FIXES
-- Ausführen in: Supabase Dashboard → SQL Editor
-- =============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. STORAGE BUCKETS ERSTELLEN (falls noch nicht vorhanden)
--    Der Server-Upload via supabaseAdmin erstellt Buckets
--    automatisch, aber hier als Backup:
-- ──────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('project-images',      'project-images',      true,  15728640,
   ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']),
  ('service-images',      'service-images',      true,  15728640,
   ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']),
  ('configurator-images', 'configurator-images', true,  15728640,
   ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']),
  ('cvs',                 'cvs',                 false, 10485760,
   ARRAY['application/pdf','image/jpeg','image/jpg','image/png'])
ON CONFLICT (id) DO NOTHING;


-- ──────────────────────────────────────────────────────────────
-- 2. SECURITY FIX: Breite SELECT-Policy auf configurator-images
--    ENTFERNEN (laut Supabase Security Advisor)
--    Public-Buckets erlauben URL-Zugriff ohne explizite Policy –
--    wir brauchen kein Listing.
-- ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "public reads configurator images" ON storage.objects;
DROP POLICY IF EXISTS "Public read configurator-images"  ON storage.objects;
DROP POLICY IF EXISTS "Allow public read configurator"   ON storage.objects;

-- Exakt gezielte Read-Policy nur für direkten Objektzugriff
-- (kein Listing, kein Wildcard auf alle Files)
CREATE POLICY "direct_object_read_configurator"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'configurator-images'
    AND name IS NOT NULL  -- Nur konkrete Objekte, kein leerer Prefix-Listing
  );


-- ──────────────────────────────────────────────────────────────
-- 3. PUBLIC READ POLICIES für die anderen Buckets
-- ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "public_read_project_images"  ON storage.objects;
DROP POLICY IF EXISTS "public_read_service_images"  ON storage.objects;

CREATE POLICY "public_read_project_images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'project-images');

CREATE POLICY "public_read_service_images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'service-images');


-- ──────────────────────────────────────────────────────────────
-- 4. HINWEIS: Uploads laufen jetzt über supabaseAdmin (Server)
--    → Keine Client-Upload-Policies nötig!
--    Der service_role Key bypass alle RLS-Checks automatisch.
-- ──────────────────────────────────────────────────────────────

-- Optional: Falls du doch mal Client-seitig hochladen willst
-- (z.B. für CVs von Bewerbern), diese Policy aktivieren:
-- CREATE POLICY "anon_upload_cvs"
--   ON storage.objects FOR INSERT TO anon
--   WITH CHECK (bucket_id = 'cvs');


-- ──────────────────────────────────────────────────────────────
-- 5. SITE_SETTINGS – Öffentliche Read-Policy für Images-Key
-- ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "public reads images settings" ON site_settings;

CREATE POLICY "public_reads_images_settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (key = 'images');
