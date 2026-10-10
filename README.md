# HireCook.pk

Cook & chef hiring website for Islamabad and Rawalpindi, built with Next.js 16 (App Router), based on the approved HireCook design.

## What's inside

- **177 keyword landing pages.** Every target keyword has its own URL (`/hire-cook-in-islamabad`, `/male-cook-in-f-7-islamabad`, …), with the exact keyword as H1, unique title, meta description, intro, quick answer, duties, dishes, schedule, local area details, FAQs and related links. Source list: `lib/keywords.json`. Copy generator: `lib/content.ts`. Local data for 66 areas: `lib/areas.ts`.
- **7 category hubs** (`/c/...`), a services directory (`/services`), a salary guide, how it works, FAQ, about, contact, privacy and terms.
- **SEO / Local SEO:** canonical URLs, Open Graph/Twitter cards, sitemap with images, robots.txt, `EmploymentAgency`/`LocalBusiness` schema with geo, hours and 66 `areaServed` places, plus `Service`, `Offer`, `BreadcrumbList`, `FAQPage`, `HowTo` and `ItemList` schema. Geo meta tags and Google Maps embeds on area pages.
- **AEO / GEO / AIO:** an answer-first "Quick answer" block and fact table on every page, `speakable` schema, `/llms.txt` and `/llms-full.txt`, and robots rules that allow AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, …).
- **Mobile app look:** a sticky bottom dock with **Call · Hire Cook · WhatsApp**, a bottom-sheet menu, swipeable card carousels and an installable PWA (`manifest.webmanifest`). Desktop gets a sticky header and a floating WhatsApp button.
- **Animations & animated infographics:** scroll reveals, counters, a daily-hours donut, salary range bars, a hiring timeline and coverage bars (using `motion`).
- **Hire form:** saves requests to `LEADS_DIR/leads.jsonl` and can also notify you by email (SMTP) or Telegram. The success screen offers a pre-filled WhatsApp message. View requests at `/admin/leads?key=ADMIN_KEY`.
- **Images:** a free-licence Unsplash photo library, self-hosted in `public/images/photos` and optimised to AVIF/WebP by `next/image`.

## Configure

Copy `.env.example` to `.env` and set **phone, WhatsApp, email and street address**. The `NEXT_PUBLIC_*` values are compiled in, so rebuild after changing them. Indicative salaries and stats live in `lib/site.ts`.

## Local development

```bash
npm install
npm run dev
```

## Deploy to the VPS (72.62.193.221)

1. Point DNS: create `A` records for `hirecook.pk` and `www.hirecook.pk` → `72.62.193.221`.
2. SSH in as root and run:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/pinetravelpk-bit/hirecook/main/deploy/setup-vps.sh | bash
   ```

   This installs Node 22, PM2, Nginx and Certbot, builds the site, runs it on port 3000 behind Nginx, and issues the SSL certificate.
3. Edit `/var/www/hirecook/.env` (phone/WhatsApp), then run `bash /var/www/hirecook/deploy/deploy.sh`.
4. Optional auto-deploy on every push: add the GitHub secrets `VPS_HOST`, `VPS_USER` and `VPS_SSH_KEY`. The workflow in `.github/workflows/deploy.yml` will run the deploy for you.

## After launch

- Submit `https://hirecook.pk/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Create or verify your Google Business Profile with the same name, address and phone (NAP) as `lib/site.ts`, then add the profile URL to `site.social`.
