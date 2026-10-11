-- Suggestion box for international members, stored with the contact form messages.
-- Run after 20261004040000_contact_messages.sql.

-- Suggestions may be sent without a name.
alter table public.contact_messages alter column name drop not null;

-- The member's country, given only on suggestions.
alter table public.contact_messages add column if not exists country text;

alter table public.contact_messages drop constraint if exists contact_messages_topic_check;
alter table public.contact_messages
  add constraint contact_messages_topic_check
  check (topic in ('general', 'donation', 'zakat', 'volunteer', 'partnership', 'other', 'suggestion'));
