-- Fixes from the Supabase Security Advisor (11 October 2026).
-- Run after 20261004010000_admin_only_content_writes.sql.

-- 1. Pin the search path of the receipt number trigger (lint 0011).
alter function public.assign_receipt_number() set search_path = public;

-- 2. Stop anyone listing every file in the public folders (lint 0025).
--    Public folders serve files by their link without any read rule, so the website is unaffected.
drop policy if exists "public can read executive images" on storage.objects;
drop policy if exists "public can read gallery images" on storage.objects;
drop policy if exists "authenticated users can read magazine files" on storage.objects;

-- Supabase Storage needs a read rule to replace or delete a file, so admins keep one.
-- This also lets admins remove old appeal and story photos.
drop policy if exists "Admins read content files" on storage.objects;
create policy "Admins read content files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('magazines', 'executives', 'gallery', 'campaigns', 'stories')
    and public.is_admin()
  );
