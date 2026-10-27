# PLAN: Service Cards Exact Copy & Balanced Paragraph Expansion

**Phase:** 01 - Service Cards Redesign  
**Branch:** `feature/service-cards-redesign`  
**Pattern:** Click-to-Expand Progressive Disclosure  
**Status:** Completed & Verified  
**Design Contract:** [.planning/phases/01-service-cards-redesign/UI-SPEC.md](file:///k:/Coding%20Projects/Saven/.planning/phases/01-service-cards-redesign/UI-SPEC.md)

---

## Objective
Implement user-specified card titles and resting highlight lines, with fluid Framer Motion spring expansion revealing a balanced, product-grade details paragraph, deliverables, tech ecosystem, and direct action triggers.

---

## Tasks Breakdown

### Wave 1: Content & Data Alignment
- [x] **Task 1.1:** Configure exact user-specified titles (`Custom Software`, `Software Modernization`, `Academic Engineering`, `Mobile App Dev`, `Website Design & Dev`, `End-to-End Delivery`).
- [x] **Task 1.2:** Configure exact user-specified resting highlight text for each service.
- [x] **Task 1.3:** Draft balanced 45-word product-grade narrative paragraphs ("not too big, not too short").

### Wave 2: Animation & Component Engineering
- [x] **Task 2.1:** Enhance Framer Motion spring animation on card expand/collapse with subtle scale and fade (`ease: [0.16, 1, 0.3, 1]`, duration 0.35s).
- [x] **Task 2.2:** Update card header, title typography, and highlight styling for immediate legibility in the 3-column grid.
- [x] **Task 2.3:** Implement expanded container featuring:
  - Editorial paragraph in a recessed technical callout box.
  - Deliverables matrix with micro-checks.
  - Tech ecosystem chips.
  - Dual action buttons (`Model Scope` and `Start Inquiry`).
  - Collapse trigger.

### Wave 3: Verification & Commit
- [x] **Task 3.1:** Verify TypeScript compilation (`npx tsc --noEmit` passed with 0 errors).
- [x] **Task 3.2:** Verify ESLint cleanliness (`npx eslint src/components/Services.tsx` passed with 0 errors/warnings).
- [x] **Task 3.3:** Commit to `feature/service-cards-redesign`.
