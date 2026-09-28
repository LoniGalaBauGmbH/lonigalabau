-- Apply only after the new-database bootstrap. Does not change existing roles.
alter table public.contact_requests
  add column notes text not null default '' check (length(notes) <= 20000),
  add column notes_version integer not null default 0 check (notes_version >= 0);
alter table public.applications
  add column notes text not null default '' check (length(notes) <= 20000),
  add column notes_version integer not null default 0 check (notes_version >= 0);

-- Contains HMACs of network addresses, never raw addresses.
create table public.form_rate_limits (
  key text primary key check (length(key) = 64),
  hits integer not null check (hits > 0),
  expires_at timestamptz not null
);
create index form_rate_limits_expiry_idx on public.form_rate_limits(expires_at);
alter table public.form_rate_limits enable row level security;
revoke all on table public.form_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.form_rate_limits to service_role;

create function public.consume_form_quota(p_key text, p_limit integer)
returns boolean language plpgsql security invoker set search_path = ''
as $$
declare v_hits integer;
begin
  if length(p_key) != 64 or p_limit < 1 or p_limit > 100 then
    raise exception 'Invalid rate limit arguments';
  end if;
  delete from public.form_rate_limits where expires_at <= now();
  insert into public.form_rate_limits as limits (key,hits,expires_at)
  values (p_key,1,now() + interval '15 minutes')
  on conflict (key) do update set hits = limits.hits + 1
  where limits.hits < p_limit
  returning hits into v_hits;
  return v_hits is not null;
end;
$$;
revoke all on function public.consume_form_quota(text,integer) from public, anon, authenticated;
grant execute on function public.consume_form_quota(text,integer) to service_role;
