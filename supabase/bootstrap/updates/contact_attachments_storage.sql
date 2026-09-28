-- Storage-Konfiguration im bestehenden neuen Projekt (kein erneuter Bootstrap).
-- Die private Sichtbarkeit und bestehende Dateigröße bleiben unverändert.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
WHERE id = 'configurator-images' AND public = false;
