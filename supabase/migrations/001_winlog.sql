begin;
create table public.win_wins (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 original_text text not null check (length(btrim(original_text)) between 1 and 5000),
 polished_text text, title text, category text,
 skills text[] not null default '{}', impact text,
 event_date date not null default current_date,
 source text not null default 'manual' check (source in ('manual','reflection')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index win_wins_user_date_idx on public.win_wins(user_id,event_date desc,created_at desc);
create table public.win_user_settings (
 user_id uuid primary key references auth.users(id) on delete cascade,
 reminder_day smallint not null default 5 check (reminder_day between 0 and 6),
 reminder_time time not null default '16:00', timezone text not null default 'America/Toronto',
 reminder_enabled boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create function public.win_touch_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
create trigger win_wins_updated before update on public.win_wins for each row execute function public.win_touch_updated_at();
create trigger win_settings_updated before update on public.win_user_settings for each row execute function public.win_touch_updated_at();
alter table public.win_wins enable row level security;
alter table public.win_user_settings enable row level security;
create policy win_select on public.win_wins for select to authenticated using ((select auth.uid()) = user_id);
create policy win_insert on public.win_wins for insert to authenticated with check ((select auth.uid()) = user_id);
create policy win_update on public.win_wins for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy win_delete on public.win_wins for delete to authenticated using ((select auth.uid()) = user_id);
create policy win_settings_select on public.win_user_settings for select to authenticated using ((select auth.uid()) = user_id);
create policy win_settings_insert on public.win_user_settings for insert to authenticated with check ((select auth.uid()) = user_id);
create policy win_settings_update on public.win_user_settings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.win_wins,public.win_user_settings from anon;
grant select,insert,update,delete on public.win_wins to authenticated;
grant select,insert,update on public.win_user_settings to authenticated;
commit;
