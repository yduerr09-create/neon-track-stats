-- ApexLeague Schema — in deinem Supabase-Projekt im SQL Editor ausführen.

create table if not exists public.teams (
  id text primary key,
  name text not null,
  color text not null default '#39ff88'
);

create table if not exists public.drivers (
  id text primary key,
  name text not null,
  team_id text references public.teams(id) on delete set null,
  elo integer not null default 1500,
  safety_rating numeric(3,2) not null default 5.00,
  lifetime_points integer not null default 0,
  career_races integer not null default 0,
  career_wins integer not null default 0,
  career_podiums integer not null default 0
);

create table if not exists public.races (
  id text primary key,
  round integer not null,
  track text not null,
  country text not null default '',
  date timestamptz not null,
  practice text not null default '18:30',
  qualifying text not null default '19:00',
  race_time text not null default '19:20',
  air_temp integer not null default 20,
  track_temp integer not null default 28,
  rain_chance integer not null default 0,
  time_multiplier integer not null default 1
);

create table if not exists public.race_results (
  id text primary key,
  race_id text not null references public.races(id) on delete cascade,
  driver_id text not null references public.drivers(id) on delete cascade,
  position integer not null,
  grid integer not null default 1,
  points integer not null default 0,
  incidents integer not null default 0,
  unique (race_id, driver_id)
);

grant select on public.teams to anon;
grant select on public.drivers to anon;
grant select on public.races to anon;
grant select, insert, update on public.race_results to anon;

grant select, insert, update, delete on public.teams to authenticated;
grant select, insert, update, delete on public.drivers to authenticated;
grant select, insert, update, delete on public.races to authenticated;
grant select, insert, update, delete on public.race_results to authenticated;

grant all on public.teams to service_role;
grant all on public.drivers to service_role;
grant all on public.races to service_role;
grant all on public.race_results to service_role;

alter table public.teams enable row level security;
alter table public.drivers enable row level security;
alter table public.races enable row level security;
alter table public.race_results enable row level security;

create policy "public read teams" on public.teams for select using (true);
create policy "public read drivers" on public.drivers for select using (true);
create policy "public read races" on public.races for select using (true);
create policy "public read results" on public.race_results for select using (true);
create policy "write results" on public.race_results for insert with check (true);
create policy "update results" on public.race_results for update using (true) with check (true);
