begin;
-- The temporary pg_net setup has no users or requests. It could not revoke
-- provider-owned PUBLIC queue grants, so never enqueue a long-lived bearer there.
do $$ begin
  if exists(select 1 from net.http_request_queue) or exists(select 1 from cron.job) then
    raise exception 'Refusing removal while network/cron work exists';
  end if;
end $$;
drop extension pg_net;
create extension if not exists http with schema extensions;
-- Revoke only routines belonging to this extension, leaving other extensions alone.
do $$ declare r record; begin
  for r in select p.oid::regprocedure as signature from pg_proc p
    join pg_depend d on d.objid=p.oid and d.classid='pg_proc'::regclass
    join pg_extension e on e.oid=d.refobjid and d.refclassid='pg_extension'::regclass
    where e.extname='http' and d.deptype='e'
  loop execute format('revoke execute on function %s from public, anon, authenticated',r.signature);
  end loop;
end $$;
create schema if not exists website_ops;
revoke all on schema website_ops from public, anon, authenticated, service_role;
create or replace function website_ops.retry_notifications()
returns jsonb language plpgsql security invoker set search_path=''
as $fn$
declare token text; response extensions.http_response;
begin
  select decrypted_secret into token from vault.decrypted_secrets
    where name='loni_notification_cron';
  if token is null or length(token)<32 then raise exception 'Notification retry secret unavailable'; end if;
  select * into response from extensions.http((
    'POST',
    'https://loni-galabau.serhad1999.chatgpt.site/api/notifications/retry',
    array[row('Authorization','Bearer '||token)::extensions.http_header],
    'application/json','{}'
  )::extensions.http_request);
  if response.status<>200 then raise exception 'Notification retry failed with HTTP %',response.status; end if;
  return jsonb_build_object('status',response.status,'counts',response.content::jsonb);
end
$fn$;
revoke all on function website_ops.retry_notifications() from public, anon, authenticated, service_role;
-- No decrypted credential or request headers are persisted in a queue or job command.
select cron.schedule('loni-notification-retry','*/5 * * * *','select website_ops.retry_notifications();');
commit;
