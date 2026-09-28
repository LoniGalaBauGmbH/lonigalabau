
-- Remove broad listing on public buckets (files still served via public URLs)
DROP POLICY IF EXISTS "public read service-images" ON storage.objects;
DROP POLICY IF EXISTS "public read project-images" ON storage.objects;

-- Lock down has_role so it can only be invoked from internal (RLS) contexts
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
