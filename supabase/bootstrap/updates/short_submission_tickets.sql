-- Additive rollout: apply before the website code. Never reset these sequences.
begin;

alter table public.contact_requests
  add column ticket_number integer generated always as identity (start with 1000),
  add constraint contact_requests_ticket_number_key unique (ticket_number),
  add constraint contact_requests_ticket_number_min check (ticket_number >= 1000),
  add column ticket_format_version smallint not null default 1
    check (ticket_format_version in (1, 2));

alter table public.applications
  add column ticket_number integer generated always as identity (start with 1000),
  add constraint applications_ticket_number_key unique (ticket_number),
  add constraint applications_ticket_number_min check (ticket_number >= 1000),
  add column ticket_format_version smallint not null default 1
    check (ticket_format_version in (1, 2));

-- Version 1 preserves original mail payloads, including old workers during rollout.
-- Only the new server inserts explicitly choose version 2 (A-1000 / B-1000).
-- UUIDs, foreign keys, RLS and private confirmation payloads remain unchanged.
revoke all on sequence public.contact_requests_ticket_number_seq,
  public.applications_ticket_number_seq from public, anon, authenticated;
grant usage, select on sequence public.contact_requests_ticket_number_seq,
  public.applications_ticket_number_seq to service_role;

commit;
