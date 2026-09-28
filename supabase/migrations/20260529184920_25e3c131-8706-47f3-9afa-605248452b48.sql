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
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (key = 'tracking');

CREATE POLICY "admins manage settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value) VALUES (
  'tracking',
  '{"ga4":"","gtm":"","metaPixel":"","linkedinId":"","tiktokId":"","customHead":"","anonymizeIp":true,"consentVersion":1,"banner":{"title":"Cookies & Privatsphäre","description":"Wir verwenden Cookies, um unsere Website zu betreiben und – mit Ihrer Zustimmung – Reichweite zu messen. Technisch notwendige Cookies sind immer aktiv."}}'::jsonb
);