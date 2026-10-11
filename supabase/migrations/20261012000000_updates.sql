-- News and updates: short posts about monthly programmes and events, with photos and an
-- optional YouTube video.
-- Run after 20261011000000_security_advisor_fixes.sql. Safe to run more than once.

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_en text not null,
  title_bn text,
  body_en text not null,
  body_bn text,
  -- The day the post is about. Defaults to today in Bangladesh, not the server's time zone.
  published_on date not null default ((now() at time zone 'Asia/Dhaka')::date),
  -- Optional programme, using the same categories as the gallery.
  program text
    check (program in ('education', 'relief', 'livelihood', 'healthcare', 'madrasa', 'pathshala')),
  -- Public photo links in display order. The first one is also the link preview image.
  photos text[] not null default '{}' check (cardinality(photos) <= 6),
  -- Only the link is stored; the site plays it from youtube-nocookie.com.
  youtube_url text check (youtube_url is null or youtube_url ~* '^https://'),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists updates_published_on_idx
  on public.updates (published_on desc, created_at desc);

alter table public.updates enable row level security;

-- Visitors only ever see published posts. Hidden posts stay private, like hidden appeals.
drop policy if exists "Anyone can read published updates" on public.updates;
create policy "Anyone can read published updates"
  on public.updates for select
  using (is_published);

drop policy if exists "Admins can read all updates" on public.updates;
create policy "Admins can read all updates"
  on public.updates for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can add updates" on public.updates;
create policy "Admins can add updates"
  on public.updates for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can edit updates" on public.updates;
create policy "Admins can edit updates"
  on public.updates for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete updates" on public.updates;
create policy "Admins can delete updates"
  on public.updates for delete to authenticated
  using (public.is_admin());

-- Public bucket for update photos; only admins can change files. Photos are compressed in the
-- browser before upload, so the size limit only stops mistakes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('updates', 'updates', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Admins upload update images" on storage.objects;
create policy "Admins upload update images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'updates' and public.is_admin());

drop policy if exists "Admins replace update images" on storage.objects;
create policy "Admins replace update images"
  on storage.objects for update to authenticated
  using (bucket_id = 'updates' and public.is_admin())
  with check (bucket_id = 'updates' and public.is_admin());

drop policy if exists "Admins delete update images" on storage.objects;
create policy "Admins delete update images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'updates' and public.is_admin());

-- Supabase Storage needs a read rule to replace or delete a file. Admins only: a public bucket
-- serves files by their link without one, and a public read rule would let anyone list them.
drop policy if exists "Admins read content files" on storage.objects;
create policy "Admins read content files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('magazines', 'executives', 'gallery', 'campaigns', 'stories', 'updates')
    and public.is_admin()
  );
