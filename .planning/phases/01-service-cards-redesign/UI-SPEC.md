# UI-SPEC: Vertical Series Editorial Accordion (Cardless Architecture)

**Product:** SAVEN Website  
**Branch:** `feature/service-cards-redesign`  
**Target Component:** `src/components/Services.tsx`  
**Paradigm:** Editorial Vertical Index / Single-Line Series (Cardless)  
**Status:** Approved Architectural Direction  

---

## 1. Core Paradigm Shift: From Cards to Vertical Series

The user has explicitly mandated **discarding the cards arrangement system entirely**. No boxes, no cards, no bento grids.

Instead, the Services section adopts an **Architectural Vertical Series (Editorial Accordion List)** inspired by high-end design studios (Locomotive, Studio Freight, Pentagram):
- Services are listed **one after another in a downward vertical series**.
- In the resting state, each item occupies a **single horizontal line displaying ONLY the title** (paired with an index numeral and a minimal toggle indicator).
- When a user clicks any item, that row smoothly expands downward in-place to reveal the service description paragraph, deliverables, and tech ecosystem.

---

## 2. Layout & Wireframe Architecture

### Resting State (The Vertical Series)
Clean, full-width horizontal rows separated by 1px hairline dividers:

```
────────────────────────────────────────────────────────────────────────────────────────
  01        Custom Software                                                            +
────────────────────────────────────────────────────────────────────────────────────────
  02        Software Modernization                                                     +
────────────────────────────────────────────────────────────────────────────────────────
  03        Academic Engineering                                                       +
────────────────────────────────────────────────────────────────────────────────────────
  04        Mobile App Dev                                                             +
────────────────────────────────────────────────────────────────────────────────────────
  05        Website Design & Dev                                                       +
────────────────────────────────────────────────────────────────────────────────────────
  06        End-to-End Delivery                                                        +
────────────────────────────────────────────────────────────────────────────────────────
```

### Expanded State (Click to Expand In-Place)
Clicking `01 Custom Software` smoothly expands the row directly beneath the title:

```
────────────────────────────────────────────────────────────────────────────────────────
  01        Custom Software                                                            —
  
            OVERVIEW:
            We engineer bespoke software systems and backend services tailored to your 
            operational workflows. Every application is built with strictly typed 
            architectures, automated CI/CD pipelines, and high-resilience database 
            modeling that scales seamlessly with your business.

            CORE CAPABILITIES:
            • High-throughput microservices & API engines
            • Relational & document database schema modeling
            • Automated CI/CD pipelines & cloud deployment
            • Proprietary business logic & custom applications

            ECOSYSTEM:
            [Node.js]  [Go]  [Python]  [PostgreSQL]  [Docker]  [AWS]

            [ Model in Scope Estimator ↗ ]          [ Start Project Inquiry ↗ ]
────────────────────────────────────────────────────────────────────────────────────────
  02        Software Modernization                                                     +
────────────────────────────────────────────────────────────────────────────────────────
```

---

## 3. Interaction & Animation Contract

1. **Resting Row Styling:**
   - Padding: `py-6 sm:py-8` with `border-b border-neutral-850`.
   - Number: Monospace text `text-neutral-500 font-mono text-sm sm:text-base`.
   - Title: `text-2xl sm:text-4xl md:text-5xl font-light text-white transition-colors duration-200 group-hover:text-neutral-200`.
   - Hover Feedback: Subtle left padding shift (`group-hover:translate-x-2`), background tint (`hover:bg-neutral-950/60`), and indicator highlight.
   - Indicator: Monospace `+` that rotates or changes to `—` when active.
2. **Expansion Mechanism:**
   - Controlled via Framer Motion `motion.div` with spring easing `[0.16, 1, 0.3, 1]`.
   - Zero layout jank; expands the container height naturally.
3. **Accordion Behavior:**
   - Single-active accordion mode: clicking service `02` automatically collapses service `01`, maintaining an ultra-clean vertical profile.
4. **Action Triggers:**
   - Direct cross-section deep links to `#estimator` and `#contact` with the clicked service pre-selected.
