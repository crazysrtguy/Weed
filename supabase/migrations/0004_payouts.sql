-- High Stakes: automatic prize payouts (DEVNET). The payout ledger is written ONLY by the database functions below and by the
-- hs-payout edge function (service role). Players can read their own payouts and nothing else; no client can write here.
create table public.hs_payouts(
 id text primary key,                         -- idempotency key, e.g. 'wk2962-garage-1': the same prize can never be inserted twice
 source text not null default 'league',
 week integer,
 user_id uuid references auth.users(id) on delete set null,
 wallet text not null,
 asset text not null check (asset in ('token')),
 amount_raw bigint not null check (amount_raw > 0 and amount_raw <= 5000000000),   -- hard ceiling: 5,000 tokens per payout
 status text not null default 'due' check (status in ('due','claimed','sending','paid','failed')),
 attempts integer not null default 0,
 signature text unique,
 last_valid_height bigint,
 claimed_at timestamptz,
 created_at timestamptz not null default now(),
 paid_at timestamptz,
 error text);
create index hs_payouts_status on public.hs_payouts(status,created_at);
alter table public.hs_payouts enable row level security;
create policy "own payouts" on public.hs_payouts for select to authenticated using ((select auth.uid())=user_id);

create table public.hs_locks(name text primary key,until_at timestamptz not null);
alter table public.hs_locks enable row level security;   -- no policies: unreachable by clients

-- Winners export now also carries user_id (payout.mjs ignores extra fields).
create or replace function public.hs_week_winners(p_week integer default null,p_force boolean default false)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare cur integer := floor((extract(epoch from now())*1000 - 345600000)/604800000);
        wk integer := coalesce(p_week,cur-1);
begin
 if wk>=cur and not p_force then raise exception 'Week % is not over yet', wk; end if;
 return coalesce((
  select jsonb_agg(jsonb_build_object('id','wk'||wk||'-'||division||'-'||rk,'user_id',user_id,'wallet',wallet,'asset','token',
         'amount',(case rk when 1 then 500 when 2 then 250 else 100 end)*(case division when 'garage' then 1 when 'warehouse' then 2 else 4 end),
         'name',name,'points',points) order by division,rk)
  from (
   select s.user_id,s.division,w.wallet,s.points,coalesce(p.display_name,'') as name,
          row_number() over (partition by s.division order by s.points desc,s.updated_at asc) as rk
   from public.hs_weekly_scores s
   join public.hs_saves v on v.user_id=s.user_id and not v.imported
   join public.hs_wallets w on w.user_id=s.user_id
   left join public.hs_profiles p on p.user_id=s.user_id
   where s.week=wk and s.points>0
  ) r where rk<=3),'[]'::jsonb);
end $$;
revoke all on function public.hs_week_winners(integer,boolean) from public,anon,authenticated;

-- Turns a FINISHED week into payout rows. Safe to run any number of times (unique id). No force option: an unfinished week errors.
create or replace function public.hs_settle_week(p_week integer default null)
returns integer language plpgsql security invoker set search_path='' as $$
declare cur integer := floor((extract(epoch from now())*1000 - 345600000)/604800000);
        wk integer := coalesce(p_week,cur-1);
        n integer;
begin
 if wk>=cur then raise exception 'Week % is not over yet', wk; end if;
 insert into public.hs_payouts(id,source,week,user_id,wallet,asset,amount_raw)
  select w->>'id','league',wk,(w->>'user_id')::uuid,w->>'wallet','token',((w->>'amount')::bigint)*1000000
  from jsonb_array_elements(public.hs_week_winners(wk)) w
  on conflict (id) do nothing;
 get diagnostics n = row_count;
 return n;
end $$;
revoke all on function public.hs_settle_week(integer) from public,anon,authenticated;

-- One payout run at a time.
create or replace function public.hs_payout_lock(p_secs integer)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
 insert into public.hs_locks(name,until_at) values('payout',now()+make_interval(secs=>p_secs))
 on conflict (name) do update set until_at=excluded.until_at where public.hs_locks.until_at<now();
 return found;
end $$;
revoke all on function public.hs_payout_lock(integer) from public,anon,authenticated;

-- Atomically claim due rows. Rows stuck in 'claimed' for 10+ minutes (a run died before saving a signature) return to 'due'.
create or replace function public.hs_claim_payouts(p_limit integer)
returns setof public.hs_payouts language plpgsql security invoker set search_path='' as $$
begin
 update public.hs_payouts set status='due' where status='claimed' and signature is null and claimed_at<now()-interval '10 minutes';
 return query
 update public.hs_payouts set status='claimed',claimed_at=now(),attempts=attempts+1
  where id in (select id from public.hs_payouts where status='due' order by created_at,id limit p_limit for update skip locked)
  returning *;
end $$;
revoke all on function public.hs_claim_payouts(integer) from public,anon,authenticated;
