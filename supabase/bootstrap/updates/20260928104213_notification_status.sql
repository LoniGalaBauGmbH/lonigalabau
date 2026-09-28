alter table public.contact_requests add column notification_sent_at timestamptz;
alter table public.applications add column notification_sent_at timestamptz;
create index contact_requests_pending_notification_idx on public.contact_requests(created_at) where notification_sent_at is null;
create index applications_pending_notification_idx on public.applications(created_at) where notification_sent_at is null;
