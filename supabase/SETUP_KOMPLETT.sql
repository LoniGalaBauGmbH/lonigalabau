-- ============================================================
-- LONI GALABAU GMBH – SUPABASE SETUP (ALLE MIGRATIONS KOMBINIERT)
-- Einfach diesen gesamten Block in den Supabase SQL Editor kopieren
-- und auf "Run" klicken.
-- ============================================================


-- ──────────────────────────────────────────────────────────────
-- 1. ROLLEN & BERECHTIGUNGEN
-- ──────────────────────────────────────────────────────────────

CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users see own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Shared updated_at trigger fn
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;


-- ──────────────────────────────────────────────────────────────
-- 2. LEISTUNGEN (SERVICES)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT,
  short_text TEXT NOT NULL DEFAULT '',
  long_text TEXT NOT NULL DEFAULT '',
  hero_image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads active services" ON public.services FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ──────────────────────────────────────────────────────────────
-- 3. PROJEKTE
-- ──────────────────────────────────────────────────────────────

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  location TEXT,
  description TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads active projects" ON public.projects FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ──────────────────────────────────────────────────────────────
-- 4. STELLENANZEIGEN (JOBS)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '',
  location TEXT,
  employment_type TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads active jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "admins manage jobs" ON public.jobs FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_jobs_updated BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ──────────────────────────────────────────────────────────────
-- 5. BEWERBUNGEN
-- ──────────────────────────────────────────────────────────────

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  cv_path TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can apply" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (
  length(name) BETWEEN 1 AND 200 AND length(email) BETWEEN 3 AND 320 AND (message IS NULL OR length(message) <= 5000)
);
CREATE POLICY "admins read applications" ON public.applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update applications" ON public.applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete applications" ON public.applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));


-- ──────────────────────────────────────────────────────────────
-- 6. KONTAKTANFRAGEN
-- ──────────────────────────────────────────────────────────────

CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can contact" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (
  length(name) BETWEEN 1 AND 200 AND length(email) BETWEEN 3 AND 320 AND length(message) BETWEEN 1 AND 5000
);
CREATE POLICY "admins read contacts" ON public.contact_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update contacts" ON public.contact_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete contacts" ON public.contact_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));


-- ──────────────────────────────────────────────────────────────
-- 7. NEWSLETTER
-- ──────────────────────────────────────────────────────────────

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone subscribes" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (length(email) BETWEEN 3 AND 320);
CREATE POLICY "admins read newsletter" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete newsletter" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));


-- ──────────────────────────────────────────────────────────────
-- 8. WEBSITE-EINSTELLUNGEN (Tracking, Bilder, etc.)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public reads tracking settings"
ON public.site_settings FOR SELECT TO anon, authenticated
USING (key = 'tracking');

CREATE POLICY "admins manage settings"
ON public.site_settings FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Standard-Tracking-Einstellungen
INSERT INTO public.site_settings (key, value) VALUES (
  'tracking',
  '{"ga4":"","gtm":"","metaPixel":"","linkedinId":"","tiktokId":"","customHead":"","anonymizeIp":true,"consentVersion":1,"banner":{"title":"Cookies & Privatsphäre","description":"Wir verwenden Cookies, um unsere Website zu betreiben und – mit Ihrer Zustimmung – Reichweite zu messen. Technisch notwendige Cookies sind immer aktiv."}}'::jsonb
);


-- ──────────────────────────────────────────────────────────────
-- 9. STORAGE BUCKETS
-- ──────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES
  ('service-images',        'service-images',        true),
  ('project-images',        'project-images',        true),
  ('configurator-images',   'configurator-images',   true),
  ('cvs',                   'cvs',                   false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "admin write service-images"  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='service-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update service-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='service-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete service-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='service-images' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin write project-images"  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='project-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update project-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='project-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete project-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='project-images' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "anyone uploads configurator images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id='configurator-images');
CREATE POLICY "public reads configurator images"   ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id='configurator-images');

CREATE POLICY "anyone uploads cv" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id='cvs');
CREATE POLICY "admins read cvs"   ON storage.objects FOR SELECT TO authenticated USING (bucket_id='cvs' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete cvs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='cvs' AND public.has_role(auth.uid(),'admin'));

-- Security: has_role darf nur intern aufgerufen werden
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;


-- ──────────────────────────────────────────────────────────────
-- ✅ FERTIG – Nach dem Ausführen:
-- 1. Authentication → Users → "Add user" → E-Mail + Passwort
-- 2. Dann dieses SQL ausführen (E-Mail anpassen!):
--
--   INSERT INTO public.user_roles (user_id, role)
--   SELECT id, 'admin' FROM auth.users WHERE email = 'deine@email.de';
--
-- ──────────────────────────────────────────────────────────────
