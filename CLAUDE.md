# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # start dev server at localhost:3000
yarn build      # production build
yarn lint       # ESLint
```

No test suite is configured.

## Architecture

Next.js 15 App Router site for Baila'more, a Latin dance studio with venues in **Tainan and Kaohsiung**, Taiwan. All content (schedule dates, teacher bios, pricing) lives in **static TS data files** — there is no CMS, database, or API routes.

**Pages (`src/app/`):**
- `/` — home page composed of Hero, WhoWeAre, Testimonials, FAQ
- `/courses?tab=schedule|introduction|pricing` — tab-based layout; tab state is synced with URL query param via `useSearchParams`
- `/teachers` — static teacher card grid
- `/teachers/[slug]` — teacher detail, statically generated (`dynamicParams = false`)
- `/location` — both-venue overview; `/location/tainan` and `/location/kaohsiung` are the per-city landing pages (they carry the city keywords for search)

**Key data locations:**
- Venues/addresses: `src/data/venues.ts` — **single source of truth for every address on the site**. Never hardcode an address elsewhere; inconsistent NAP hurts local search ranking. Always write 台南市 (not 臺南市).
- Course dates, tracks, pricing: `src/components/courses/schedule/data.ts` (`TRACKS`, `MONTH`, `PRICE_PLANS`). A track's venue is `venueSlug`, resolved via `getVenue()`.
- Teacher data: `src/data/teachers.ts`
- FAQ: `src/data/faq.ts` · Testimonials: `src/data/testimonials.ts`
- Site identity (URL, name, default description): `src/constants/site.ts`
- External links (Instagram DM / LINE): `src/constants/links.ts`
- `src/components/courses/Schedule.tsx` and `Pricing.tsx` are **disabled** leftovers — not imported anywhere.

**SEO:**
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- `src/lib/jsonLd.ts` builds schema.org structured data; render it with `<JsonLd data={...} />` (`src/components/JsonLd.tsx`). Organization is in the root layout; each venue page carries a `LocalBusiness`, the home page a `FAQPage`, teacher pages a `Person`.
- Every page sets `alternates.canonical`. Keep both cities represented in site-wide copy (root description, Footer, WhoWeAre).

**UI conventions:**
- Package manager: **yarn**
- Styling: Tailwind CSS v4, mobile-first with `md:` breakpoints
- Primary brand color: teal-600 / `#0f7f75`
- Fonts: Poppins (primary `font-poppins`) and Roboto, loaded via `next/font/google` in `layout.tsx`
- UI primitives: shadcn/ui (`src/components/ui/`) backed by Radix UI
- Icons: SVGs in `public/icons/`, lucide-react for inline icons
- Analytics: `@vercel/analytics` injected in root layout

All `page.tsx` files are Server Components (important for crawlability); only leaf interactive components (`Navbar`, `FAQ`, `Testimonials`, `TrackCard`, the courses tab shell) use `'use client'`. Vercel is the deployment target.
