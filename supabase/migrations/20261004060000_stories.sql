-- Long-form stories, managed in Admin > Stories:
--   beneficiary: the featured story on Voices of Impact (the first visible one is shown)
--   donor:       the "How donors became involved" stories on Our Donors
-- Run after 20261004000000_donations_and_receipts.sql, which creates public.is_admin().

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('beneficiary', 'donor')),
  title_en text not null,
  title_bn text,
  -- Short introduction; blank lines separate paragraphs.
  summary_en text not null,
  summary_bn text,
  -- The full story; blank lines separate paragraphs.
  body_en text,
  body_bn text,
  name text,
  name_bn text,
  role_en text,
  role_bn text,
  -- Comma-separated highlights shown as badges, e.g. "GPA 5 student, BCS candidate".
  badges_en text,
  badges_bn text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists stories_kind_idx on public.stories (kind, sort_order);

alter table public.stories enable row level security;

drop policy if exists "Anyone can read stories" on public.stories;
create policy "Anyone can read stories"
  on public.stories for select
  using (true);

drop policy if exists "Admins can add stories" on public.stories;
create policy "Admins can add stories"
  on public.stories for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can edit stories" on public.stories;
create policy "Admins can edit stories"
  on public.stories for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete stories" on public.stories;
create policy "Admins can delete stories"
  on public.stories for delete to authenticated
  using (public.is_admin());

-- Public bucket for story photos; only admins can change files.
insert into storage.buckets (id, name, public)
values ('stories', 'stories', true)
on conflict (id) do nothing;

drop policy if exists "Admins upload story images" on storage.objects;
create policy "Admins upload story images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'stories' and public.is_admin());

drop policy if exists "Admins replace story images" on storage.objects;
create policy "Admins replace story images"
  on storage.objects for update to authenticated
  using (bucket_id = 'stories' and public.is_admin())
  with check (bucket_id = 'stories' and public.is_admin());

drop policy if exists "Admins delete story images" on storage.objects;
create policy "Admins delete story images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'stories' and public.is_admin());
