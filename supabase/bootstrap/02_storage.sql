-- Nach 01_schema.sql im NEUEN Projekt ausführen.
-- Öffentliche Bild-URLs für Website-Inhalte; private Dateien für Kundendaten.
BEGIN;
DO $$
BEGIN
  IF to_regclass('public.contact_requests') IS NULL THEN
    RAISE EXCEPTION 'Zuerst 01_schema.sql ausführen.';
  END IF;
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id IN (
    'service-images', 'project-images', 'configurator-images', 'cvs'
  )) THEN
    RAISE EXCEPTION 'Abbruch: Loni-Buckets existieren bereits. Nicht auf die alte Datenbank anwenden.';
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('service-images', 'service-images', true, 15728640,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('project-images', 'project-images', true, 15728640,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('configurator-images', 'configurator-images', false, 10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('cvs', 'cvs', false, 10485760,
    ARRAY['application/pdf', 'image/jpeg', 'image/png']);

-- Keine Browser-Uploads oder Objektlisten. Die Serverfunktionen verwenden
-- den Secret Key. Private Downloads brauchen kurzlebige signierte URLs.
-- Öffentliche Buckets können Dateien über ihre URL ohne SELECT-Policy ausliefern.
COMMIT;
