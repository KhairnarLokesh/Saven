# PLAN: Service Cards Redesign & Layout Modernization

**Phase:** 01 - Service Cards Redesign  
**Branch:** `feature/service-cards-redesign`  
**Status:** Ready for User Direction Selection  
**Design Contract:** [.planning/phases/01-service-cards-redesign/UI-SPEC.md](file:///k:/Coding%20Projects/Saven/.planning/phases/01-service-cards-redesign/UI-SPEC.md)

---

## Objective
Elevate the SAVEN Services section ([src/components/Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx)) from a generic 3x2 grid of uniform black boxes into a bespoke, high-aesthetic architectural presentation while preserving the existing modal deep-dive on click.

---

## Tasks Breakdown

### Wave 1: Foundation & Layout Architecture
- [ ] **Task 1.1:** Finalize the card arrangement selection (Bento Grid, Split Console, Expanding Accordion, or Staggered Masonry).
- [ ] **Task 1.2:** Refactor the container layout in [Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx) from standard `grid-cols-3` to the chosen spatial arrangement.
- [ ] **Task 1.3:** Ensure responsive breakpoint adaptations (`sm`, `md`, `lg`, `xl`) for tablet and mobile devices.

### Wave 2: Card Component Visual Crafting
- [ ] **Task 2.1:** Implement dynamic mouse-tracking spotlight radial borders or edge highlight shaders.
- [ ] **Task 2.2:** Add architectural micro-accents:
  - Technical corner crosshairs (`+`) at the card corners.
  - Monospace category headers and metadata chips (`STACK: NODE/GO`, `CADENCE: SPRINT`).
  - Interactive tech stack pills that highlight on hover.
- [ ] **Task 2.3:** Enhance typography and deliverables styling (custom indicator arrows, subtle scanline or blueprint backgrounds).

### Wave 3: Integration & Interaction Verification
- [ ] **Task 3.1:** Verify clicking a card smoothly triggers the existing [ServiceModal](file:///k:/Coding%20Projects/Saven/src/components/ServiceModal.tsx) with complete deliverables and specifications.
- [ ] **Task 3.2:** Verify "Discuss Custom Architecture" bottom banner and cross-section scroll triggers function properly.
- [ ] **Task 3.3:** Run lint and build checks (`npm run lint`, `npx tsc --noEmit`) to guarantee zero regressions.

---

## Verification Criteria
1. Services section breaks away from the uniform 3x2 symmetrical box pattern.
2. Cards display rich architectural styling (spotlights, tech chips, corner crosshairs, refined typography).
3. Clicking a card continues to open the detailed specifications modal.
4. Smooth 60fps interaction on desktop and clean 1-column / tabbed fallback on mobile viewports.
