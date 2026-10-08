begin;
create table public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  request_token uuid not null unique,
  request_hash text not null check (request_hash ~ '^[a-f0-9]{64}$'),
  ticket_number integer generated always as identity (start with 1000) unique,
  ticket_format_version smallint not null default 2 check (ticket_format_version = 2),
  created_at timestamptz not null default now(),
  company_name text not null, legal_form text not null, street text not null,
  postal_code text not null check (postal_code ~ '^[0-9]{5}$'), city text not null,
  country text not null default 'DE' check (country = 'DE'),
  name text not null, email text not null, phone text not null,
  trades text[] not null check (cardinality(trades) between 1 and 9),
  other_trade text not null default '', service_area text not null,
  workforce text not null check (workforce in ('solo','employees')),
  team_size integer not null check (team_size between 1 and 10000),
  availability text not null check (availability in ('sofort','nach_absprache','ab_datum')),
  available_from text not null default '', uses_subcontractors boolean not null,
  message text not null default '',
  certificate_path text not null unique check (certificate_path ~ '^[0-9a-f-]{36}\.pdf$'),
  certificate_name text not null, certificate_valid_until date not null,
  status text not null default 'new' check (status in ('new','reviewing','documents_missing','shortlisted','rejected')),
  notes text not null default '', notes_version integer not null default 0,
  notification_sent_at timestamptz, notification_email_id text,
  customer_confirmation_requested_at timestamptz default now(),
  customer_confirmation_sent_at timestamptz, customer_confirmation_email_id text,
  customer_confirmation_payload jsonb
);
alter table public.partner_applications enable row level security;
revoke all on public.partner_applications from public, anon, authenticated;
grant select, insert, update, delete on public.partner_applications to service_role;
revoke all on sequence public.partner_applications_ticket_number_seq from public, anon, authenticated;
grant usage, select on sequence public.partner_applications_ticket_number_seq to service_role;
create index partner_applications_created_idx on public.partner_applications(created_at desc);
create index partner_applications_status_idx on public.partner_applications(status);
comment on table public.partner_applications is 'Private German subcontractor applications. Server-admin role only. No automatic legal approval.';

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values('partner-documents','partner-documents',false,10485760,array['application/pdf']);
-- No storage policies: only the server role can write, read or sign these files.

alter table public.email_delivery
  add column partner_application_id uuid references public.partner_applications(id) on delete cascade,
  drop constraint email_delivery_one_parent,
  add constraint email_delivery_one_parent check (num_nonnulls(contact_request_id,application_id,partner_application_id) <= 1);
create index email_delivery_partner_idx on public.email_delivery(partner_application_id);

create or replace function public.record_submission_email_delivery(p_id text,p_status text,p_at timestamptz,p_source text,p_submission_id uuid)
returns void language plpgsql set search_path='' as $$
declare contact_id uuid; application_id uuid; partner_id uuid;
begin
  if p_source='contact_requests' and p_submission_id is not null then
    select id into contact_id from public.contact_requests where id=p_submission_id for key share;
  elsif p_source='applications' and p_submission_id is not null then
    select id into application_id from public.applications where id=p_submission_id for key share;
  elsif p_source='partner_applications' and p_submission_id is not null then
    select id into partner_id from public.partner_applications where id=p_submission_id for key share;
  elsif p_source is null and p_submission_id is null then
    select id into contact_id from public.contact_requests where notification_email_id=p_id or customer_confirmation_email_id=p_id limit 1 for key share;
    if contact_id is null then
      select id into application_id from public.applications where notification_email_id=p_id or customer_confirmation_email_id=p_id limit 1 for key share;
    end if;
    if contact_id is null and application_id is null then
      select id into partner_id from public.partner_applications where notification_email_id=p_id or customer_confirmation_email_id=p_id limit 1 for key share;
    end if;
  end if;
  if contact_id is null and application_id is null and partner_id is null then return; end if;
  insert into public.email_delivery as delivery(email_id,status,occurred_at,contact_request_id,application_id,partner_application_id)
  values(p_id,p_status,p_at,contact_id,application_id,partner_id)
  on conflict(email_id) do update set status=excluded.status,occurred_at=excluded.occurred_at,
    contact_request_id=excluded.contact_request_id,application_id=excluded.application_id,partner_application_id=excluded.partner_application_id
    where excluded.occurred_at>delivery.occurred_at
      and not(delivery.status in ('delivered','bounced','complained','failed') and excluded.status='delayed');
end;
$$;
revoke all on function public.record_submission_email_delivery(text,text,timestamptz,text,uuid) from public, anon, authenticated;
grant execute on function public.record_submission_email_delivery(text,text,timestamptz,text,uuid) to service_role;
create trigger partner_delivery_cleanup after delete on public.partner_applications
for each row execute function public.remove_submission_delivery();
commit;
