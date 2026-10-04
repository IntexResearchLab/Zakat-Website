-- Donations, receipts, and the admin allowlist.
-- Run this once in Supabase > SQL Editor (or with `supabase db push`).
-- After running it, add each admin account to admin_users (see the bottom of this file).

-- ---------------------------------------------------------------------------
-- Admin allowlist
-- Only users listed here can open the admin dashboard and see donor data.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can read their own admin row" on public.admin_users;
create policy "Admins can read their own admin row"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Donations
-- Rows are written only by the server functions in /api (service role key).
-- ---------------------------------------------------------------------------
create sequence if not exists public.receipt_number_seq;

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  tran_id text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'review', 'failed', 'cancelled')),
  amount numeric(12, 2) not null check (amount > 0),
  paid_amount numeric(12, 2),
  currency text not null default 'BDT',
  category text not null default 'default',
  donor_name text not null,
  donor_email text not null,
  donor_phone text not null,
  val_id text,
  card_type text,
  risk_level text,
  paid_at timestamptz,
  receipt_number text unique,
  -- Secret used in donor links (download receipt, request a signed copy). Never shown in lists.
  receipt_token uuid not null unique default gen_random_uuid(),
  receipt_sent_at timestamptz,
  receipt_error text,
  signed_receipt_status text not null default 'none'
    check (signed_receipt_status in ('none', 'requested', 'sent')),
  signed_receipt_requested_at timestamptz,
  signed_receipt_path text,
  signed_receipt_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists donations_created_at_idx on public.donations (created_at desc);
create index if not exists donations_signed_status_idx on public.donations (signed_receipt_status);

-- Gives each donation a receipt number (ALK-2026-00001) the first time it becomes paid.
create or replace function public.assign_receipt_number()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'paid' and new.receipt_number is null then
    new.receipt_number :=
      'ALK-' || to_char(coalesce(new.paid_at, now()) at time zone 'Asia/Dhaka', 'YYYY') || '-' ||
      lpad(nextval('public.receipt_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists donations_assign_receipt_number on public.donations;
create trigger donations_assign_receipt_number
  before insert or update of status on public.donations
  for each row execute function public.assign_receipt_number();

alter table public.donations enable row level security;

drop policy if exists "Admins can read donations" on public.donations;
create policy "Admins can read donations"
  on public.donations for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Private storage for scanned, hand-signed receipts
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('signed-receipts', 'signed-receipts', false)
on conflict (id) do nothing;

drop policy if exists "Admins manage signed receipts" on storage.objects;
create policy "Admins manage signed receipts"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'signed-receipts' and public.is_admin())
  with check (bucket_id = 'signed-receipts' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Add the client's admin account(s). Replace the email and run:
--
--   insert into public.admin_users (user_id, email)
--   select id, email from auth.users where email = 'admin@example.com';
--
-- Also recommended: Authentication > Sign In / Providers > turn off "Allow new users to sign up",
-- and change the write policies on magazines, executive_members, gallery_items, public_stats
-- and their storage buckets to use public.is_admin() instead of "authenticated".
-- ---------------------------------------------------------------------------
