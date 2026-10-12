-- Additive bootstrap update, not a fabricated Supabase migration-history entry.
-- Apply once before publishing the matching website worker. Existing contacts stay unreviewed.
BEGIN;
ALTER TABLE public.contact_requests
  ADD COLUMN lead_qualification text NOT NULL DEFAULT 'unreviewed'
    CHECK (lead_qualification IN ('unreviewed', 'qualified', 'unqualified', 'spam', 'duplicate', 'test')),
  ADD COLUMN lead_qualification_version integer NOT NULL DEFAULT 0 CHECK (lead_qualification_version >= 0),
  ADD COLUMN lead_qualification_reviewed_at timestamptz,
  ADD COLUMN discovery_source text
    CHECK (discovery_source IN ('google_search', 'google_maps', 'recommendation', 'social_media', 'returning_customer', 'other')),
  ADD CONSTRAINT contacts_qualification_review_check CHECK (
    (lead_qualification = 'unreviewed') = (lead_qualification_reviewed_at IS NULL)
  );
CREATE INDEX contacts_created_at_idx ON public.contact_requests (created_at DESC);
CREATE INDEX contacts_qualification_created_idx ON public.contact_requests (lead_qualification, created_at DESC);
-- No changes to RLS, browser privileges, notes, processing status, tickets or private storage.
COMMIT;
