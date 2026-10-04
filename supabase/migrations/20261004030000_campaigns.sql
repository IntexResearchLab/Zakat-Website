-- Fundraising campaigns (appeals) with goals and progress.
-- Run after 20261004020000_manual_donations.sql.

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_en text not null,
  title_bn text,
  summary_en text not null,
  summary_bn text,
  story_en text,
  story_bn text,
  image_url text,
  goal_amount numeric(12, 2) not null check (goal_amount > 0),
  -- Donation purpose used for gifts to this campaign (for receipts and reports).
  category text not null default 'default'
    check (category in ('default', 'zakat', 'education', 'healthcare', 'livelihood')),
  starts_on date,
  ends_on date,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

alter table public.campaigns enable row level security;

drop policy if exists "Anyone can read campaigns" on public.campaigns;
create policy "Anyone can read campaigns"
  on public.campaigns for select
  using (true);

drop policy if exists "Admins can add campaigns" on public.campaigns;
create policy "Admins can add campaigns"
  on public.campaigns for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can edit campaigns" on public.campaigns;
create policy "Admins can edit campaigns"
  on public.campaigns for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete campaigns" on public.campaigns;
create policy "Admins can delete campaigns"
  on public.campaigns for delete to authenticated
  using (public.is_admin());

-- Link donations to a campaign. Deleting a campaign keeps its donations.
alter table public.donations
  add column if not exists campaign_id uuid references public.campaigns (id) on delete set null;

create index if not exists donations_campaign_idx on public.donations (campaign_id);

-- Public progress for each campaign: totals only, never names or individual gifts.
-- Runs with the owner's rights because visitors cannot read the donations table.
create or replace function public.campaign_totals()
returns table (campaign_id uuid, raised numeric, donor_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select d.campaign_id, coalesce(sum(coalesce(d.paid_amount, d.amount)), 0), count(*)
  from public.donations d
  where d.campaign_id is not null and d.status = 'paid'
  group by d.campaign_id;
$$;

revoke all on function public.campaign_totals() from public;
grant execute on function public.campaign_totals() to anon, authenticated;

-- Public bucket for campaign photos; only admins can change files.
insert into storage.buckets (id, name, public)
values ('campaigns', 'campaigns', true)
on conflict (id) do nothing;

drop policy if exists "Admins upload campaign images" on storage.objects;
create policy "Admins upload campaign images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'campaigns' and public.is_admin());

drop policy if exists "Admins replace campaign images" on storage.objects;
create policy "Admins replace campaign images"
  on storage.objects for update to authenticated
  using (bucket_id = 'campaigns' and public.is_admin())
  with check (bucket_id = 'campaigns' and public.is_admin());

drop policy if exists "Admins delete campaign images" on storage.objects;
create policy "Admins delete campaign images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'campaigns' and public.is_admin());
