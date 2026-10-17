-- High Stakes: pay-by-sending orders (DEVNET). The server creates an order with a one-time reference and a server-set price;
-- the player sends SOL or the game token to the treasury; the server confirms on chain (finalized) and settles ONCE.
create table public.hs_orders(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 item text not null,
 method text not null check (method in ('sol','token')),
 amount_raw bigint not null check (amount_raw > 0),
 reference text not null unique,
 status text not null default 'pending' check (status in ('pending','paid')),
 signature text unique,
 payer text,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null,
 last_checked timestamptz,
 paid_at timestamptz);
create index hs_orders_user on public.hs_orders(user_id,created_at desc);

create table public.hs_items(
 user_id uuid not null references auth.users(id) on delete cascade,
 item text not null,
 order_id uuid references public.hs_orders(id),
 granted_at timestamptz not null default now(),
 primary key(user_id,item));

alter table public.hs_orders enable row level security;
alter table public.hs_items enable row level security;
create policy "own orders" on public.hs_orders for select to authenticated using ((select auth.uid())=user_id);
create policy "own items" on public.hs_items for select to authenticated using ((select auth.uid())=user_id);

-- Settles an order exactly once: marks it paid and grants the item in ONE transaction. A transaction signature can only
-- ever settle one order (unique), so one payment cannot be reused for a second order.
create function public.hs_settle_order(p_order uuid,p_signature text,p_payer text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare v_user uuid; v_item text;
begin
 update public.hs_orders set status='paid',signature=p_signature,payer=p_payer,paid_at=now()
  where id=p_order and status='pending' returning user_id,item into v_user,v_item;
 if not found then return false; end if;
 insert into public.hs_items(user_id,item,order_id) values(v_user,v_item,p_order) on conflict do nothing;
 return true;
exception when unique_violation then
 return false;
end $$;
revoke all on function public.hs_settle_order(uuid,text,text) from public,anon,authenticated;

-- Throttle: at most one chain lookup per order every few seconds. Returns true if this caller may check now.
create function public.hs_claim_check(p_order uuid,p_gap_ms integer)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
 update public.hs_orders set last_checked=now()
  where id=p_order and status='pending' and (last_checked is null or last_checked < now() - make_interval(secs => p_gap_ms/1000.0));
 return found;
end $$;
revoke all on function public.hs_claim_check(uuid,integer) from public,anon,authenticated;
