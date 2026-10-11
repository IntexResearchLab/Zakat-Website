# Supabase database

Everything the website needs in Supabase is in `migrations/`. To rebuild the database on a new
project, paste each file into **SQL Editor** and run them in this order (the file names sort in
this order):

| File | Creates |
|---|---|
| `20260501000000_content_tables.sql` | Magazines, executive committee, gallery and public stats tables, and their storage buckets |
| `20261004000000_donations_and_receipts.sql` | Donations, receipt numbers, the private signed-receipts bucket, the admin allowlist and `is_admin()` |
| `20261004010000_admin_only_content_writes.sql` | Admin-only editing of the four content tables and their files |
| `20261004020000_manual_donations.sql` | Recording bKash, Nagad, bank and cash donations |
| `20261004030000_campaigns.sql` | Fundraising appeals and their photos |
| `20261004040000_contact_messages.sql` | The contact form inbox |
| `20261004050000_testimonials.sql` | Beneficiary and donor quotes |
| `20261004060000_stories.sql` | Long-form stories and their photos |
| `20261011000000_security_advisor_fixes.sql` | Stops public listing of files; admins keep a read rule |
| `20261011010000_magazine_cover_types.sql` | Lets the magazines bucket accept cover images |
| `20261012000000_updates.sql` | News and updates posts and their photos |
| `20261012010000_suggestion_box.sql` | Suggestion box fields on the contact inbox |

After running them:

1. **Authentication → Sign In / Providers:** turn off "Allow new users to sign up".
2. **Authentication → URL Configuration:** set the Site URL and add `/admin/reset-password` to the Redirect URLs.
3. **Authentication → Users → Add user** for each admin, then add them to the allowlist:
   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'ADMIN_EMAIL_HERE';
   ```
4. Content (magazines, gallery, committee, stats, appeals, quotes, stories, updates) and uploaded
   files are data, not structure: restore them from a Supabase backup, or add them again in the admin.

`schema-export-query.sql` is a read-only query that describes the dashboard-made tables. It was
used to write the first migration and can be rerun to check the live database still matches.
