-- High Stakes: cloud saves + weekly league. Game cash and TEST credits only; nothing here touches real money.
-- All writes go through the hs-api edge function (service role). Clients can only read.
create table public.hs_saves(
 user_id uuid primary key references auth.users(id) on delete cascade,
 state jsonb not null,
 version integer not null default 1,
 imported boolean not null default false,
 updated_at timestamptz not null default now());

create table public.hs_profiles(
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(display_name) between 3 and 16));

create table public.hs_weekly_scores(
 user_id uuid not null references auth.users(id) on delete cascade,
 week integer not null,
 division text not null check (division in ('garage','warehouse','empire')),
 points integer not null default 0 check (points between 0 and 500),
 orders integer not null default 0,
 premium_jars integer not null default 0,
 quality integer not null default 0,
 per_buyer jsonb not null default '{}',
 updated_at timestamptz not null default now(),
 primary key(user_id,week));
create index hs_weekly_scores_board on public.hs_weekly_scores(week,division,points desc);

alter table public.hs_saves enable row level security;
alter table public.hs_profiles enable row level security;
alter table public.hs_weekly_scores enable row level security;

-- Players may read their own save; the board and names are readable by signed-in users. No write policies on purpose.
create policy "own save" on public.hs_saves for select to authenticated using ((select auth.uid())=user_id);
create policy "read names" on public.hs_profiles for select to authenticated using (true);
create policy "read board" on public.hs_weekly_scores for select to authenticated using (true);

-- Atomic compare-and-set so two devices cannot overwrite each other's progress.
create function public.hs_put_save(p_user uuid,p_state jsonb,p_expected integer,p_imported boolean)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
 if p_expected=0 then
  insert into public.hs_saves(user_id,state,version,imported) values(p_user,p_state,1,p_imported)
  on conflict do nothing;
  return found;
 end if;
 update public.hs_saves set state=p_state,version=version+1,imported=p_imported,updated_at=now()
 where user_id=p_user and version=p_expected;
 return found;
end $$;
revoke all on function public.hs_put_save(uuid,jsonb,integer,boolean) from public,anon,authenticated;
