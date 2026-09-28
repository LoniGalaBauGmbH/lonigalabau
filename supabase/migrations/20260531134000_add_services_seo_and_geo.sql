-- =============================================================
-- MIGRATION: ADD SERVICES SEO & GEO-SEO COLUMNS
-- Ausführen in: Supabase Dashboard → SQL Editor (falls lokal nicht auto-migriert)
-- =============================================================

-- Spalten hinzufügen, falls sie noch nicht existieren
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS geo_focus TEXT,
  ADD COLUMN IF NOT EXISTS custom_benefits JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_faqs JSONB DEFAULT '[]'::jsonb;

-- Kommentare hinzufügen für bessere Dokumentation
COMMENT ON COLUMN public.services.meta_title IS 'Spezieller HTML-Seitentitel für Suchmaschinen (SEO)';
COMMENT ON COLUMN public.services.meta_description IS 'HTML-Metabeschreibung für Suchmaschinenergebnisse (CTR-Optimiert)';
COMMENT ON COLUMN public.services.geo_focus IS 'Städte/Regionen für lokalen Fokus (z.B. Frankfurt, Hattersheim)';
COMMENT ON COLUMN public.services.custom_benefits IS 'Liste maßgeschneiderter Vorteile als JSONB [{t: "Titel", d: "Beschreibung"}]';
COMMENT ON COLUMN public.services.custom_faqs IS 'Liste individueller FAQ-Einträge als JSONB [{q: "Frage", a: "Antwort"}]';

-- Öffentliche Read-Policy für Partners-Key in site_settings
DROP POLICY IF EXISTS "public_reads_partners_settings" ON public.site_settings;
CREATE POLICY "public_reads_partners_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (key = 'partners');

