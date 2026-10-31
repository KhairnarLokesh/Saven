# PLAN: Codebase Dead Code & Technical Debt Cleanup

**Phase:** 02 - Codebase Cleanup & Debt  
**Branch:** `feature/codebase-cleanup-and-debt`  
**Pattern:** Surgical Dead Code Elimination & Architecture Tightening  
**Status:** Completed & Verified  

---

## Objective
Eliminate all orphaned components, redundant shims, unused data structures, and default framework boilerplate while resolving identified functional bugs (sitemap XML spec compliance, contact API response handling). Keep the codebase clean, lean, strictly typed, and verified with zero build regressions.

---

## Tasks Breakdown

### Wave 1: Dead & Orphaned Components Purge
- [x] **Task 1.1:** Delete orphaned components that are unreferenced across the application:
  - `src/components/ServiceModal.tsx` (superseded by inline accordion in `Services.tsx`)
  - `src/components/WhyChooseUs.tsx` (unreferenced 8-item grid)
  - `src/components/SavenMeaningAnimation.tsx` (unreferenced acronym animation)
  - `src/components/TracingBeam.tsx` (unreferenced SVG gradient container)
  - `src/components/BendingMarquee.tsx` & `src/components/ui/bending-marquee.tsx` (unreferenced 3D perspective marquee)
- [x] **Task 1.2:** Remove redundant re-export shims:
  - `src/components/TextMorph.tsx` (callers import `@/components/ui/text-morph` directly)
  - `src/components/ui/shatter-type.tsx` (callers import `@/components/ShatterType` directly)

### Wave 2: Orphaned Data, Types & Static Boilerplate Purge
- [x] **Task 2.1:** Delete `src/data/services.ts` (125 lines superseded by `servicesList` in `Services.tsx`).
- [x] **Task 2.2:** Remove unused `ServiceItem` interface from `src/types/index.ts`.
- [x] **Task 2.3:** Remove unused `differentiators` array from `src/data/about.ts`.
- [x] **Task 2.4:** Remove dead `badge` key from `src/data/siteConfig.ts`.
- [x] **Task 2.5:** Delete unused Next.js starter SVGs in `public/`:
  - `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`.

### Wave 3: Functional Technical Debt Remediation
- [x] **Task 3.1:** Fix `src/app/sitemap.ts`:
  - Strip `#fragment` client anchor URLs (`#services`, `#estimator`, `#process`, `#about`, `#contact`) to strictly adhere to sitemaps.org standards and Google Search Console indexing guidelines.
- [x] **Task 3.2:** Fix `src/components/Contact.tsx` response contract:
  - Parse `data.message` as well as `data.error` so server-side validation error messages are displayed clearly to users instead of generic fallback.

### Wave 4: Verification & Quality Gates
- [x] **Task 4.1:** Verify TypeScript compilation (`npm run build`).
- [x] **Task 4.2:** Verify clean dev server execution and test endpoint behavior.
- [x] **Task 4.3:** Update `.planning/codebase/CONCERNS.md` reflecting resolved items.
- [x] **Task 4.4:** Stage and create atomic git commits on `feature/codebase-cleanup-and-debt`.
