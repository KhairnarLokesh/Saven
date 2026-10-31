# Codebase Concerns & Technical Debt

This document catalogs technical debt, architectural risks, performance bottlenecks, bugs, and areas of fragility identified across the SAVEN codebase.

---

## 1. Resolved Bugs & Contract Fixes (Phase 02)

### A. Contact Form API Response Contract [RESOLVED]
- **Resolved in:** [src/components/Contact.tsx](file:///k:/Coding%20Projects/Saven/src/components/Contact.tsx#L110-L117)
- **Fix:** Contact form now consumes `data.message`, `data.errors` field-level feedback, and `data.error` fallback. Detailed server validation reasons are now accurately rendered.

### B. Sitemap Hash Fragment Removal [RESOLVED]
- **Resolved in:** [src/app/sitemap.ts](file:///k:/Coding%20Projects/Saven/src/app/sitemap.ts)
- **Fix:** Purged all non-standard client anchor fragment URLs (`#services`, `#estimator`, etc.). Sitemap strictly serves standard canonical routes matching sitemaps.org guidelines.

---

## 2. In-Memory Data Loss Vulnerability

### A. Non-Persistent Contact & Inquiry Submissions
- **Location:** [src/app/api/contact/route.ts](file:///k:/Coding%20Projects/Saven/src/app/api/contact/route.ts#L57-L59)
- **Issue:** The contact endpoint logs customer inquiries solely to `console.log` before returning `200 OK`. No transactional email service (e.g., Resend, Sendgrid, Postmark) or database (Supabase, PostgreSQL) is connected.
- **Impact:** Any server container restart, log rotation, or ephemeral hosting deploy causes irreversible loss of prospective customer leads.
- **Remediation:** Implement an email dispatch hook (e.g., Resend API) and persist submissions to an encrypted database table.

---

## 3. Performance & Client Bundle Bloat

### A. Heavy Animation & Math Libraries on Critical Path
- **Components:**
  - `Three.js` via [ShatterType.tsx](file:///k:/Coding%20Projects/Saven/src/components/ShatterType.tsx) (~60KB source, ~600KB+ minified Three.js library in bundle).
  - [FlyingButton.tsx](file:///k:/Coding%20Projects/Saven/src/components/FlyingButton.tsx) (~76.8KB source, 2,297 lines of Euler integration physics and particle canvas loops).
  - [LightRays.tsx](file:///k:/Coding%20Projects/Saven/src/components/LightRays.tsx) (~22.5KB source, raw WebGL2 raymarching shaders).
- **Impact:** On mobile devices or low-bandwidth connections, initial JavaScript bundle evaluation and WebGL shader compilation will cause noticeable CPU spikes and delay First Input Delay (FID) / Interaction to Next Paint (INP).
- **Remediation:**
  - Dynamic `next/dynamic` imports with `ssr: false` for `ShatterIntro` and `LightRays`.
  - Lazy load heavy Three.js assets only when requested or skip heavy 3D on mobile/reduced-motion devices (`prefers-reduced-motion`).

---

## 4. Dead Code & Orphaned Components [PURGED - Phase 02]

All unused, orphaned components and redundant re-export shims were deleted in Phase 02:
- `src/components/ServiceModal.tsx` (superseded by editorial accordion)
- `src/components/WhyChooseUs.tsx` (unreferenced 8-item grid)
- `src/components/SavenMeaningAnimation.tsx` (unreferenced acronym animation)
- `src/components/TracingBeam.tsx` (unreferenced SVG gradient container)
- `src/components/BendingMarquee.tsx` & `src/components/ui/bending-marquee.tsx` (unreferenced 3D perspective marquee)
- `src/components/TextMorph.tsx` & `src/components/ui/shatter-type.tsx` (redundant re-export wrappers)
- `src/data/services.ts` (unreferenced duplicate service definitions)
- Boilerplate SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)

---

## 6. Infrastructure & Dependency Risks

### A. Missing `node_modules/` in Local Workspace
- The project lockfile is present, but dependencies are not installed in the workspace directory. Commands like `npm run lint` fail immediately.
- **Remediation:** Run `npm install` to hydrate local dependencies.

### B. Next.js 16 Experimental Flags
- [next.config.ts](file:///k:/Coding%20Projects/Saven/next.config.ts) enables `cacheComponents: true` and `partialPrefetching: true`.
- These are experimental Canary features that may exhibit subtle caching bugs or change APIs between minor versions.
