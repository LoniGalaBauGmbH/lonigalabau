begin;
-- This extension was installed for the website in the immediately preceding migration.
-- Recreate it in extensions only while its queue and cron jobs are still empty.
do $$ begin
  if exists(select 1 from net.http_request_queue) or exists(select 1 from cron.job) then
    raise exception 'Refusing extension relocation with active network/cron work';
  end if;
end $$;
drop extension pg_net;
create extension pg_net with schema extensions;
revoke all on schema net from public, anon, authenticated;
revoke all on all tables in schema net from public, anon, authenticated;
revoke all on all sequences in schema net from public, anon, authenticated;
revoke all on all functions in schema net from public, anon, authenticated;
-- Cron runs as postgres. Browser roles must never read its queued Authorization headers.
commit;

