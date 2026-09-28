-- Loni Galabau: Basis für ein NEUES, leeres Supabase-Projekt.
-- Einmal als postgres im SQL Editor ausführen. Keine alten Setup-Dateien ergänzen.
-- Vorhandene Tabellen werden weder gelöscht noch überschrieben.
BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('user_roles', 'services', 'projects', 'jobs',
        'applications', 'contact_requests', 'newsletter_subscribers', 'site_settings')
  ) THEN
    RAISE EXCEPTION 'Abbruch: Loni-Tabellen existieren bereits. Nur im neuen, leeren Projekt ausführen.';
  END IF;
END $$;

CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{1,120}$'),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  category text,
  short_text text NOT NULL DEFAULT '',
  long_text text NOT NULL DEFAULT '',
  hero_image text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  meta_title text,
  meta_description text,
  geo_focus text,
  custom_benefits jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(custom_benefits) = 'array'),
  custom_faqs jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(custom_faqs) = 'array'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  location text,
  description text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{1,120}$'),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  description text NOT NULL DEFAULT '',
  requirements text NOT NULL DEFAULT '',
  location text,
  employment_type text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (length(email) BETWEEN 3 AND 320),
  phone text CHECK (length(phone) <= 50),
  message text CHECK (length(message) <= 5000),
  cv_path text CHECK (length(cv_path) <= 500),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'accepted', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (length(email) BETWEEN 3 AND 320),
  phone text CHECK (length(phone) <= 50),
  subject text CHECK (length(subject) <= 200),
  message text NOT NULL CHECK (length(message) BETWEEN 1 AND 5000),
  image_paths text[] NOT NULL DEFAULT '{}' CHECK (cardinality(image_paths) <= 3),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'handled', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (length(email) BETWEEN 3 AND 320),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX newsletter_email_unique ON public.newsletter_subscribers (lower(email));

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER jobs_updated BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX projects_service_id_idx ON public.projects (service_id);
CREATE INDEX applications_job_id_idx ON public.applications (job_id);
CREATE INDEX applications_status_created_idx ON public.applications (status, created_at DESC);
CREATE INDEX contacts_status_created_idx ON public.contact_requests (status, created_at DESC);
CREATE INDEX services_public_sort_idx ON public.services (sort_order) WHERE active;

-- Alle Schreibzugriffe erfolgen über validierende Serverfunktionen.
-- Der Server prüft für Verwaltungsaktionen zuerst Sitzung UND Adminrolle.
REVOKE ALL ON public.user_roles, public.services, public.projects, public.jobs,
  public.applications, public.contact_requests, public.newsletter_subscribers,
  public.site_settings FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.user_roles, public.services, public.projects, public.jobs,
  public.applications, public.contact_requests, public.newsletter_subscribers,
  public.site_settings TO service_role;
GRANT SELECT ON public.services, public.projects, public.jobs, public.site_settings TO anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY own_role ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY active_services ON public.services FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY active_projects ON public.projects FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY active_jobs ON public.jobs FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY public_settings ON public.site_settings FOR SELECT TO anon, authenticated
  USING (key IN ('images', 'partners', 'tracking'));
-- Bewusst keine Browser-Policies für Anfragen, Bewerbungen und Newsletterdaten.

INSERT INTO public.site_settings (key, value) VALUES
  ('images', '{}'::jsonb),
  ('partners', '[]'::jsonb),
  ('tracking', '{"ga4":"","gtm":"","metaPixel":"","linkedinId":"","tiktokId":"","customHead":"","anonymizeIp":true,"consentVersion":1,"banner":{"title":"Cookies & Privatsphäre","description":"Wir verwenden Cookies, um unsere Website zu betreiben und – mit Ihrer Zustimmung – Reichweite zu messen. Technisch notwendige Cookies sind immer aktiv."}}'::jsonb);

COMMIT;
