create or replace function public.get_dashboard_stats()
returns jsonb
language sql
stable
set search_path = public
as $$
with
summary as (
  select
    count(*)::integer as total_active,
    count(distinct company)::integer as total_companies,
    count(*) filter (
      where scraped_at >= current_date
        and scraped_at < current_date + interval '1 day'
    )::integer as today_count
  from public.job_postings
),
normalized_techs as (
  select case lower(trim(tech))
    when 'reactjs' then 'React'
    when 'react.js' then 'React'
    when 'nextjs' then 'Next.js'
    when 'next.js' then 'Next.js'
    when 'next' then 'Next.js'
    when 'vuejs' then 'Vue'
    when 'vue.js' then 'Vue'
    when 'nuxtjs' then 'Nuxt.js'
    when 'typescript' then 'TypeScript'
    when 'ts' then 'TypeScript'
    when 'javascript' then 'JavaScript'
    when 'js' then 'JavaScript'
    when 'tailwind' then 'Tailwind CSS'
    when 'tailwindcss' then 'Tailwind CSS'
    when 'styled-components' then 'Styled Components'
    when 'react-query' then 'React Query'
    when 'tanstack' then 'TanStack Query'
    when 'tanstack-query' then 'TanStack Query'
    when 'shadcn' then 'shadcn/ui'
    when 'shadcn-ui' then 'shadcn/ui'
    else trim(tech)
  end as tech
  from public.job_postings
  cross join lateral unnest(coalesce(tech_stacks, array[]::text[])) as tech
),
top_techs as (
  select tech, count(*)::integer as count
  from normalized_techs
  where tech <> ''
  group by tech
  order by count desc, tech
  limit 15
),
source_counts as (
  select coalesce(source, '기타') as site, count(*)::integer as count
  from public.job_postings
  group by coalesce(source, '기타')
),
days as (
  select generate_series(current_date - 29, current_date, interval '1 day')::date as day
),
daily_counts as (
  select scraped_at::date as day, count(*)::integer as count
  from public.job_postings
  where scraped_at >= current_date - 29
    and scraped_at < current_date + interval '1 day'
  group by scraped_at::date
),
career_labels as (
  select case
    when career is null or trim(career) = '' then null
    when career ~* '(신입.{0,3}경력|경력.{0,3}신입)' then '신입·경력'
    when career ~ '경력\s*\d+\s*년' then
      '경력 ' || substring(career from '경력\s*(\d+)\s*년') || '년 이상'
    else trim(career)
  end as career
  from public.job_postings
),
career_counts as (
  select career, count(*)::integer as count
  from career_labels
  where career is not null
  group by career
),
career_stats as (
  select
    career,
    count,
    case when sum(count) over () > 0
      then round(count * 100.0 / sum(count) over ())::integer else 0 end as percent
  from career_counts
),
duty_items as (
  select trim(duty) as duty
  from public.job_postings
  cross join lateral unnest(coalesce(duties, array[]::text[])) as duty
  where trim(duty) <> ''
),
duty_summary as (
  select
    count(*)::integer as total_items,
    coalesce(
      (select jsonb_agg(duty order by sample_order)
       from (
         select duty, md5(duty) as sample_order
         from duty_items
         order by sample_order
         limit 220
       ) sampled),
      '[]'::jsonb
    ) as sample
  from duty_items
)
select jsonb_build_object(
  'totalActive', summary.total_active,
  'totalCompanies', summary.total_companies,
  'todayCount', summary.today_count,
  'topTechs', coalesce((
    select jsonb_agg(jsonb_build_object(
      'tech', tech,
      'count', count,
      'percent', case when summary.total_active > 0
        then round(count * 100.0 / summary.total_active)::integer else 0 end
    ) order by count desc, tech)
    from top_techs
  ), '[]'::jsonb),
  'bySourceSite', coalesce((
    select jsonb_agg(jsonb_build_object('site', site, 'count', count) order by count desc, site)
    from source_counts
  ), '[]'::jsonb),
  'recentByDay', coalesce((
    select jsonb_agg(jsonb_build_object(
      'date', to_char(days.day, 'YYYY-MM-DD'),
      'count', coalesce(daily_counts.count, 0)
    ) order by days.day)
    from days left join daily_counts using (day)
  ), '[]'::jsonb),
  'careerStats', coalesce((
    select jsonb_agg(jsonb_build_object(
      'career', career,
      'count', count,
      'percent', percent
    ) order by
      case
        when career = '신입·경력' then 0
        when career = '신입' then 1
        when career like '%경력무관%' then 2
        when career = '경력' then 3
        else 4
      end,
      case when career ~ '\d+' then -(substring(career from '(\d+)')::integer) else 0 end,
      career)
    from career_stats
  ), '[]'::jsonb),
  'duties', jsonb_build_object(
    'sample', duty_summary.sample,
    'totalItems', duty_summary.total_items
  )
)
from summary cross join duty_summary;
$$;

grant execute on function public.get_dashboard_stats() to anon, authenticated;
