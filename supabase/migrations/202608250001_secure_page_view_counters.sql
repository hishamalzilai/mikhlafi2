-- Atomic, bounded page-view counters for all application instances.
-- One row is stored per page, plus one row per page/day. Request volume no
-- longer determines table growth, and concurrent increments cannot overwrite.

create table if not exists public.page_view_totals (
  content_type text not null check (content_type in ('articles', 'news', 'archive', 'studies', 'testimonials')),
  content_id text not null check (char_length(content_id) between 1 and 64),
  title text not null check (char_length(title) between 1 and 500),
  path text not null check (char_length(path) between 2 and 300 and left(path, 1) = '/'),
  views bigint not null default 0 check (views >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (content_type, content_id)
);

create table if not exists public.page_view_daily (
  view_date date not null,
  content_type text not null check (content_type in ('articles', 'news', 'archive', 'studies', 'testimonials')),
  content_id text not null check (char_length(content_id) between 1 and 64),
  views bigint not null default 0 check (views >= 0),
  updated_at timestamptz not null default now(),
  primary key (view_date, content_type, content_id)
);

create index if not exists page_view_totals_views_idx
  on public.page_view_totals (views desc);

create index if not exists page_view_daily_date_idx
  on public.page_view_daily (view_date);

alter table public.page_view_totals enable row level security;
alter table public.page_view_daily enable row level security;

revoke all on table public.page_view_totals from anon, authenticated;
revoke all on table public.page_view_daily from anon, authenticated;
grant select, insert, update on table public.page_view_totals to service_role;
grant select, insert, update on table public.page_view_daily to service_role;

create or replace function public.increment_page_view(
  p_content_type text,
  p_content_id text,
  p_title text,
  p_path text,
  p_local_date date
)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_total bigint;
begin
  if p_content_type not in ('articles', 'news', 'archive', 'studies', 'testimonials')
    or p_content_id is null or char_length(p_content_id) not between 1 and 64
    or p_title is null or char_length(btrim(p_title)) not between 1 and 500
    or p_path is null or char_length(p_path) not between 2 and 300 or left(p_path, 1) <> '/'
    or p_local_date is null
  then
    raise exception 'invalid page-view input' using errcode = '22023';
  end if;

  insert into public.page_view_totals (
    content_type, content_id, title, path, views
  ) values (
    p_content_type, p_content_id, btrim(p_title), p_path, 1
  )
  on conflict (content_type, content_id) do update
    set views = public.page_view_totals.views + 1,
        title = excluded.title,
        path = excluded.path,
        updated_at = now()
  returning views into v_total;

  insert into public.page_view_daily (
    view_date, content_type, content_id, views
  ) values (
    p_local_date, p_content_type, p_content_id, 1
  )
  on conflict (view_date, content_type, content_id) do update
    set views = public.page_view_daily.views + 1,
        updated_at = now();

  return v_total;
end;
$$;

revoke all on function public.increment_page_view(text, text, text, text, date) from public, anon, authenticated;
grant execute on function public.increment_page_view(text, text, text, text, date) to service_role;

create or replace function public.get_page_view_analytics(
  p_local_date date,
  p_limit integer default 10
)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'todayViews', coalesce((
      select sum(d.views) from public.page_view_daily d where d.view_date = p_local_date
    ), 0),
    'totalViews', coalesce((
      select sum(t.views) from public.page_view_totals t
    ), 0),
    'topPages', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'title', ranked.title,
          'path', ranked.path,
          'contentType', ranked.content_type,
          'views', ranked.views
        ) order by ranked.views desc
      )
      from (
        select title, path, content_type, views
        from public.page_view_totals
        order by views desc
        limit greatest(1, least(coalesce(p_limit, 10), 50))
      ) ranked
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.get_page_view_analytics(date, integer) from public, anon, authenticated;
grant execute on function public.get_page_view_analytics(date, integer) to service_role;

-- Preserve counts created by the previous append-only implementation.
insert into public.page_view_totals (content_type, content_id, title, path, views)
select
  content ->> 'contentType',
  content ->> 'contentId',
  max(content ->> 'title'),
  max(content ->> 'path'),
  count(*)::bigint
from public.site_settings
where id like 'analytics:view:%'
  and content ->> 'kind' = 'page_view'
  and content ->> 'contentType' in ('articles', 'news', 'archive', 'studies', 'testimonials')
  and char_length(content ->> 'contentId') between 1 and 64
group by content ->> 'contentType', content ->> 'contentId'
on conflict (content_type, content_id) do update
  set views = greatest(public.page_view_totals.views, excluded.views),
      title = excluded.title,
      path = excluded.path,
      updated_at = now();

insert into public.page_view_daily (view_date, content_type, content_id, views)
select
  (content ->> 'localDate')::date,
  content ->> 'contentType',
  content ->> 'contentId',
  count(*)::bigint
from public.site_settings
where id like 'analytics:view:%'
  and content ->> 'kind' = 'page_view'
  and content ->> 'contentType' in ('articles', 'news', 'archive', 'studies', 'testimonials')
  and content ->> 'localDate' ~ '^\d{4}-\d{2}-\d{2}$'
  and char_length(content ->> 'contentId') between 1 and 64
group by (content ->> 'localDate')::date, content ->> 'contentType', content ->> 'contentId'
on conflict (view_date, content_type, content_id) do update
  set views = greatest(public.page_view_daily.views, excluded.views),
      updated_at = now();

-- Legacy analytics:view:* rows are intentionally retained for rollback.
-- After verifying the new totals, they can be deleted once with:
-- delete from public.site_settings where id like 'analytics:view:%';
