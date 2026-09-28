begin;
do $$
declare k text := repeat('a',64); qa_id uuid; n integer;
begin
  if public.consume_form_quota(k,2) is not true then raise exception 'First quota call denied'; end if;
  if public.consume_form_quota(k,2) is not true then raise exception 'Second quota call denied'; end if;
  if public.consume_form_quota(k,2) is not false then raise exception 'Quota exceeded without denial'; end if;
  update public.form_rate_limits set expires_at = now() - interval '1 second' where key=k;
  if public.consume_form_quota(k,2) is not true then raise exception 'Quota did not reset'; end if;
  if has_function_privilege('anon','public.consume_form_quota(text,integer)','execute') then raise exception 'Anonymous quota RPC'; end if;
  if has_function_privilege('authenticated','public.consume_form_quota(text,integer)','execute') then raise exception 'Authenticated quota RPC'; end if;
  if has_table_privilege('anon','public.form_rate_limits','select') then raise exception 'Quota table exposed'; end if;
  insert into public.contact_requests(name,email,message) values('Workflow Test','workflow-test@example.invalid','Synthetic transaction, rolled back.') returning id into qa_id;
  update public.contact_requests set notes='First admin',notes_version=1 where id=qa_id and notes_version=0;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'Note update failed'; end if;
  update public.contact_requests set notes='Stale admin',notes_version=1 where id=qa_id and notes_version=0;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'Stale update overwrote note'; end if;
  if has_table_privilege('authenticated','public.contact_requests','select') then raise exception 'Notes exposed'; end if;
end $$;
select 'Quota, expiry, permissions and note conflict checks passed' as result;
rollback;