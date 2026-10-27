# PLAN: Expandable Product-Grade Service Cards Implementation

**Phase:** 01 - Service Cards Redesign  
**Branch:** `feature/service-cards-redesign`  
**Pattern:** Progressive Disclosure / In-Place Smooth Expansion  
**Design Contract:** [.planning/phases/01-service-cards-redesign/UI-SPEC.md](file:///k:/Coding%20Projects/Saven/.planning/phases/01-service-cards-redesign/UI-SPEC.md)

---

## Objective
Implement in-place progressive disclosure for each of the 6 service cards in [src/components/Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx):
- **Collapsed View:** Displays clean, scannable bullet points for instant visual reading.
- **Expanded View:** On click, fluidly expands the card in-place with Framer Motion to reveal an authoritative product-grade narrative paragraph, full deliverables checklist, ecosystem chips, and direct action triggers.
- **Alignment:** Strictly preserves the clean, symmetrical 3-column grid alignment (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).

---

## Tasks Breakdown

### Wave 1: Data Model & Content Enrichment
- [x] **Task 1.1:** Add product-grade narrative overview paragraphs for all 6 services into [services.ts](file:///k:/Coding%20Projects/Saven/src/data/services.ts) or directly in the component config.
- [x] **Task 1.2:** Add curated 4-bullet executive highlights for the collapsed scanning state.

### Wave 2: Component Architecture & Expansion Engine
- [ ] **Task 2.1:** Update [Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx) with stateful expansion tracking (`expandedId: string | null`).
- [ ] **Task 2.2:** Implement Framer Motion `AnimatePresence` and `motion.div` for buttery-smooth height and opacity transitions.
- [ ] **Task 2.3:** Implement Collapsed State UI:
  - Header with ID, system tag, and icon.
  - Title and monospace tagline.
  - Scannable bullet points with micro-dots.
  - Ecosystem preview chips.
  - Expand indicator button.
- [ ] **Task 2.4:** Implement Expanded State UI:
  - Product-grade detailed paragraph in a recessed technical callout box.
  - Complete deliverables matrix with green/white checkmarks.
  - Full tech stack badges.
  - Direct dual CTA buttons: "Model in Estimator" and "Start Project Inquiry".
  - Collapse indicator button.

### Wave 3: Quality Gates & Verification
- [ ] **Task 3.1:** Verify TypeScript compilation (`npx tsc --noEmit`).
- [ ] **Task 3.2:** Verify ESLint cleanliness (`npx eslint src/components/Services.tsx`).
- [ ] **Task 3.3:** Commit to `feature/service-cards-redesign` and verify in browser.
