# PLAN: Streamline Core Sections (Remove Estimator, Process, & Capability Matrix)

**Phase:** 03 - Streamline Core Sections  
**Branch:** `feature/codebase-cleanup-and-debt`  
**Pattern:** Surgical Section Decommissioning & Continuous Layout Flow  
**Status:** Completed & Verified  

---

## Objective
Cleanly remove the **Estimator** (Section 02), the **Process Methodology** (Section 04), and the **Capability Matrix** from the About section, ensuring all navigation links, section counters, action buttons, data models, and types are harmonized without breaking the layout or leaving dead code.

---

## Tasks Breakdown

### Wave 1: Component Removal & Page Decomposition
- [x] **Task 1.1:** Decommission `Estimator.tsx`:
  - Delete `src/components/Estimator.tsx`.
  - Remove `Estimator` import and JSX from `src/app/page.tsx`.
  - Remove unused `handleApplyEstimate` and clean up `inquiryDescription` state in `src/app/page.tsx`.
- [x] **Task 1.2:** Decommission `Process.tsx`:
  - Delete `src/components/Process.tsx`.
  - Remove `Process` import and JSX from `src/app/page.tsx`.
- [x] **Task 1.3:** Clean up [Services.tsx](file:///k:/Coding%20Projects/Saven/src/components/Services.tsx):
  - Remove the "Model in Scope Estimator" secondary button and unused `Calculator` icon import.
  - Retain the primary "Start Project Inquiry" button.

### Wave 2: Capability Matrix & Section Numbering Update
- [x] **Task 2.1:** Clean up [About.tsx](file:///k:/Coding%20Projects/Saven/src/components/About.tsx):
  - Remove the "CAPABILITY MATRIX" (Full-Stack Ecosystems We Command) grid container.
  - Remove unused `techCapabilities` and `Check` icon imports.
  - Re-index section tag to `02 // ABOUT SAVEN`.
- [x] **Task 2.2:** Update [Contact.tsx](file:///k:/Coding%20Projects/Saven/src/components/Contact.tsx):
  - Re-index section tag to `03 // PROJECT INTAKE`.

### Wave 3: Navigation & Data Model Harmonization
- [x] **Task 3.1:** Update [siteConfig.ts](file:///k:/Coding%20Projects/Saven/src/data/siteConfig.ts):
  - Remove `Estimator` and `Process` from `navLinks` (leaving `Home`, `Services`, `About`, `Contact`).
- [x] **Task 3.2:** Update [Navbar.tsx](file:///k:/Coding%20Projects/Saven/src/components/Navbar.tsx):
  - Update active scroll spy sections array to `['home', 'services', 'about', 'contact']`.
- [x] **Task 3.3:** Decommission unused data & types:
  - Delete `src/data/process.ts`.
  - Remove `ProcessStep` interface from `src/types/index.ts`.
  - Remove unused `techCapabilities` array from `src/data/about.ts`.

### Wave 4: Verification & Quality Gates
- [x] **Task 4.1:** Verify TypeScript compilation and production build (`npm run build`).
- [x] **Task 4.2:** Verify dev server responses and UI flow.
- [x] **Task 4.3:** Stage and create atomic git commit.
