# HireCook.pk

Cook & chef hiring website for Islamabad and Rawalpindi, built with Next.js 16 (App Router), based on the approved HireCook design.

## What's inside

- **177 keyword landing pages.** Every target keyword has its own URL (`/hire-cook-in-islamabad`, `/male-cook-in-f-7-islamabad`, …), with the exact keyword as H1, unique title, meta description, intro, quick answer, duties, dishes, schedule, local area details, FAQs and related links. Source list: `lib/keywords.json`. Copy generator: `lib/content.ts`. Local data for 66 areas: `lib/areas.ts`.
- **10 cities.** Islamabad and Rawalpindi get every service. Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta get **male cooks only**: 183 generated pages (8 city-level keywords plus one page per local area per city). City data, areas and keyword patterns live in `lib/cities.ts`, and a male-cooks-only notice is shown on those pages, in the hire form and in the finder. Overview page: `/cities`.
- **Checks:** `npx tsx --conditions=react-server scripts/check-pages.ts` validates generated pages. After `next build`, `node scripts/audit.cjs` checks H1s, duplicate titles/descriptions and broken links.
- **15 category hubs** (`/c/...`: 7 service categories and 8 city hubs), a services directory (`/services`), how it works, FAQ, about, contact, privacy and terms. No salary figures appear anywhere on the site.
- **Registration badges:** SECP, FBR (NTN), Labour Department and PESSI, on the home, about and every keyword page (also in schema as `hasCredential`).
- **SEO / Local SEO:** canonical URLs, Open Graph/Twitter cards, sitemap with images, robots.txt, `EmploymentAgency`/`LocalBusiness` schema with the Chandni Chowk, Rawalpindi office, geo, hours and 66 `areaServed` places, plus `Service`, `BreadcrumbList`, `FAQPage`, `HowTo` and `ItemList` schema. Geo meta tags and Google Maps embeds on area pages.
- **AEO / GEO / AIO:** an answer-first "Quick answer" block and fact table on every page, `speakable` schema, `/llms.txt` and `/llms-full.txt`, and robots rules that allow AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, …).
- **Mobile app look:** a sticky bottom dock with **Call · Hire Cook · WhatsApp**, a bottom-sheet menu, swipeable card carousels and an installable PWA (`manifest.webmanifest`). Desktop gets a sticky header and a floating WhatsApp button.
- **Animations & animated infographics:** scroll reveals, counters, an animated twin-cities coverage map, verification rings, a daily-hours donut, a hiring timeline and coverage bars (using `motion`).
- **Hire form:** saves every request in the database and can also notify you by email (SMTP) or Telegram. The success screen offers a pre-filled WhatsApp message.
- **Admin panel (`/admin`):**
  - **Dashboard:** stats, a 14-day leads chart, pipeline, follow-ups due, top services and areas.
  - **Leads:** search, status pipeline (new → contacted → shortlisted → trial → hired / lost), follow-up dates, internal notes, one-tap Call/WhatsApp, and convert to client.
  - **Clients:** address, assigned cook, start date and billing note.
  - **Cooks:** CNIC, speciality, experience, verified flag and placements.
  - **Settings:** phone, WhatsApp, email, address, hours, Analytics and the footer credit. These go live on the website instantly.
  - **Users:** admin and staff roles, and password change.
  - **Export:** CSV for every list.
  - Data is stored in SQLite (`LEADS_DIR/hirecook.db`, built into Node, so there's nothing extra to install).
- **Images:** a free-licence Unsplash photo library, self-hosted in `public/images/photos` and optimised to AVIF/WebP by `next/image`.

## Configure

Business details are edited in **Admin → Settings**. Defaults live in `lib/site.ts`. The server env file only holds `ADMIN_USER` / `ADMIN_PASSWORD` (the first admin account, created on first start), `LEADS_DIR` and the optional email/Telegram notification keys. See `.env.example`.

## Local development

```bash
npm install
npm run dev
```

## Deployment (VPS 72.62.193.221, shared with other sites)

HireCook runs like the other Next.js sites on this server:

| What | Where |
| --- | --- |
| Code | `/var/www/hirecook/current` (owned by user `hirecook`) |
| Env (first admin account, notification keys) | `/etc/hirecook/hirecook.env` |
| Database (leads, clients, cooks, settings) | `/var/lib/hirecook/hirecook.db` |
| Service | systemd `hirecook.service` on `127.0.0.1:3104` (copy in `deploy/hirecook.service`) |
| Nginx | `/etc/nginx/sites-available/hirecook.pk` (copy in `deploy/nginx-hirecook.pk.conf`) |

To redeploy after pushing changes, run as root: `bash /var/www/hirecook/current/deploy/deploy.sh`.

For optional auto-deploy on every push, add the GitHub secrets `VPS_HOST`, `VPS_USER` and `VPS_SSH_KEY`.

**DNS:** `hirecook.pk` uses Cloudflare. Its `A` records for `@` and `www` must point to `72.62.193.221`. SSL comes from Let's Encrypt: `certbot --nginx -d hirecook.pk -d www.hirecook.pk --redirect`.

## After launch

- Submit `https://hirecook.pk/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Create or verify your Google Business Profile with the same name, address and phone (NAP) as `lib/site.ts`, then add the profile URL to `site.social`.
