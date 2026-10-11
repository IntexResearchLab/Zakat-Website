# Alokayon Launch Checklist

Everything left to put the new website, SSLCommerz donations and email receipts live, and hand it over to Alokayon. Work top to bottom: each step depends on the one before it.

Interactive version (ticks are saved): https://claude.ai/artifact/XwWJP4Z8XdHtHzZB5igpCc

Items marked **(new)** were added after the full site audit on 4 October 2026.

## Audit summary (4 October 2026)

- **Build and lint:** pass. Every public page loads with no broken images or dead links.
- **Payments:** sound. SSLCommerz payments are checked with the server, the amount is matched against the donation, and each donation gets exactly one receipt.
- **Database:** no donor details are readable by the public. Two checks are needed when running the SQL (step 1).
- **Fixed on 5 October (not yet committed):** four payment and appeal bugs, six outdated packages, a missing Bangla label, text running off phone screens, phone links without +880, and contact form spam limits. See step 6.

## 1. Secure Supabase
_About 15 minutes_

- [x] Turn off **"Allow new users to sign up"**
  - supabase.com/dashboard → your project → **Authentication → Sign In / Providers**
  - This stops strangers creating accounts that can reach the admin area.
- [x] **(new)** Set the site address under **Authentication → URL Configuration**
  - For now the Site URL stays `https://zakat-website-hazel.vercel.app` (the site is on Vercel until the domain moves).
  - Redirect URLs: the vercel.app ones, plus `https://alokayoncharity.com/admin/reset-password` and `http://localhost:5173/admin/reset-password`
  - Without this, "Forgot password" emails for the admin link to the wrong place.
- [x] Run the donations and receipts setup in **SQL Editor**: paste and run [`supabase/migrations/20261004000000_donations_and_receipts.sql`](supabase/migrations/20261004000000_donations_and_receipts.sql)
  - This creates the donations table, the private storage for signed receipts, and the admin allowlist.
- [x] Add each admin login to the allowlist (replace the email, then run it in SQL Editor):
  ```sql
  insert into public.admin_users (user_id, email)
  select id, email from auth.users where email = 'CLIENT_EMAIL_HERE';
  ```
  - **Until this is done, nobody can open the admin dashboard**, including you.
- [x] Run [`supabase/migrations/20261004020000_manual_donations.sql`](supabase/migrations/20261004020000_manual_donations.sql) in **SQL Editor**
  - This lets admins record bKash, Nagad, bank and cash donations. Run it after the donations and receipts file.
- [x] Run [`supabase/migrations/20261004030000_campaigns.sql`](supabase/migrations/20261004030000_campaigns.sql) in **SQL Editor**
  - This adds fundraising campaigns (appeals). Run it after the manual donations file.
- [x] Run [`supabase/migrations/20261004040000_contact_messages.sql`](supabase/migrations/20261004040000_contact_messages.sql) in **SQL Editor**
  - This stores messages from the website's contact form for the admin inbox.
- [x] Run [`supabase/migrations/20261004050000_testimonials.sql`](supabase/migrations/20261004050000_testimonials.sql) in **SQL Editor**
  - This lets admins edit the beneficiary and donor quotes shown on the site.
- [x] Run [`supabase/migrations/20261004060000_stories.sql`](supabase/migrations/20261004060000_stories.sql) in **SQL Editor**
  - This lets admins edit the featured beneficiary story and the donor stories.
- [x] **(new)** Before the last file, check the table names. Run this and confirm it lists `magazines`, `executive_members`, `gallery_items` and `public_stats`:
  ```sql
  select tablename, policyname, cmd, roles from pg_policies
  where schemaname = 'public'
    and tablename in ('magazines', 'executive_members', 'gallery_items', 'public_stats');
  ```
  - If a table is missing or named differently, the next file stops with an error and changes nothing. Send Claude the result.
