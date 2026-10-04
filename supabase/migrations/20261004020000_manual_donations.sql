-- Donations recorded by hand in the admin (bKash, Nagad, bank transfer, cash).
-- Run after 20261004000000_donations_and_receipts.sql.

alter table public.donations
  add column if not exists source text not null default 'online',
  add column if not exists payment_method text,
  add column if not exists reference text,
  add column if not exists notes text,
  add column if not exists recorded_by text;

alter table public.donations
  drop constraint if exists donations_source_check;
alter table public.donations
  add constraint donations_source_check check (source in ('online', 'manual'));

alter table public.donations
  drop constraint if exists donations_payment_method_check;
alter table public.donations
  add constraint donations_payment_method_check
  check (payment_method is null or payment_method in ('bkash', 'nagad', 'bank', 'cash', 'other'));

-- Cash donors often leave no email or phone number.
alter table public.donations alter column donor_email drop not null;
alter table public.donations alter column donor_phone drop not null;

create index if not exists donations_source_idx on public.donations (source);
