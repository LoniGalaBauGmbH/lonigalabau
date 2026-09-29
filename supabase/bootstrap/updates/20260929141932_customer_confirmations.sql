-- Only new submissions receive confirmations. Existing records deliberately stay NULL.
alter table public.contact_requests
  add column customer_confirmation_requested_at timestamptz,
  add column customer_confirmation_sent_at timestamptz,
  add column customer_confirmation_email_id text,
  add column customer_confirmation_payload jsonb;
alter table public.applications
  add column customer_confirmation_requested_at timestamptz,
  add column customer_confirmation_sent_at timestamptz,
  add column customer_confirmation_email_id text,
  add column customer_confirmation_payload jsonb;

alter table public.contact_requests alter column customer_confirmation_requested_at set default now();
alter table public.applications alter column customer_confirmation_requested_at set default now();

create index contact_customer_confirmation_pending_idx on public.contact_requests (created_at)
  where customer_confirmation_requested_at is not null and customer_confirmation_sent_at is null;
create index application_customer_confirmation_pending_idx on public.applications (created_at)
  where customer_confirmation_requested_at is not null and customer_confirmation_sent_at is null;

comment on column public.contact_requests.customer_confirmation_payload is 'Immutable provider request for safe retries within the provider idempotency window. Private; deleted with the submission.';
comment on column public.applications.customer_confirmation_payload is 'Immutable provider request for safe retries within the provider idempotency window. Private; deleted with the submission.';