- [x] Limit editing of magazines, gallery, executives and public stats to admins only: run [`supabase/migrations/20261004010000_admin_only_content_writes.sql`](supabase/migrations/20261004010000_admin_only_content_writes.sql) in **SQL Editor**
  - Run it after the files above. Then check the public pages still show their content, and that you can still edit in the admin.
- [x] **(new)** Check the file storage rules. Run this and send Claude the result:
  ```sql
  select policyname, cmd, roles, qual, with_check from pg_policies
  where schemaname = 'storage' and tablename = 'objects';
  ```
  - Older rules made in the dashboard may let any signed-in user (or anyone) open every storage folder, including the private signed receipts. Every rule should name a specific folder (`bucket_id`). Claude will tell you which ones to remove.
- [ ] **(new)** If the site or admin shows "permission denied" after the SQL, tell Claude
  - Some newer Supabase projects do not open new tables automatically. Claude will give you one more line of SQL to run.
- [x] **(new)** Open **Advisors → Security Advisor** and send Claude anything marked as an error or warning.
  - Done 11 October 2026: no errors. The `campaign_totals`, `is_admin` and leaked-password warnings are expected and can be ignored.
- [x] Run [`supabase/migrations/20261011000000_security_advisor_fixes.sql`](supabase/migrations/20261011000000_security_advisor_fixes.sql) in **SQL Editor**
  - Fixes the receipt number search path warning and stops anyone listing every file in the gallery, executives and magazines folders.

## 2. Test the admin with Claude
_About 15 minutes_

- [x] Open the project in Claude, open the browser pane, go to `localhost:5173/admin` and sign in yourself.
- [x] Tell Claude "I'm signed in" and let it test every section (Donations, including recording a donation by hand, Campaigns, Messages, Testimonials, Stories, Gallery, Executives, Magazines, Public Stats). Claude undoes every test change.
  - Tested 11 October 2026 on the live vercel.app site. Campaigns, Testimonials, Stories, Executives, Gallery, Magazines and Public Stats all save, show publicly and delete cleanly (photos included). Messages is empty and loads.
- [x] Run [`supabase/migrations/20261011010000_magazine_cover_types.sql`](supabase/migrations/20261011010000_magazine_cover_types.sql) in **SQL Editor**
  - Magazine cover images failed to upload ("mime type image/jpeg is not supported"); PDFs work.
- [x] Re-test **Admin → Donations → Record a donation** after step 8
  - Works since `SUPABASE_SERVICE_ROLE_KEY` and `SITE_URL` were added (11 October 2026). Receipt PDF downloads; contact form messages reach Admin → Messages.

## 3. Fill in the executive committee, quotes, stories and figures
_When you have the details_

- [ ] Add the real committee members in **Admin → Executives**, with names, roles and photos.
  - The About page shows placeholders until this is done, and SSLCommerz wants management details on the site.
- [ ] In **Admin → Testimonials**, press **Import the current quotes**, then review them
  - This copies the quotes already on the site so they can be edited. Hide or remove any the people quoted have not agreed to share.
- [ ] In **Admin → Stories**, press **Import the current stories**, then review them the same way
- [ ] Enter today's gold and silver prices in **Admin → Public Stats → Zakat Calculator**, with the date you checked them
  - Use the 22 carat per-gram rates from the BAJUS price list (bajus.org). Until these are set, visitors have to type the prices themselves.
  - Update them whenever BAJUS changes the rates, and before Ramadan.
- [ ] **(new)** Fix the impact figures in **Admin → Public Stats**
  - The site says **100+ beneficiaries reached**, but also 200+ students, 70+ widows, 60+ elderly people and 100+ families. The Donate page shows "100+ beneficiaries" right next to "200+ students". Ask Alokayon for the real total.

## 4. Check the compliance details
_Needs someone from Alokayon_

- [ ] Compare the footer address with the **trade license**, word for word. Send Claude the exact wording if anything differs.
  - The same address is printed on every receipt PDF, so it must be correct.
