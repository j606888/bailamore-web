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

Next.js 15 App Router site for Baila'more, a Latin dance studio in Tainan, Taiwan. All content (schedule dates, teacher bios, pricing) is **hardcoded directly in components** — there is no CMS, database, or API routes.

**Pages (`src/app/`):**
- `/` — home page composed of Hero, WhoWeAre, Testimonials, FAQ
- `/courses?tab=schedule|introduction|pricing` — tab-based layout; tab state is synced with URL query param via `useSearchParams`
- `/teachers` — static teacher card grid
- `/teachers/[slug]` — teacher detail; `TEACHERS` record object in the page file is the data source
- `/location` — embedded Google Map + studio address

**Key data locations:**
- Course dates: `COURSE_PERIODS` array in `src/components/courses/Schedule.tsx` — update this when adding new class periods
- Teacher data: `TEACHERS` object in `src/app/teachers/[slug]/page.tsx`
- Pricing: hardcoded JSX in `src/components/courses/Pricing.tsx`
- External links (LINE registration URL): `src/constants/links.ts`

**UI conventions:**
- Package manager: **yarn**
- Styling: Tailwind CSS v4, mobile-first with `md:` breakpoints
- Primary brand color: teal-600 / `#0f7f75`
- Fonts: Poppins (primary `font-poppins`) and Roboto, loaded via `next/font/google` in `layout.tsx`
- UI primitives: shadcn/ui (`src/components/ui/`) backed by Radix UI
- Icons: SVGs in `public/icons/`, lucide-react for inline icons
- Analytics: `@vercel/analytics` injected in root layout

All page components use `'use client'` because the site is entirely interactive/client-rendered. Vercel is the deployment target.
