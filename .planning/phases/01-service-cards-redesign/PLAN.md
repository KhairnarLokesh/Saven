# PLAN: Service Cards Redesign & Layout Modernization

**Phase:** 01 - Service Cards Redesign  
**Branch:** `feature/service-cards-redesign`  
**Status:** Completed & Verified (Linear / Vercel Spec-Sheet Format in 3-Column Symmetrical Grid)  
**Design Contract:** [.planning/phases/01-service-cards-redesign/UI-SPEC.md](file:///k:/Coding%20Projects/Saven/.planning/phases/01-service-cards-redesign/UI-SPEC.md)

---

## Objective
Elevate the SAVEN Services section ([src/components/Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx)) from generic, flat feature boxes into high-density **Linear & Vercel-inspired Architectural Spec Cards** while strictly maintaining the **original clean, symmetrical 3-column grid alignment** and preserving click-to-open modal capability.

---

## Architecture & Layout Alignment
- **Container Arrangement:** Retained the clean, symmetrical 3-column grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for balanced rhythm and consistent column widths across all devices.
- **Card Interior Anatomy:** Redesigned each individual card with:
  1. **Header Row:** Monospace index badge (`01`, `02`, ...), category tag (`CORE ARCHITECTURE`, `MODERNIZATION`, etc.), and recessed icon.
  2. **Typography:** High-contrast title and monospace system tagline (`// ...`).
  3. **Visual Micro-Stage:**
     - `01. Custom Dev`: Live system data pipeline (`Client -> Gateway -> Logic -> DB`).
     - `02. Modernization`: Throughput gain metric (`⚡ Up to 3.5x Faster · Zero Downtime`).
     - `03. Academic`: Academic engineering validation checklist (`SRS Spec | Source Repo | Viva Prep`).
     - `04. Mobile Dev`: Dual native platform matrix (`iOS & Android Native | Offline DB Sync`).
     - `05. Web Dev`: Core Web Vitals benchmark radar (`100 PERF · 100 A11Y · 100 BEST · 100 SEO`).
     - `06. End-to-End`: Discovery to Production pipeline (`DISCOVER -> PLAN -> BUILD -> SHIP`).
  4. **Deliverables:** High-density deliverable rows with micro-checkmarks.
  5. **Tech Stack Ecosystem:** Monospace pill chips with `+N more` overflow counter.
  6. **Interactive Border & Spotlight:** Mouse-following radial spotlight glow and precision corner crosshairs (`+`).
  7. **Footer CTA:** `View Specifications` + animated sliding arrow `→` (triggers [ServiceModal](file:///k:/Coding%20Projects/Saven/src/components/ServiceModal.tsx)).

---

## Verification
- [x] TypeScript compiler check: `npx tsc --noEmit` exited with code 0.
- [x] ESLint lint check: `npx eslint src/components/Services.tsx` exited with code 0 (zero errors/warnings).
- [x] Layout alignment: 3-column grid maintained seamlessly.
- [x] Click action: Clicking any card opens `ServiceModal` for deep-dive specifications.