- [ ] **(new)** Get Alokayon's registration number from the Department of Social Services and send it to Claude
  - The policy pages and receipt PDF only say "Registered with the Department of Social Services (2019)". Donors and SSLCommerz expect the number itself.
- [ ] Have the Terms, Privacy and Refund pages reviewed and approved. Confirm:
  - the 7-day window to request a refund
  - the 3-working-day reply time
  - that money for a fully funded programme may go to a similar one
  - that disputes go to the Dhaka courts
  - that receipts are emailed as a PDF, and a hand-signed copy can be requested
- [ ] **(new)** Decide how long to keep donor records and contact messages, and add it to the Privacy page
  - Today they are kept forever. Bangladesh tax rules usually need donation records for several years; contact messages can usually go after one or two years.
- [ ] **(new)** Ask Alokayon's scholar to confirm the zakat calculator
  - It uses 2.5%, a nisab of 87.48 g gold or 612.36 g silver, and silver by default. Gold is priced at 22 carat, while many scholars use pure (24 carat) gold for the nisab.
- [ ] **(new)** Ask for Alokayon's Facebook page (and any other social accounts) so Claude can add them to the footer and Contact page
  - The site has no social links at the moment.

## 5. Set up Resend (receipt emails)
_About 15 minutes, plus waiting for DNS_

- [ ] Create an account at https://resend.com
- [ ] Add and verify **alokayoncharity.com** under **Domains** (add the DNS records Resend shows at your domain provider).
- [ ] Create an API key under **API Keys** and keep it for step 8.
- [ ] **(new)** Use Resend for Supabase's own emails too: **Supabase → Authentication → Emails → SMTP Settings**
  - Supabase's built-in sender only allows a few emails an hour and often lands in spam, so admin password reset emails may not arrive. Resend's guide: https://resend.com/docs/send-with-supabase-smtp

## 6. Fix what the audit found (new)
_Done by Claude on 5 October 2026; committed with step 7_

- [x] Fix the payment code
  - If SSLCommerz cannot be reached, a donor who paid now sees "your payment is being verified" instead of "Payment failed".
  - A hand-signed receipt ticked on the donate form now notifies `ADMIN_NOTIFY_EMAIL`.
  - A `$` in an appeal title no longer breaks its link preview.
  - Donations recorded by hand use Bangladesh dates.
- [x] Update outdated packages: react-router, vite, postcss and three others. `npm audit` now reports no problems.
- [x] Add the missing Bangla "Read full message" text on the home page.
- [x] Fix text running off phone screens, and phone links without +880.
- [x] Tighten the contact form against spam
  - After 20 messages in an hour, new messages still reach **Admin → Messages** but no longer email `ADMIN_NOTIFY_EMAIL`.
  - Stored visitor addresses are now protected with a server secret.

## 7. Merge the code
_About 5 minutes_

- [x] Make sure all the work, including step 6, is committed and pushed to the `sslcommerz-integration` branch (ask Claude to do it).
- [x] Open the pull request: https://github.com/IntexResearchLab/Zakat-Website/pull/10
- [x] Create the pull request into `main` and merge it. Merged on 5 October 2026.
  - Vercel builds it successfully after the admin and receipt endpoints were combined to fit the free plan's 12-function limit.

## 8. Set up Vercel
_Project → Settings → Environment Variables → Production_

- [ ] `SSLCOMMERZ_STORE_ID`: the Store ID from the SSLCommerz "Integration Credentials" email
- [ ] `SSLCOMMERZ_STORE_PASSWORD`: the Store Password from the same email (never paste it anywhere else)
- [ ] `SSLCOMMERZ_SANDBOX`: `false`
- [x] `SITE_URL`: `https://alokayoncharity.com`
  - Set to `https://zakat-website-hazel.vercel.app` for now. Change it to `https://alokayoncharity.com` when the domain moves, then redeploy.
