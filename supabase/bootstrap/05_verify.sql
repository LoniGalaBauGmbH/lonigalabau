-- Prüfung im eingerichteten Supabase-Projekt als postgres.
-- Testdaten und Änderungen bleiben ausschließlich in dieser Transaktion.
BEGIN;
SET LOCAL ROLE service_role;
DO $$
DECLARE
  contact_id uuid;
  application_id uuid;
  subscriber_id uuid;
  service_id uuid;
  current_status text;
  updated_count integer;
BEGIN
  INSERT INTO public.contact_requests (name, email, message)
    VALUES ('Technischer Test', 'check@example.invalid', 'Rollback-Verbindungstest')
    RETURNING id INTO contact_id;
  UPDATE public.contact_requests SET status = 'handled' WHERE id = contact_id;
  SELECT status INTO current_status FROM public.contact_requests WHERE id = contact_id;
  IF current_status IS DISTINCT FROM 'handled' THEN
    RAISE EXCEPTION 'Anfrage konnte nicht aktualisiert werden.';
  END IF;
  DELETE FROM public.contact_requests WHERE id = contact_id;
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  IF updated_count <> 1 THEN RAISE EXCEPTION 'Anfrage konnte nicht gelöscht werden.'; END IF;

  INSERT INTO public.applications (name, email, message)
    VALUES ('Technischer Test', 'check@example.invalid', 'Rollback-Verbindungstest')
    RETURNING id INTO application_id;
  UPDATE public.applications SET status = 'reviewing' WHERE id = application_id;
  SELECT status INTO current_status FROM public.applications WHERE id = application_id;
  IF current_status IS DISTINCT FROM 'reviewing' THEN
    RAISE EXCEPTION 'Bewerbung konnte nicht aktualisiert werden.';
  END IF;

  INSERT INTO public.newsletter_subscribers (email)
    VALUES (gen_random_uuid()::text || '@example.invalid')
    RETURNING id INTO subscriber_id;
  IF subscriber_id IS NULL THEN RAISE EXCEPTION 'Newsletter-Schreibzugriff fehlgeschlagen.'; END IF;

  INSERT INTO public.services (slug, title, active, updated_at)
    VALUES ('verification-' || gen_random_uuid()::text, 'Rollback-Prüfung', false, '2000-01-01')
    RETURNING id INTO service_id;
  UPDATE public.services SET title = 'Rollback-Prüfung geändert' WHERE id = service_id;
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND updated_at > '2000-01-01') THEN
    RAISE EXCEPTION 'Zeitstempel-Trigger funktioniert nicht.';
  END IF;
END $$;

SET LOCAL ROLE anon;
DO $$
DECLARE
  table_name text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE active) THEN
    RAISE EXCEPTION 'Öffentliche Leistungen nicht lesbar.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.services WHERE NOT active) THEN
    RAISE EXCEPTION 'Inaktive Leistungen sind öffentlich sichtbar.';
  END IF;
  FOREACH table_name IN ARRAY ARRAY['applications','contact_requests','newsletter_subscribers','user_roles'] LOOP
    BEGIN
      EXECUTE format('SELECT 1 FROM public.%I LIMIT 1', table_name);
      RAISE EXCEPTION 'Unzulässiger öffentlicher Lesezugriff auf %.', table_name;
    EXCEPTION WHEN insufficient_privilege THEN
      NULL;
    END;
  END LOOP;
  FOREACH table_name IN ARRAY ARRAY['user_roles','services','projects','jobs','applications','contact_requests','newsletter_subscribers','site_settings'] LOOP
    IF has_table_privilege(current_user, 'public.' || table_name, 'INSERT,UPDATE,DELETE') THEN
      RAISE EXCEPTION 'Öffentlicher Schreibzugriff auf %.', table_name;
    END IF;
  END LOOP;
END $$;

SET LOCAL ROLE authenticated;
DO $$
DECLARE
  table_name text;
BEGIN
  PERFORM 1 FROM public.user_roles LIMIT 1;
  FOREACH table_name IN ARRAY ARRAY['applications','contact_requests','newsletter_subscribers'] LOOP
    BEGIN
      EXECUTE format('SELECT 1 FROM public.%I LIMIT 1', table_name);
      RAISE EXCEPTION 'Unzulässiger Browser-Lesezugriff auf %.', table_name;
    EXCEPTION WHEN insufficient_privilege THEN
      NULL;
    END;
  END LOOP;
  FOREACH table_name IN ARRAY ARRAY['user_roles','services','projects','jobs','applications','contact_requests','newsletter_subscribers','site_settings'] LOOP
    IF has_table_privilege(current_user, 'public.' || table_name, 'INSERT,UPDATE,DELETE') THEN
      RAISE EXCEPTION 'Browser-Schreibzugriff auf %.', table_name;
    END IF;
  END LOOP;
END $$;
ROLLBACK;

SELECT 'OK: Server-Schreibzugriffe, Zeitstempel und Browser-Zugriffssperren geprüft; Testdaten zurückgerollt.' AS verification;
