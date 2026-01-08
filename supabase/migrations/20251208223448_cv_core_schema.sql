-- ===========================================
-- CV + PLAYBACK CORE FUNCTIONS
-- ===========================================

-- 1) Screen pairing (APK uses this)
drop function if exists public.pair_screen(text);

create or replace function public.pair_screen(code_to_check text)
returns setof public.screens
language plpgsql
security definer
as $$
begin
  return query
  update public.screens
     set status = 'paired',
         paired_at = now()
   where upper(pairing_code) = upper(code_to_check)
   returning *;
end;
$$;


-- 2) Screen status check (APK uses this)
drop function if exists public.get_screen_status(bigint);

create or replace function public.get_screen_status(screen_id_to_check bigint)
returns text
language sql
security definer
as $$
  select status::text
  from public.screens
  where id = screen_id_to_check;
$$;


-- 3) Trigger-aware playlist
-- Priority:
--   1) Active trigger for screen
--   2) Base playlist from screens_media (player does the time filtering)
drop function if exists public.get_playlist_for_screen(bigint);

create or replace function public.get_playlist_for_screen(screen_id_to_check bigint)
returns table (
  item_id bigint,
  duration integer,
  start_time timestamp without time zone,
  end_time timestamp without time zone,
  schedule_start_date date,
  schedule_end_date date,
  daily_start_time time without time zone,
  daily_end_time time without time zone,
  days_of_week text,
  file_name text,
  file_path text,
  file_type text,
  orientation text
)
language plpgsql
security definer
as $$
declare
  v_now timestamptz := now();
begin
  -- Housekeeping: auto-deactivate expired triggers
  update public.triggers
     set active = false
   where screen_id = screen_id_to_check
     and active = true
     and expires_at is not null
     and expires_at <= v_now;

  -- 1) If an active trigger exists, return THAT creative
  if exists (
    select 1
    from public.triggers t
    where t.screen_id = screen_id_to_check
      and t.active = true
      and (t.expires_at is null or t.expires_at > v_now)
  ) then
    return query
    select
      sm.id as item_id,
      sm.duration,
      sm.start_time,
      sm.end_time,
      sm.schedule_start_date,
      sm.schedule_end_date,
      sm.daily_start_time,
      sm.daily_end_time,
      sm.days_of_week,
      m.file_name,
      m.file_path,
      m.file_type,
      sm.orientation
    from public.triggers t
    join public.screens_media sm
      on sm.screen_id = t.screen_id
     and sm.media_id = t.media_id
    join public.media m
      on m.id = sm.media_id
    where t.screen_id = screen_id_to_check
      and t.active = true
      and (t.expires_at is null or t.expires_at > v_now)
    order by t.created_at desc
    limit 1;

    return;
  end if;

  -- 2) No trigger → return base playlist for this screen
  return query
  select
    sm.id as item_id,
    sm.duration,
    sm.start_time,
    sm.end_time,
    sm.schedule_start_date,
    sm.schedule_end_date,
    sm.daily_start_time,
    sm.daily_end_time,
    sm.days_of_week,
    m.file_name,
    m.file_path,
    m.file_type,
    sm.orientation
  from public.screens_media sm
  join public.media m
    on m.id = sm.media_id
  where sm.screen_id = screen_id_to_check
  order by sm.display_order, sm.id;
end;
$$;