- [x] `SUPABASE_SERVICE_ROLE_KEY`: from Supabase → **Project Settings → API Keys** (secret; never put `VITE_` in front of it)
- [ ] `RESEND_API_KEY`: the key from step 5
- [ ] `RECEIPT_FROM_EMAIL`: e.g. `Alokayon <receipts@alokayoncharity.com>`
- [ ] `RECEIPT_REPLY_TO`: `alokayon2019@gmail.com`
- [ ] `ADMIN_NOTIFY_EMAIL`: the inbox that is told about new contact messages and signed receipt requests
- [ ] Redeploy the site after saving all nine settings.
- [ ] **(new)** Back up the old WordPress site before switching the domain
  - alokayoncharity.com still shows the old WordPress site on its current host (LiteSpeed, 139.99.9.21). Download a full backup from that host first.
- [ ] Connect **alokayoncharity.com** to this Vercel project
  - Add the domain in Vercel → **Settings → Domains**, then change the DNS records at your domain provider to the ones Vercel shows.
  - Only change the website records (A, and CNAME for www). Leave the MX and email records alone, or email for the domain stops working.
  - Until this is done, visitors still see the old WordPress site. Live payments only work on alokayoncharity.com, not on a vercel.app address.
- [ ] **(new)** Under **Settings → Domains**, make `alokayoncharity.com` the main domain and set `www.alokayoncharity.com` to redirect to it
  - SSLCommerz checks the exact address. If it is the other way round, payments started on www can fail.
- [ ] Change the Supabase **Site URL** to `https://alokayoncharity.com` (**Authentication → URL Configuration**) once the domain shows the new site

## 9. Set up SSLCommerz
_Merchant Panel_

- [ ] Under **My Store → IPN Settings**, set the IPN URL to `https://alokayoncharity.com/api/payment/ipn`
  - This lets SSLCommerz confirm a payment and send the receipt even if the donor closes the browser.

## 10. Test a real payment
_About 15 minutes_

- [ ] Donate **৳10** on alokayoncharity.com with your own bKash or card, and tick **"I would also like a hand-signed receipt"**.
- [ ] Check you see the "Thank you" page and the payment in the Merchant Panel.
- [ ] Check the receipt email arrives (not in spam) with the PDF attached, and that the notice reaches `ADMIN_NOTIFY_EMAIL`.
  - The notice only arrives once the step 6 payment fixes are live.
- [ ] In **Admin → Donations**, find the ৳10 donation, upload a signed copy, and check the donor email receives it.
- [ ] Send a test message from the Contact page and check it arrives at `ADMIN_NOTIFY_EMAIL` and in **Admin → Messages**.
- [ ] **(new)** On the admin sign-in page, press "Forgot password" and check the reset email arrives and its link opens `alokayoncharity.com/admin/reset-password`.
- [ ] Check link previews: paste `https://alokayoncharity.com/donate` and an appeal link into https://www.opengraph.xyz (or send them to yourself on WhatsApp) and confirm each shows its own title, and the appeal shows its photo.
- [ ] **(new)** Open the live site on a phone and switch the language to Bangla and German. Check the home, Donate and Zakat Calculator pages.
- [ ] Refund the ৳10 from the Merchant Panel.

## 11. Tell SSLCommerz you are done
_Email reply_

- [ ] Reply to their compliance email with a link to the site. Say the policies, footer details, payment banner and checkout checkbox are all live.

## 12. Hand over to Alokayon (new)
_About 1 hour with the client_

- [ ] Make sure Alokayon owns every account, or is an owner on it: Supabase, Vercel, Resend, the GitHub repository and the domain registrar
  - Agree who pays for each and whose card is on file. Keep Intex as a member if you are providing support.
- [ ] Give each Alokayon admin their own login, and add them to the allowlist (step 1)
  - Do not share one login. Remove any test or developer logins they do not need.
