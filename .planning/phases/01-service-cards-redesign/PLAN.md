# PLAN: Vertical Series Editorial Accordion (Cardless Redesign)

**Phase:** 01 - Service Cards Redesign  
**Branch:** `feature/service-cards-redesign`  
**Pattern:** Cardless Vertical Downward Series / Editorial Accordion  
**Status:** Completed & Verified  
**Design Contract:** [.planning/phases/01-service-cards-redesign/UI-SPEC.md](file:///k:/Coding%20Projects/Saven/.planning/phases/01-service-cards-redesign/UI-SPEC.md)

---

## Objective
Completely discard the cards / box grid layout. Replace it with an architectural **Vertical Series (Editorial Accordion List)** where services are listed one below another in a single line showing only the title, and smoothly expand downward on click to show the description paragraph, deliverables, tech stack, and direct action triggers.

---

## Tasks Breakdown

### Wave 1: Layout & Component Architecture (Cardless List)
- [x] **Task 1.1:** Replace the 3-column grid container in [Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx) with a full-width vertical stack (`divide-y divide-neutral-900 border-t border-b border-neutral-900`).
- [x] **Task 1.2:** Implement the resting row layout:
  - Left: Monospace numeral (`01`, `02`, ...).
  - Center: Large architectural service title (`Custom Software`, `Software Modernization`, etc.).
  - Right: Minimalist toggle indicator (`+` / `—`).
  - Interactive hover state: subtle horizontal slide and pure white title illumination.

### Wave 2: Smooth In-Place Expansion Engine
- [x] **Task 2.1:** Wire Framer Motion `AnimatePresence` and `motion.div` for buttery-smooth height expansion.
- [x] **Task 2.2:** Design the expanded interior drawer:
  - Concise, balanced description paragraph.
  - Deliverables matrix with checkmarks.
  - Monospace tech ecosystem badges.
  - Dual action links: "Configure in Estimator" & "Start Project Inquiry".

### Wave 3: Quality Gates & Verification
- [x] **Task 3.1:** Verify TypeScript compilation (`npx tsc --noEmit` passed with 0 errors).
- [x] **Task 3.2:** Verify ESLint cleanliness (`npx eslint src/components/Services.tsx` passed with 0 errors/warnings).
- [x] **Task 3.3:** Commit to `feature/service-cards-redesign` and verify in browser.
