-- Magazines, executive committee, gallery and public statistics.
-- These four tables and their storage buckets were first created by hand in the Supabase
-- dashboard (around May 2026). This file records them exactly as they exist in production, taken
-- from the live database on 11 October 2026, so the site can be rebuilt from the code alone.
-- Safe to run on the live project: existing tables and buckets are left alone, and the four
-- public read rules are replaced with identical ones.
--
-- Run first on a new project. 20261004010000_admin_only_content_writes.sql then adds the
-- admin-only write rules for these tables, and 20261011000000_security_advisor_fixes.sql the
-- admin-only read rule for their buckets. The public stats themselves are not created here: the
-- site falls back to its built-in figures (src/content/stats.ts) until an admin saves them in
-- Admin > Public Stats.

create table if not exists public.magazines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year integer not null,
  description text,
  pdf_url text not null,
  cover_image_url text,
  created_at timestamptz default now()
);

create table if not exists public.executive_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  email text,
  phone text,
  image_url text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  -- Gallery category: education, relief, livelihood, healthcare, madrasa or pathshala.
  filter_id text not null,
  title text not null,
  description text not null,
  story text not null,
  location text not null,
  year text not null,
  image_url text not null,
  span text not null check (span in ('large', 'medium', 'small')),
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.public_stats (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  description text,
  group_name text not null,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.magazines enable row level security;
alter table public.executive_members enable row level security;
alter table public.gallery_items enable row level security;
alter table public.public_stats enable row level security;

-- Public read rules, as named in production. Hidden committee members, gallery items and stats
-- stay private; all magazines are public.
drop policy if exists "Allow public read magazines" on public.magazines;
create policy "Allow public read magazines"
  on public.magazines for select to anon, authenticated
  using (true);

drop policy if exists "public can read executive members" on public.executive_members;
create policy "public can read executive members"
  on public.executive_members for select to anon, authenticated
  using (is_active = true);

drop policy if exists "public can read gallery items" on public.gallery_items;
create policy "public can read gallery items"
  on public.gallery_items for select to anon, authenticated
  using (is_active = true);

drop policy if exists "public can read public_stats" on public.public_stats;
create policy "public can read public_stats"
  on public.public_stats for select to anon, authenticated
  using (is_active = true);

-- Public buckets: files are served by their link. Magazine covers are kept in the magazines
-- bucket (covers/ folder), so it also accepts images.
insert into storage.buckets (id, name, public, allowed_mime_types)
values
  ('magazines', 'magazines', true, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('executives', 'executives', true, array['image/jpeg', 'image/png', 'image/webp']),
  ('gallery', 'gallery', true, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Note: production also has an unused "magazine_cover" bucket left over from early setup. The
-- site never reads or writes it, so it is not recreated here.
