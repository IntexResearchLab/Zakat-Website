-- Quotes from beneficiaries and donors, managed in Admin > Testimonials.
-- Run after 20261004000000_donations_and_receipts.sql, which creates public.is_admin().

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('beneficiary', 'donor')),
  name text not null,
  name_bn text,
  role_en text,
  role_bn text,
  location_en text,
  location_bn text,
  quote_en text not null,
  quote_bn text,
  -- Short heading shown above the quote, e.g. "Education made possible".
  headline_en text,
  headline_bn text,
  -- Comma-separated tags, e.g. "Scholarship support, Medical help".
  tags_en text,
  tags_bn text,
  show_on_home boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_kind_idx on public.testimonials (kind, sort_order);

alter table public.testimonials enable row level security;

drop policy if exists "Anyone can read testimonials" on public.testimonials;
create policy "Anyone can read testimonials"
  on public.testimonials for select
  using (true);

drop policy if exists "Admins can add testimonials" on public.testimonials;
create policy "Admins can add testimonials"
  on public.testimonials for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can edit testimonials" on public.testimonials;
create policy "Admins can edit testimonials"
  on public.testimonials for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete testimonials" on public.testimonials;
create policy "Admins can delete testimonials"
  on public.testimonials for delete to authenticated
  using (public.is_admin());
