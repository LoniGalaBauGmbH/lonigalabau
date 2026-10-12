BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE public.contact_requests DROP CONSTRAINT contact_requests_image_paths_check;
ALTER TABLE public.contact_requests ADD CONSTRAINT contact_requests_image_paths_check CHECK (cardinality(image_paths) <= 10);
COMMIT;
