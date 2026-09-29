alter table public.contact_requests add column notification_email_id text;
alter table public.applications add column notification_email_id text;
create table public.email_delivery (
 email_id text primary key check(length(email_id) <= 100),
 status text not null check(status in ('delivered','bounced','complained','failed','delayed')),
 occurred_at timestamptz not null
);
alter table public.email_delivery enable row level security;
revoke all on public.email_delivery from public, anon, authenticated;
grant select, insert, update, delete on public.email_delivery to service_role;
create function public.record_email_delivery(p_id text,p_status text,p_at timestamptz)
returns void language sql security invoker set search_path = '' as $$
 insert into public.email_delivery as delivery(email_id,status,occurred_at) values(p_id,p_status,p_at)
 on conflict(email_id) do update set status=excluded.status,occurred_at=excluded.occurred_at
 where excluded.occurred_at > delivery.occurred_at
 and not (delivery.status in ('delivered','bounced','complained','failed') and excluded.status='delayed');
$$;
revoke all on function public.record_email_delivery(text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.record_email_delivery(text,text,timestamptz) to service_role;
create extension if not exists pg_cron;
create extension if not exists pg_net;
