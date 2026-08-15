create table if not exists public.survey_responses (
  id uuid primary key,
  created_at timestamptz not null default now(),
  survey_version integer not null default 1,
  answers jsonb not null
);

alter table public.survey_responses enable row level security;

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at);

create policy "anonymous survey submissions"
on public.survey_responses
for insert to anon
with check (survey_version = 1 and jsonb_typeof(answers) = 'object');

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.survey_config (
  key text primary key,
  value text not null
);

alter table private.survey_config enable row level security;

create or replace function public.export_survey_responses(admin_key text)
returns table(id uuid, created_at timestamptz, answers jsonb)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from private.survey_config c
    where c.key = 'export_key' and c.value = admin_key
  ) then
    raise insufficient_privilege using message = 'Invalid export key';
  end if;

  return query
  select r.id, r.created_at, r.answers
  from public.survey_responses r
  order by r.created_at asc;
end;
$$;

revoke all on function public.export_survey_responses(text) from public;
grant execute on function public.export_survey_responses(text) to anon;
