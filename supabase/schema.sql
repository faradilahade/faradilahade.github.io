-- ============================================================
-- Faradilah Portfolio — Supabase schema
-- Run in Supabase Dashboard → SQL Editor.
--
-- SAFE TO RE-RUN. Every statement is idempotent: tables/columns are
-- only added when missing and policies are dropped before being
-- recreated, so "policy … already exists" (42710) cannot happen.
-- ============================================================

-- ---------- Table --------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  category text not null default 'data',
  tags text[] default '{}',
  cover_url text,
  attachments jsonb default '[]',
  published boolean default true,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Columns added in the 2026 redesign (tools, keywords, gallery, metadata)
alter table public.projects add column if not exists tools        text[]  default '{}';
alter table public.projects add column if not exists keywords     text[]  default '{}';
alter table public.projects add column if not exists gallery      text[]  default '{}';
alter table public.projects add column if not exists year         integer;
alter table public.projects add column if not exists role         text;
alter table public.projects add column if not exists client       text;
alter table public.projects add column if not exists external_url text;
alter table public.projects add column if not exists embed_url    text;
alter table public.projects add column if not exists sort_order   integer default 0;

-- Keep category values clean (constraint added only once)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'projects_category_check'
  ) then
    alter table public.projects
      add constraint projects_category_check check (category in ('data', 'finance', 'risk'));
  end if;
end $$;

create index if not exists projects_published_idx on public.projects (published, featured, sort_order, created_at desc);
create index if not exists projects_slug_idx on public.projects (slug);

-- ---------- updated_at trigger --------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- ---------- Row Level Security --------------------------------------
alter table public.projects enable row level security;

drop policy if exists "Public read published" on public.projects;
create policy "Public read published"
on public.projects for select
using (published = true);

drop policy if exists "Admin full access" on public.projects;
create policy "Admin full access"
on public.projects for all
to authenticated
using (true)
with check (true);

-- ---------- Storage -------------------------------------------------
-- Create the bucket if it does not exist yet (public read).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio files" on storage.objects;
create policy "Public read portfolio files"
on storage.objects for select
using (bucket_id = 'portfolio');

drop policy if exists "Admin upload portfolio files" on storage.objects;
create policy "Admin upload portfolio files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio');

drop policy if exists "Admin update portfolio files" on storage.objects;
create policy "Admin update portfolio files"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio');

drop policy if exists "Admin delete portfolio files" on storage.objects;
create policy "Admin delete portfolio files"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio');

-- Done. Reload the schema cache is automatic; the site picks the new columns up immediately.
