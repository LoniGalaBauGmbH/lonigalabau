-- Phone-only callback requests share the existing private inquiry inbox.
begin;
alter table public.contact_requests alter column email drop not null;
alter table public.contact_requests add constraint contact_requests_reachable_check
  check (email is not null or (phone is not null and length(trim(phone)) >= 7));
-- Only the callback endpoint accepts absent email; other public schemas still require it.
-- Its server insert sets customer_confirmation_requested_at=NULL without an email.
-- Existing RLS, grants, records and ticket numbers remain untouched.
commit;