- [ ] Walk the admins through the dashboard
  - Recording bKash, Nagad, bank and cash donations; sending signed receipts; reading messages; adding appeals; updating gold and silver prices; uploading magazines and gallery photos.
- [ ] Save a copy of the database layout to the project (ask Claude)
  - The magazines, gallery, executives and stats tables were made in the dashboard and are not saved in the code, so the site cannot be rebuilt from the code alone.
- [ ] Check Supabase backups are on (**Project Settings → Database → Backups**) and that someone at Alokayon can download the donations list (CSV) from **Admin → Donations**
- [ ] Agree what support Intex provides after launch, and who Alokayon contacts when something breaks.
- [ ] Tell Alokayon about the known limitations below.

## 13. Clean up
_1 minute_

- [ ] Delete the two SSLCommerz credential PDFs from Downloads. They contain live passwords.

## 14. New features Alokayon asked for (5 October 2026)
_After launch; they do not block steps 1 to 13_

Both fit the Vercel free plan: the site uses 9 of its 12 functions, and neither feature needs a new one.

### Suggestion box for international members

- [ ] Ask Alokayon:
  - Which inbox should suggestions go to? (`ADMIN_NOTIFY_EMAIL`, or a separate address)
  - Can people send a suggestion without giving their name?
  - Should we ask for the member's country?
- [ ] Claude builds it:
  - A "Suggestion box" form on the Contact page, with a link from the footer. Fields: name (optional), email, country, suggestion.
  - It goes through the existing contact form endpoint as a new "Suggestion" topic, so it gets the same spam protection.
  - Each suggestion is emailed to the chosen inbox and also kept in **Admin → Messages**, with a filter to show suggestions only.
  - Labels in English, Bangla and German.
- [ ] Test: send a suggestion from the live site and check it arrives by email and in the admin.

### News and updates posts from the admin

For monthly programmes and events: a short update with photos and an optional YouTube video.

- [ ] Ask Alokayon:
  - Where should posts appear? Suggested: a new **Updates** page, plus the latest three on the home page.
  - Will they write posts in Bangla, English or both? (The site can show one language for everyone, or let them add a translation.)
  - How many photos per post? Suggested: up to 6, shrunk automatically like the gallery photos.
- [ ] Claude builds it:
  - **Admin → Updates**: title, short text, date, optional programme (e.g. School, Madrasa), photos, YouTube link, and publish / hide.
  - A public **Updates** page with the newest posts first, and a page for each post.
  - YouTube links play on the page (in privacy mode). Only the link is stored, so videos use no storage space.
  - Each post shows its own title and first photo when shared on WhatsApp or Facebook.
  - A new database table and photo folder, with a SQL file to run in **SQL Editor** like step 1.
- [ ] Run the SQL file Claude provides, then test: create a post with photos and a YouTube link, check it on the site and on a phone, then delete it.
- [ ] Show the admins how to post an update (add it to the step 12 walkthrough).
- [ ] Keep an eye on storage: Supabase's free plan includes 1 GB. A shrunk photo (2000 px, like the gallery) is roughly 300 to 500 KB, so about 2,000 photos fit alongside the magazines and receipts.

---

## Known limitations

- **Bangla names on the receipt PDF:** the receipt PDF prints English letters only. A name typed in Bangla shows as "?" on the PDF (the email is fine). The donate form asks donors to write their name in English letters. Fixing this means adding a Bangla font to the PDF.
- **Admin in Bangla and German:** the admin dashboard is mostly English. About 500 admin labels have no German translation and about 250 still show English in Bangla. The public site is fully translated.
- **Large donation lists:** **Admin → Donations** loads the latest 1,000 donations, and its CSV download includes only those. This needs changing before Alokayon passes 1,000 donations.
- **Search engines:** the sitemap lists the main pages but not individual appeals or magazine years. Google still finds them through links.
- **Deleting a recorded donation** leaves its signed receipt file in storage.

If something goes wrong at any step, tell Claude what you clicked and what you saw.
