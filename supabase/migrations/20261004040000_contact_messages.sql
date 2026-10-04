-- Messages sent through the website's contact form.
-- Rows are written only by the server function in api/contact.ts (service role key).
-- Run after 20261004000000_donations_and_receipts.sql, which creates public.is_admin().

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text not null default 'general'
    check (topic in ('general', 'donation', 'zakat', 'volunteer', 'partnership', 'other')),
  message text not null,
  language text,
  status text not null default 'new' check (status in ('new', 'replied', 'archived')),
  -- A one-way hash of the sender's IP address, used only to limit repeated sends.
  ip_hash text,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_ip_idx on public.contact_messages (ip_hash, created_at);

alter table public.contact_messages enable row level security;

drop policy if exists "Admins can read messages" on public.contact_messages;
create policy "Admins can read messages"
  on public.contact_messages for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update messages" on public.contact_messages;
create policy "Admins can update messages"
  on public.contact_messages for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete messages" on public.contact_messages;
create policy "Admins can delete messages"
  on public.contact_messages for delete to authenticated
  using (public.is_admin());
