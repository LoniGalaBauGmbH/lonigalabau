-- Incremental, private assistant workspace. Never apply the bootstrap again.
begin;
create table public.assistant_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 180),
  category text not null default 'Allgemein' check (length(category) <= 80),
  source text not null default '' check (length(source) <= 500),
  content text not null check (length(content) between 1 and 200000),
  approved boolean not null default false,
  version integer not null default 1,
  updated_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as
    (to_tsvector('german', title || ' ' || category || ' ' || content)) stored
);
create index assistant_documents_search_idx on public.assistant_documents using gin(search_vector) where approved;
create table public.assistant_cases (
  id uuid primary key default gen_random_uuid(),
  contact_request_id uuid unique references public.contact_requests(id) on delete cascade,
  title text not null default '' check (length(title) <= 180),
  customer text not null default '' check (length(customer) <= 180),
  messages jsonb not null default '[]' check (jsonb_typeof(messages)='array' and jsonb_array_length(messages)<=100 and octet_length(messages::text)<=160000),
  notes text not null default '' check (length(notes)<=20000),
  draft text not null default '' check (length(draft)<=12000),
  analysis jsonb check (analysis is null or (jsonb_typeof(analysis)='object' and octet_length(analysis::text)<=64000)),
  review_on date,
  version integer not null default 1,
  updated_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  run_token uuid,
  run_until timestamptz,
  last_run_at timestamptz
);
create index assistant_cases_updated_idx on public.assistant_cases(updated_at desc,id);
create index assistant_cases_review_idx on public.assistant_cases(review_on) where review_on is not null;
create table public.assistant_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users on delete set null,
  entity_id uuid not null,
  entity_type text not null check(entity_type in ('case','document')),
  action text not null check(action in ('INSERT','UPDATE','DELETE')),
  created_at timestamptz not null default now()
);
create index assistant_audit_created_idx on public.assistant_audit(created_at desc);
create index assistant_audit_entity_idx on public.assistant_audit(entity_id);

alter table public.assistant_documents enable row level security;
alter table public.assistant_cases enable row level security;
alter table public.assistant_audit enable row level security;
revoke all on public.assistant_documents,public.assistant_cases,public.assistant_audit from public,anon,authenticated;
grant select,insert,update,delete on public.assistant_documents,public.assistant_cases to service_role;
grant select,insert,delete on public.assistant_audit to service_role;

create function public.assistant_record_change() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  -- Leases do not change the user-visible version or produce content audit records.
  if TG_OP='UPDATE' and TG_TABLE_NAME='assistant_cases' and
     (to_jsonb(NEW)-array['run_token','run_until','last_run_at']) =
     (to_jsonb(OLD)-array['run_token','run_until','last_run_at']) then return NEW; end if;
  if TG_OP='UPDATE' then NEW.version:=OLD.version+1; NEW.updated_at:=clock_timestamp(); end if;
  if TG_OP='DELETE' then
    -- Erasure removes historical actor links for the deleted entity too.
    delete from public.assistant_audit where entity_id=OLD.id;
    return OLD;
  end if;
  insert into public.assistant_audit(actor_id,entity_id,entity_type,action)
    values(NEW.updated_by,NEW.id,case when TG_TABLE_NAME='assistant_cases' then 'case' else 'document' end,TG_OP);
  return NEW;
end $$;
revoke all on function public.assistant_record_change() from public,anon,authenticated;
grant execute on function public.assistant_record_change() to service_role;
create trigger assistant_documents_change before insert or update or delete on public.assistant_documents
for each row execute function public.assistant_record_change();
create trigger assistant_cases_change before insert or update or delete on public.assistant_cases
for each row execute function public.assistant_record_change();

create function public.assistant_search(p_query text) returns setof public.assistant_documents
language sql stable security invoker set search_path='' as $$
 select d.* from public.assistant_documents d
 where d.approved and d.search_vector @@ websearch_to_tsquery('german',left(p_query,500))
 order by ts_rank_cd(d.search_vector,websearch_to_tsquery('german',left(p_query,500))) desc,d.id limit 6
$$;
revoke all on function public.assistant_search(text) from public,anon,authenticated;
grant execute on function public.assistant_search(text) to service_role;

create function public.assistant_finish_run(p_id uuid,p_token uuid,p_version integer,p_contact jsonb,p_result jsonb,p_actor uuid)
returns boolean language plpgsql security invoker set search_path='' as $$
declare c public.assistant_cases; d public.assistant_documents; source_item jsonb; live_contact jsonb; contact_id uuid;
begin
 -- Match FK deletion's contact -> case lock order. Re-read the case under lock below.
 select contact_request_id into contact_id from public.assistant_cases where id=p_id;
 if contact_id is not null then perform id from public.contact_requests where id=contact_id for share; end if;
 select * into c from public.assistant_cases where id=p_id for update;
 if not found or p_token is null or p_version is null or c.version is distinct from p_version
   or c.run_token is null or c.run_token is distinct from p_token or c.run_until is null
   or c.run_until<=clock_timestamp() then return false; end if;
 if c.contact_request_id is not null then
   select jsonb_build_object('name',name,'subject',subject,'message',message,'notes',notes)
     into live_contact from public.contact_requests where id=c.contact_request_id for share;
   if live_contact is distinct from p_contact then return false; end if;
 end if;
 if p_result is null or jsonb_typeof(p_result->'sources') is distinct from 'array'
   or jsonb_array_length(p_result->'sources')>8 or jsonb_typeof(p_result->'draft') is distinct from 'string' then return false; end if;
 if jsonb_typeof(p_result->'checkedSources') is distinct from 'array'
    or jsonb_array_length(p_result->'checkedSources')>24 then return false; end if;
 for source_item in select value from jsonb_array_elements(p_result->'checkedSources') order by value->>'documentId' loop
   select * into d from public.assistant_documents where id=(source_item->>'documentId')::uuid for share;
   if not found or not d.approved or d.version is distinct from (source_item->>'version')::integer then return false; end if;
 end loop;
 update public.assistant_cases set analysis=p_result,
   draft=case when draft='' or draft=coalesce(analysis->>'draft','') then p_result->>'draft' else draft end,
   updated_by=p_actor,run_token=null,run_until=null where id=p_id;
 return true;
end $$;
revoke all on function public.assistant_finish_run(uuid,uuid,integer,jsonb,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.assistant_finish_run(uuid,uuid,integer,jsonb,jsonb,uuid) to service_role;
commit;
