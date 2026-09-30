-- Additive privacy fix. No existing submissions or delivery rows are removed at rollout.
begin;
alter table public.email_delivery
  add column contact_request_id uuid references public.contact_requests(id) on delete cascade,
  add column application_id uuid references public.applications(id) on delete cascade,
  add constraint email_delivery_one_parent check (num_nonnulls(contact_request_id, application_id) <= 1);
create index email_delivery_contact_idx on public.email_delivery(contact_request_id);
create index email_delivery_application_idx on public.email_delivery(application_id);

create function public.record_submission_email_delivery(p_id text, p_status text, p_at timestamptz, p_source text, p_submission_id uuid)
returns void language plpgsql set search_path='' as $$
declare contact_id uuid; application_id uuid;
begin
  if p_source = 'contact_requests' and p_submission_id is not null then
    select id into contact_id from public.contact_requests where id=p_submission_id for key share;
  elsif p_source = 'applications' and p_submission_id is not null then
    select id into application_id from public.applications where id=p_submission_id for key share;
  elsif p_source is null and p_submission_id is null then
    -- Compatibility for old, untagged messages: accept only a known provider ID.
    select id into contact_id from public.contact_requests
      where notification_email_id=p_id or customer_confirmation_email_id=p_id limit 1 for key share;
    if contact_id is null then
      select id into application_id from public.applications
        where notification_email_id=p_id or customer_confirmation_email_id=p_id limit 1 for key share;
    end if;
  end if;
  -- Deleted/unknown parents must never be recreated by a delayed webhook.
  if contact_id is null and application_id is null then return; end if;
  insert into public.email_delivery as delivery(email_id,status,occurred_at,contact_request_id,application_id)
  values(p_id,p_status,p_at,contact_id,application_id)
  on conflict(email_id) do update
    set status=excluded.status,occurred_at=excluded.occurred_at,
        contact_request_id=excluded.contact_request_id,application_id=excluded.application_id
    where excluded.occurred_at > delivery.occurred_at
      and not (delivery.status in ('delivered','bounced','complained','failed') and excluded.status='delayed');
end;
$$;
revoke all on function public.record_submission_email_delivery(text,text,timestamptz,text,uuid) from public,anon,authenticated;
grant execute on function public.record_submission_email_delivery(text,text,timestamptz,text,uuid) to service_role;

create or replace function public.record_email_delivery(p_id text,p_status text,p_at timestamptz)
returns void language sql set search_path='' as $$
  select public.record_submission_email_delivery(p_id,p_status,p_at,null,null);
$$;

create function public.remove_submission_delivery() returns trigger
language plpgsql set search_path='' as $$
begin
  -- Also remove legacy rows without a parent FK when the operator deletes a submission.
  delete from public.email_delivery
    where email_id=old.notification_email_id or email_id=old.customer_confirmation_email_id;
  return old;
end;
$$;
revoke all on function public.remove_submission_delivery() from public,anon,authenticated;
create trigger contact_delivery_cleanup after delete on public.contact_requests
for each row execute function public.remove_submission_delivery();
create trigger application_delivery_cleanup after delete on public.applications
for each row execute function public.remove_submission_delivery();
commit;

