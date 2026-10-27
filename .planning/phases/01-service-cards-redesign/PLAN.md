# PLAN: Service Cards Redesign & Layout Modernization

**Phase:** 01 - Service Cards Redesign  
**Branch:** `feature/service-cards-redesign`  
**Status:** Completed & Verified  
**Design Contract:** [.planning/phases/01-service-cards-redesign/UI-SPEC.md](file:///k:/Coding%20Projects/Saven/.planning/phases/01-service-cards-redesign/UI-SPEC.md)

---

## Objective
Elevate the SAVEN Services section ([src/components/Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx)) from a generic 3x2 grid of uniform black boxes into a bespoke, high-aesthetic architectural presentation while preserving the existing modal deep-dive on click.

---

## Tasks Breakdown

### Wave 1: Foundation & Layout Architecture
- [x] **Task 1.1:** Finalize the card arrangement selection -> **Option 1: Asymmetrical Editorial Bento Grid**.
- [x] **Task 1.2:** Refactor the container layout in [Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx) from standard `grid-cols-3` to 12-column Bento rhythm (`lg:grid-cols-12`):
  - Row 1: Custom Software (8 cols - Hero) + Modernization (4 cols)
  - Row 2: Mobile Engineering (4 cols) + Performance Web (8 cols - Panoramic)
  - Row 3: Academic Engineering (6 cols) + End-to-End Delivery (6 cols)
- [x] **Task 1.3:** Ensure responsive breakpoint adaptations (`sm`, `md`, `lg`) for tablet and mobile devices.

### Wave 2: Card Component Visual Crafting
- [x] **Task 2.1:** Implement dynamic mouse-tracking spotlight radial borders:
  - Local card coordinates computed via `onMouseMove`.
  - Soft 450px radial spotlight fill inside card + 320px radial border illumination with CSS mask.
- [x] **Task 2.2:** Add architectural micro-accents:
  - Technical corner crosshairs (`+`) at the 4 card corners.
  - Monospace category headers (`SYS.01 // CORE ARCHITECTURE`, `SYS.02 // MODERNIZATION`, etc.).
  - Interactive tech stack chips (`Node.js`, `Go`, `PostgreSQL`, `React Native`, etc.).
  - Bespoke card features: Architecture topology schematic, throughput gain badge, mobile native indicator, Core Web Vitals benchmark radar (100/100/100/100), and 6-stage lifecycle pipeline.
- [x] **Task 2.3:** Enhance typography and deliverables styling (monospace taglines, subtle dot indicators, and sliding arrow CTA).

### Wave 3: Integration & Interaction Verification
- [x] **Task 3.1:** Verify clicking a card smoothly triggers [ServiceModal](file:///k:/Coding%20Projects/Saven/src/components/ServiceModal.tsx) with complete deliverables and specifications.
- [x] **Task 3.2:** Verify "Discuss Custom Architecture" bottom banner and cross-section scroll triggers function properly.
- [x] **Task 3.3:** Run lint and build checks (`npx tsc --noEmit` passed with 0 errors, `npx eslint src/components/Services.tsx` passed with 0 warnings/errors).

---

## Verification Criteria
1. [x] Services section breaks away from the uniform 3x2 symmetrical box pattern.
2. [x] Cards display rich architectural styling (spotlights, tech chips, corner crosshairs, refined typography).
3. [x] Clicking a card continues to open the detailed specifications modal.
4. [x] Clean responsive re-flow across desktop, tablet, and mobile.
