-- Benutzer zuerst in Supabase Authentication anlegen.
-- Dann genau dessen E-Mail unten eintragen. Kein Passwort in SQL speichern.
BEGIN;
DO $$
DECLARE
  admin_email text := 'ADMIN_EMAIL_HIER_EINTRAGEN';
  admin_id uuid;
BEGIN
  SELECT id INTO STRICT admin_id FROM auth.users WHERE lower(email) = lower(admin_email);
  INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
EXCEPTION
  WHEN no_data_found THEN
    RAISE EXCEPTION 'Kein Auth-Benutzer mit dieser E-Mail gefunden. Zuerst Benutzer anlegen und E-Mail im Skript ersetzen.';
END $$;
COMMIT;
