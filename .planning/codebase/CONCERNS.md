# Codebase Concerns & Technical Debt

This document catalogs technical debt, architectural risks, performance bottlenecks, bugs, and areas of fragility identified across the SAVEN codebase.

---

## 1. Critical Bugs & Contract Inconsistencies

### A. Contact Form API Response Key Mismatch
- **Location:** [src/components/Contact.tsx](file:///k:/Coding%20Projects/Saven/src/components/Contact.tsx#L111) vs. [src/app/api/contact/route.ts](file:///k:/Coding%20Projects/Saven/src/app/api/contact/route.ts#L31)
- **Issue:** When the server returns validation errors or failure status, the route handler responds with:
  ```json
  { "success": false, "message": "Validation failed...", "errors": { ... } }
  ```
  However, `Contact.tsx` inspects `data.error`:
  ```typescript
  setErrorMessage(data.error || 'Failed to submit inquiry. Please reach out via email directly.');
  ```
  Because `data.error` is `undefined`, the user never receives the specific server validation error message and is presented with a generic failure notice.
- **Remediation:** Update `Contact.tsx` to read `data.message` and map `data.errors` to form field indicators.

### B. Invalid Sitemap Hash Fragment URLs
- **Location:** [src/app/sitemap.ts](file:///k:/Coding%20Projects/Saven/src/app/sitemap.ts#L15-L44)
- **Issue:** The sitemap generator produces URLs containing fragment identifiers:
  ```typescript
  { url: `${baseUrl}/#services`, ... }
  { url: `${baseUrl}/#estimator`, ... }
  { url: `${baseUrl}/#process`, ... }
  ```
  Per standard XML sitemap specifications (sitemaps.org) and search engine guidelines (Google / Bing), fragment identifiers (`#`) are client-side only and are either stripped or flagged as invalid in Google Search Console.
- **Remediation:** Sitemaps should only list distinct canonical page URLs (or separate route pages if converted to multi-page in the future).

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

## 4. Dead Code & Orphaned Components

Several large, high-effort components exist in `src/components/` but are completely unreferenced in `page.tsx` or any active template:

| Orphaned Component | File Path | Line Count | Notes |
| :--- | :--- | :--- | :--- |
| **BendingMarquee** | `src/components/ui/bending-marquee.tsx` | 418 lines | Complex 3D CSS perspective marquee; unused |
| **SavenMeaningAnimation**| `src/components/SavenMeaningAnimation.tsx` | 149 lines | Interactive SAVEN acronym explainer; unused |
| **TracingBeam** | `src/components/TracingBeam.tsx` | 100+ lines | Scroll-linked SVG gradient container; unused |
| **WhyChooseUs** | `src/components/WhyChooseUs.tsx` | 70+ lines | 8-item value proposition cards; unused |

- **Impact:** Increased bundle size if imported, developer confusion, and wasted maintenance surface.
- **Remediation:** Either incorporate these components into appropriate landing sections (e.g. embed `WhyChooseUs` into `About.tsx`, insert `SavenMeaningAnimation` into the brand story) or archive/delete them.

---

## 5. Architectural & Structural Inconsistencies

### A. Inverted UI Component Re-Exports
- `src/components/ShatterType.tsx` contains the actual 1,700-line implementation, and `src/components/ui/shatter-type.tsx` re-exports it.
- Conversely, `src/components/ui/bending-marquee.tsx` contains the actual implementation, and `src/components/BendingMarquee.tsx` re-exports it.
- **Remediation:** Standardize all primitives to live inside `src/components/ui/` with re-exports or direct imports adhering strictly to shadcn/ui conventions.

---

## 6. Infrastructure & Dependency Risks

### A. Missing `node_modules/` in Local Workspace
- The project lockfile is present, but dependencies are not installed in the workspace directory. Commands like `npm run lint` fail immediately.
- **Remediation:** Run `npm install` to hydrate local dependencies.

### B. Next.js 16 Experimental Flags
- [next.config.ts](file:///k:/Coding%20Projects/Saven/next.config.ts) enables `cacheComponents: true` and `partialPrefetching: true`.
- These are experimental Canary features that may exhibit subtle caching bugs or change APIs between minor versions.
