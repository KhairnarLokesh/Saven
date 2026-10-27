# UI-SPEC: Services Section Cards Redesign

**Project:** SAVEN Website  
**Branch:** `feature/service-cards-redesign`  
**Target Component:** `src/components/Services.tsx`  
**Status:** In Review / Ideation Stage  

---

## 1. Problem Statement & Critique of Current Design

The current Services section consists of a **uniform 3x2 grid of identical black boxes** with:
- A generic numbered badge in the top-left and an icon in the top-right.
- Repetitive 3-bullet text lists.
- A standard hover state (`hover:-translate-y-1 hover:border-white`) and bottom text link (`+ VIEW FULL SPECIFICATIONS ->`).

### Core Deficiencies:
1. **Monotonous Rhythm:** All 6 services look completely identical from 10 feet away. There is no visual hierarchy, hero offering, or rhythmic diversity.
2. **Template Feel:** Symmetrical 3x2 grids are a hallmark of generic SaaS templates, conflicting with SAVEN’s brand positioning as a bespoke, premium engineering studio.
3. **Underutilized Tech Aesthetics:** Lacks the technical blueprint accents, dynamic spotlights, interactive badges, or spatial depth found in modern high-end agencies (e.g. Linear, Vercel, Studio Freight).

---

## 2. Redesign Options: Layout Arrangements & Visual Styles

Here are 4 distinct design directions for the card designs and spatial arrangement:

---

### Option 1: Asymmetrical Editorial Bento Grid (Recommended)
*Inspired by: Linear, Apple Pro features, Vercel design system*

#### A. Spatial Arrangement
Instead of a uniform 3x2 grid, a dynamic 6-card **Bento Layout** with variable weight:
- **Card 01 (Custom Software Development):** **2-Column Featured Hero Card** with wide technical blueprint background, highlighting full-stack architectures.
- **Card 02 (Software Enhancement & Modernization):** Standard card with visual "before/after" metrics badge.
- **Card 03 (College & Academic Projects):** Vertical card with thesis/prototype badge.
- **Card 04 (Mobile App Development):** Tall card featuring a stylized smartphone viewport silhouette or cross-platform chips (`iOS`, `Android`).
- **Card 05 (Website Design & Development):** Wide horizontal card with performance score badge (`100/100 Lighthouse`).
- **Card 06 (End-to-End Project Development):** Full-width or anchor card showcasing a 6-phase progress pip.

#### B. Visual Card Treatment
- **Radial Mouse-Tracking Spotlight:** Soft white radial gradient that tracks the cursor along the card borders (`border-neutral-800` illuminated to pure white near cursor).
- **Architectural Crosshair Accents:** Subtle `+` tick marks at the card's 4 outer corners for a precision blueprint aesthetic.
- **Interactive Tech Stack Pills:** Monospace micro-chips (`Node.js`, `Go`, `PostgreSQL`, `React Native`, `Three.js`) that illuminate on hover.
- **Retained Action:** Clicking any card still triggers the comprehensive `ServiceModal` for deep-dive deliverables.

---

### Option 2: Interactive Architectural Console (Split Layout)
*Inspired by: Stripe Dev, Supabase architecture explorer*

#### A. Spatial Arrangement
- **Left Column (40% width):** Clean, vertical master index of the 6 services with monospace numerals (`01 //`, `02 //`), status indicator light, and smooth active selection indicator.
- **Right Column (60% width):** High-tech "Blueprint Terminal" card that dynamically morphs when hovering or clicking services on the left:
  - Displays the active service's title, scope, full deliverables checklist, target tech stack, and ideal client persona.
  - Includes a direct "Model in Estimator" button and "Full Specifications" trigger.

#### B. Visual Card Treatment
- Monochromatic dark terminal aesthetic with top title bar: `[SYS // SERVICE_01.SH]`.
- Ambient glowing scanline overlay or subtle dot grid canvas.
- Zero visual clutter, ultra-focused, perfectly legible on all viewports.

---

### Option 3: Horizontal Expanding Accordion Deck
*Inspired by: Active Theory, Locomotive Agency, Apple hardware previews*

#### A. Spatial Arrangement
- A seamless horizontal strip of 6 vertical columns stretching across the container width:
  - **Resting State:** All columns share equal space (`flex: 1`), showing vertical typography, service number, and icon.
  - **Hover / Active State:** The hovered card smoothly expands (`flex: 3` via CSS transition or Framer Motion), revealing the description, deliverables, and CTA, while the neighboring 5 cards elegantly compress (`flex: 0.7`).
  - **Mobile Fallback:** Gracefully stacks into vertical accordion drawers with smooth spring expansion.

#### B. Visual Card Treatment
- Ultra-thin 1px border dividers (`border-neutral-850`).
- Rotated vertical labels in collapsed state that rotate horizontally when expanded.
- Tactile, fluid kinetic motion that rewards user exploration.

---

### Option 4: Staggered Architecture Masonry with Embedded HUD Cards
*Inspired by: Monograph, Studio Freight*

#### A. Spatial Arrangement
- 2 asymmetrical columns with staggered vertical offsets (left column offset by 40px), breaking the rigid grid line.
- Alternating card styles:
  - Odd cards focus on architectural capability and deliverables.
  - Even cards highlight tech stack matrices and operational constraints.

#### B. Visual Card Treatment
- Frosted glassmorphism card surfaces (`bg-neutral-950/80 backdrop-blur-md border-neutral-800`).
- Subtle grid texture inside the card body.
- Monospace metadata footer with execution parameters (e.g., `STACK: DISTRIBUTED`, `CADENCE: SPRINT-BASED`).

---

## 3. Comparison Matrix

| Criteria | Option 1: Bento Grid | Option 2: Split Console | Option 3: Accordion Deck | Option 4: Staggered Masonry |
| :--- | :--- | :--- | :--- | :--- |
| **Visual Hierarchy** | **High** (Hero & compact cards) | Medium (Index + Stage) | High (Dynamic focus) | Medium (Staggered) |
| **Interaction Feel** | Tactile mouse spotlight & hover | Instant live switching | Kinetic expanding columns | Smooth scrolling |
| **Information Density** | High (all visible at a glance) | Maximum (focused one-at-a-time)| Progressive disclosure | High (editorial layout) |
| **Mobile Responsiveness** | Effortless (re-flows into 1-col) | Tabbed mobile view | Converts to vertical accordion| Standard 1-col stack |
| **Aesthetic Rating** | **9.5/10 (State of the art)** | 9.0/10 (High-tech) | 9.2/10 (Experimental) | 8.8/10 (Editorial) |

---

## 4. Implementation Plan (GSD Phase)

1. **Phase 1: Select Direction & Component Architecture**
   - Confirm preferred layout (Option 1 Bento, Option 2 Split Console, Option 3 Accordion, or Option 4 Masonry).
   - Maintain compatibility with `selectedService` and `ServiceModal`.
2. **Phase 2: Build Card Primitives & Styling Tokens**
   - Implement spotlight hover effect, corner crosshairs, and tech chip badges in `src/components/Services.tsx`.
3. **Phase 3: Wire Interactions & Mobile Adaptation**
   - Test responsive layout across desktop, tablet, and mobile breakpoints.
   - Verify modal opens properly and estimator transfer hook remains active.
