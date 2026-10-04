# Alokayon website

The public website and admin dashboard for Alokayon, a registered charity in Bangladesh. Visitors can read about the charity's programs, view its reports, and donate online through SSLCommerz. Donors receive a PDF receipt by email and can ask for a hand-signed copy.

Built by Intex Research Lab, Development Unit.

## Stack

- React 19, TypeScript, Vite and Tailwind CSS 4
- Supabase for the database, admin sign-in and file storage
- Vercel for hosting; the functions in `api/` run as Vercel serverless functions
- SSLCommerz for payments, and Resend for receipt emails
- i18next for English, Bangla and German

## Run it locally

```bash
npm install
npm run dev
```

The site opens at http://localhost:5173. The dev server also runs the functions in `api/`, so you can test the payment flow against the SSLCommerz sandbox.

Copy `.env.example` to `.env.local` and fill in the values. Variables starting with `VITE_` are built into the browser code, so only public values go there. All other variables are server-only.

| Variable | Used for |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Reading site content and admin sign-in |
| `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `SSLCOMMERZ_SANDBOX` | Payments |
| `SITE_URL` | The public address used in payment callbacks and email links |
| `SUPABASE_SERVICE_ROLE_KEY` | Recording donations (server only, never prefix with `VITE_`) |
| `RESEND_API_KEY`, `RECEIPT_FROM_EMAIL`, `RECEIPT_REPLY_TO`, `ADMIN_NOTIFY_EMAIL` | Receipt emails |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with the API functions |
| `npm run build` | Type-check, build for production into `dist/`, and write per-page link previews |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |

## Database

The SQL in `supabase/migrations/` sets up donations, receipts, the admin allowlist and admin-only editing. Run the files in order in the Supabase SQL Editor. Only accounts listed in `public.admin_users` can open the admin dashboard; the bottom of the first migration shows how to add one.

## Project layout

```
api/                 Vercel functions: payments, receipts, admin actions
  _lib/              Shared server code (SSLCommerz, Supabase, PDF receipts, email)
public/              Static files: images (WebP), robots.txt, sitemap.xml, share image
src/
  pages/             One component per route; every page except Home loads on demand
  components/        Page sections, grouped by page, plus reusables/
  content/           Built-in figures shown before Supabase data loads
  lib/               Data loading, caching, admin helpers
  locales/           Translations (en is bundled; bn and de load when chosen)
supabase/migrations/ SQL to run in Supabase
```

## Things to know when editing

- **Icons** use a subset of the Material Symbols font that only contains the icons the site uses. When you add a new icon, add its name to `icon_names` in both `index.html` and `src/index.css`, in alphabetical order. Otherwise it shows as text.
- **Images** go in `public/assets/` as WebP, at most 1600px wide.
- **Text** belongs in `src/locales/*/common.json`, not in components, so it can be translated.
- **New pages** need a description in `seo.descriptions` and an entry in `src/content/pageMeta.json`, and public pages should be added to `public/sitemap.xml`.
- **Link previews:** `npm run build` also runs `scripts/prerender-meta.mjs`, which writes one HTML file per public page (for example `dist/donate.html`) with that page's title and description, so WhatsApp and Facebook show the right preview. Appeal pages get theirs from `api/campaign-page.ts` when they are requested.
