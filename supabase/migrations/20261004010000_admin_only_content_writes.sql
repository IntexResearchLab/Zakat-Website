-- Only admins (accounts in public.admin_users) may change website content.
-- Run after 20261004000000_donations_and_receipts.sql, which creates public.is_admin().
--
-- To see the current rules before running this, run:
--   select tablename, policyname, cmd, roles, qual, with_check from pg_policies
--   where schemaname = 'public'
--     and tablename in ('magazines', 'executive_members', 'gallery_items', 'public_stats');
--   select policyname, cmd, roles, qual, with_check from pg_policies
--   where schemaname = 'storage' and tablename = 'objects';

do $$
declare
  content_tables text[] := array['magazines', 'executive_members', 'gallery_items', 'public_stats'];
  content_buckets text[] := array['magazines', 'executives', 'gallery'];
  t text;
  p record;
begin
  -- 1. Remove every existing write rule on the content tables (whatever it was called).
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename = any (content_tables) and cmd <> 'SELECT'
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;

  foreach t in array content_tables loop
    execute format('alter table public.%I enable row level security', t);

    -- 2. Keep the website readable: if dropping an "ALL" rule removed the only read rule, add one.
    if not exists (
      select 1 from pg_policies where schemaname = 'public' and tablename = t and cmd = 'SELECT'
    ) then
      execute format('create policy %I on public.%I for select using (true)', 'Public can read ' || t, t);
    end if;

    -- 3. Admin-only writes.
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin())', 'Admins can add ' || t, t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', 'Admins can edit ' || t, t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin())', 'Admins can delete ' || t, t);
  end loop;

  -- 4. Storage: remove write rules that mention the content buckets, then allow admins only.
  --    The buckets stay public, so images and PDFs keep loading on the website.
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and cmd <> 'SELECT'
      and exists (
        select 1 from unnest(content_buckets) as b
        where coalesce(qual, '') like '%''' || b || '''%' or coalesce(with_check, '') like '%''' || b || '''%'
      )
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

drop policy if exists "Admins upload content files" on storage.objects;
create policy "Admins upload content files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('magazines', 'executives', 'gallery') and public.is_admin());

drop policy if exists "Admins replace content files" on storage.objects;
create policy "Admins replace content files"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('magazines', 'executives', 'gallery') and public.is_admin())
  with check (bucket_id in ('magazines', 'executives', 'gallery') and public.is_admin());

drop policy if exists "Admins delete content files" on storage.objects;
create policy "Admins delete content files"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('magazines', 'executives', 'gallery') and public.is_admin());
