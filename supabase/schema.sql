-- ============================================================
-- Faradilah Portfolio - Supabase Schema
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

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

alter table public.projects enable row level security;

create policy "Public read published"
on public.projects for select
using (published = true);

create policy "Admin full access"
on public.projects for all
to authenticated
using (true)
with check (true);

-- Storage: create bucket named "portfolio" (public) in Dashboard first, then:
create policy "Public read portfolio files"
on storage.objects for select
using (bucket_id = 'portfolio');

create policy "Admin upload portfolio files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio');

create policy "Admin update portfolio files"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio');

create policy "Admin delete portfolio files"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio');
