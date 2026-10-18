-- High Stakes: payout health snapshot + alert de-duplication (DEVNET). Written only by the hs-payout function (service role).
create table public.hs_health(name text primary key,data jsonb not null,updated_at timestamptz not null default now());
alter table public.hs_health enable row level security;      -- no policies: unreachable by clients
create table public.hs_alerts(kind text primary key,last_sent timestamptz not null);
alter table public.hs_alerts enable row level security;      -- no policies: unreachable by clients

-- True at most once per p_minutes for each alert kind, so a stuck payout does not spam the channel every 5 minutes.
create or replace function public.hs_alert_gate(p_kind text,p_minutes integer)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
 insert into public.hs_alerts(kind,last_sent) values(p_kind,now())
 on conflict (kind) do update set last_sent=now() where public.hs_alerts.last_sent < now()-make_interval(mins=>p_minutes);
 return found;
end $$;
revoke all on function public.hs_alert_gate(text,integer) from public,anon,authenticated;

create or replace function public.hs_payout_stats()
returns jsonb language sql security invoker set search_path='' as $$
 select jsonb_build_object(
  'failed_count',(select count(*) from public.hs_payouts where status='failed'),
  'due_count',(select count(*) from public.hs_payouts where status in ('due','claimed','sending')),
  'oldest_due_min',(select floor(extract(epoch from (now()-min(created_at)))/60) from public.hs_payouts where status in ('due','claimed','sending')),
  'owed_raw',(select coalesce(sum(amount_raw),0) from public.hs_payouts where status in ('due','claimed','sending')));
$$;
revoke all on function public.hs_payout_stats() from public,anon,authenticated;
