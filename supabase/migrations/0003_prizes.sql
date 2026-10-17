-- High Stakes: prize eligibility, payout wallets (linked by SENDING, no wallet connection) and the weekly winners export (DEVNET).
-- A player is prize-eligible when: (1) the save was started on the server (not imported with progress) and (2) a payout wallet is linked.
-- One wallet can belong to only one account.
create table public.hs_wallets(
 user_id uuid primary key references auth.users(id) on delete cascade,
 wallet text not null unique,
 order_id uuid references public.hs_orders(id),
 linked_at timestamptz not null default now());
alter table public.hs_wallets enable row level security;
create policy "own wallet" on public.hs_wallets for select to authenticated using ((select auth.uid())=user_id);

-- Settle: mark paid, grant the item, and (for the 'link' item) record the paying wallet, all in one transaction.
create or replace function public.hs_settle_order(p_order uuid,p_signature text,p_payer text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare v_user uuid; v_item text;
begin
 update public.hs_orders set status='paid',signature=p_signature,payer=p_payer,paid_at=now()
  where id=p_order and status='pending' returning user_id,item into v_user,v_item;
 if not found then return false; end if;
 insert into public.hs_items(user_id,item,order_id) values(v_user,v_item,p_order) on conflict do nothing;
 if v_item='link' then
  insert into public.hs_wallets(user_id,wallet,order_id) values(v_user,p_payer,p_order) on conflict (user_id) do nothing;
 end if;
 return true;
exception when unique_violation then
 return false;   -- signature already used, or this wallet is already linked to another account
end $$;
revoke all on function public.hs_settle_order(uuid,text,text) from public,anon,authenticated;

-- Weekly winners in the exact format devnet/payout.mjs reads. ADMIN ONLY (run in the SQL editor / service role).
-- Top 3 prize-eligible players per division by points (ties: whoever reached the score first). Defaults to last week.
-- Prize (HSTEST): 1st 500, 2nd 250, 3rd 100, times 1 (garage), 2 (warehouse), 4 (empire).
-- p_force lets devnet tests run it on the current week; never use it for a real payout.
create or replace function public.hs_week_winners(p_week integer default null,p_force boolean default false)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare cur integer := floor((extract(epoch from now())*1000 - 345600000)/604800000);
        wk integer := coalesce(p_week,cur-1);
begin
 if wk>=cur and not p_force then raise exception 'Week % is not over yet', wk; end if;
 return coalesce((
  select jsonb_agg(jsonb_build_object('id','wk'||wk||'-'||division||'-'||rk,'wallet',wallet,'asset','token',
         'amount',(case rk when 1 then 500 when 2 then 250 else 100 end)*(case division when 'garage' then 1 when 'warehouse' then 2 else 4 end),
         'name',name,'points',points) order by division,rk)
  from (
   select s.division,w.wallet,s.points,coalesce(p.display_name,'') as name,
          row_number() over (partition by s.division order by s.points desc,s.updated_at asc) as rk
   from public.hs_weekly_scores s
   join public.hs_saves v on v.user_id=s.user_id and not v.imported
   join public.hs_wallets w on w.user_id=s.user_id
   left join public.hs_profiles p on p.user_id=s.user_id
   where s.week=wk and s.points>0
  ) r where rk<=3),'[]'::jsonb);
end $$;
revoke all on function public.hs_week_winners(integer,boolean) from public,anon,authenticated;
