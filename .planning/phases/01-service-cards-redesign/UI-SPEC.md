# UI-SPEC: Expandable Product-Grade Service Cards

**Product:** SAVEN Website  
**Branch:** `feature/service-cards-redesign`  
**Target Component:** `src/components/Services.tsx`  
**Pattern:** Progressive Disclosure / In-Place Card Expansion (Stripe & Linear Inspired)  
**Status:** Approved Specification  

---

## 1. Design Philosophy & Requirements

Modern product companies (Stripe, Linear, Apple, Vercel) balance two conflicting user needs:
1. **Quick Glance Scannability:** Visitors scan headings and bullet points in 3 seconds to understand coverage.
2. **Technical Depth:** Decision-makers want detailed paragraphs, architecture guarantees, and execution roadmaps.

To solve this, each service card employs **Progressive Disclosure**:
- **Default (Collapsed) State:** Presents clean, high-density **bullet points** of key deliverables for instant scanning.
- **Active (Expanded) State:** On click, the card smoothly expands in-place, revealing an authoritative **product-grade narrative paragraph**, complete capability checklist, ecosystem badges, and direct action triggers.

---

## 2. Card Anatomy & State Model

```
┌─────────────────────────────────────────────────────────────┐
│                      COLLAPSED STATE                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [01]  CORE ARCHITECTURE                           [</>] │ │  <- 1. Header Bar
│ │ Custom Software Development                             │ │  <- 2. Title & Tagline
│ │ // Tailored architecture engineered for precision.      │ │
│ │                                                         │ │
│ │ CORE CAPABILITIES:                                      │ │  <- 3. Scannable
│ │ • Custom application development                        │ │     Bullet Points
│ │ • Business software solutions                           │ │
│ │ • Backend API & workflow automation engines             │ │
│ │ • Database design & cloud implementation                │ │
│ │                                                         │ │
│ │ [Node.js] [Go] [PostgreSQL] [AWS]                       │ │  <- 4. Tech Chips
│ │                                                         │ │
│ │ + Click to Expand Full Details                        ↓ │ │  <- 5. Expand Trigger
│ └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────┘
                               │ Click Card / Trigger
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      EXPANDED STATE                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [01]  CORE ARCHITECTURE [EXPANDED]                [</>] │ │
│ │ Custom Software Development                             │ │
│ │                                                         │ │
│ │ PRODUCT OVERVIEW:                                       │ │  <- 6. Product-Grade
│ │ "We design and develop custom software solutions        │ │     Detailed
│ │  tailored to your exact operational workflows. Every    │ │     Paragraph
│ │  system is built with strictly typed APIs, scalable    │ │
│ │  database schemas, and high-availability cloud         │ │
│ │  infrastructure to ensure seamless long-term growth."  │ │
│ │                                                         │ │
│ │ ALL DELIVERABLES:                                       │ │  <- 7. Complete
│ │ ✓ Custom application development                        │ │     8-Point Matrix
│ │ ✓ API development & integration                         │ │
│ │ ✓ Database design & modeling                            │ │
│ │ ✓ Cloud deployment & CI/CD pipelines                   │ │
│ │                                                         │ │
│ │ TARGET ECOSYSTEM:                                       │ │
│ │ [Node.js] [Go] [Python] [PostgreSQL] [Docker] [GraphQL] │ │
│ │                                                         │ │
│ │ [ Model in Estimator ↗ ]    [ Start Project Inquiry ↗ ] │ │  <- 8. Dual Direct
│ │                                                         │ │     Action Buttons
│ │ - Collapse Details                                    ↑ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Product Editorial Copy (The 6 Services)

### 01. Custom Software Development
- **Tagline:** Tailored architecture engineered for precision and scale.
- **Bullets:**
  - Proprietary business software & custom applications
  - High-throughput backend API engines & automation
  - Resilient relational & document database modeling
  - Cloud deployment with automated CI/CD pipelines
- **Product Overview Paragraph:**
  *“We architect production-grade software solutions engineered around your exact operational workflows and business logic. Moving beyond off-the-shelf templates, every system is crafted with strictly typed codebases, high-throughput microservices, and battle-tested databases capable of scaling seamlessly as your user volume expands.”*

### 02. Software Enhancement & Modernization
- **Tagline:** Revitalize legacy systems with modern performance and design.
- **Bullets:**
  - Legacy codebase refactoring & debt reduction
  - 3x query throughput & performance tuning
  - Zero-downtime database index & schema migration
  - Complete UI/UX design overhaul & modernization
- **Product Overview Paragraph:**
  *“We diagnose and eliminate architectural bottlenecks in existing applications. Whether tackling technical debt, optimizing sluggish database queries, or overhauling aging user interfaces, our team revitalizes your software into a high-performance modern platform with zero operational downtime.”*

### 03. College & Academic Projects
- **Tagline:** Technical guidance, prototype engineering, and viva preparation.
- **Bullets:**
  - Capstone & final-year software development
  - Production-quality full-stack web & AI prototypes
  - Comprehensive IEEE-standard SRS documentation
  - Live system demonstration & technical viva coaching
- **Product Overview Paragraph:**
  *“We provide rigorous engineering mentorship and technical execution for students and researchers tackling complex academic software prototypes. From machine learning pipelines to modern full-stack architectures, we deliver clean source code alongside structured IEEE documentation to ensure complete mastery during project defense.”*

### 04. Mobile App Development
- **Tagline:** Intuitive, fluid mobile experiences built for real devices.
- **Bullets:**
  - Cross-platform iOS & Android native apps
  - Fluid 60fps micro-animations & gesture ergonomics
  - Offline-first local database caching & sync
  - Push notification pipelines & app store deployment
- **Product Overview Paragraph:**
  *“We create high-performance mobile applications that combine native fluid responsiveness with robust offline capabilities. Built with React Native and modern native bridges, our apps deliver unified cross-platform parity while maintaining platform-specific design fidelity across iOS and Android.”*

### 05. Website Design & Development
- **Tagline:** High-performance, editorial digital experiences with flawless vitals.
- **Bullets:**
  - 100/100 Core Web Vitals & Lighthouse benchmarks
  - Bespoke editorial agency aesthetics & brand design
  - Ultra-fast server-side rendering & dynamic SEO
  - Fluid viewport responsiveness with zero layout shift
- **Product Overview Paragraph:**
  *“We engineer distinctive, high-conversion web platforms that command brand authority. Utilizing Next.js App Router, Tailwind CSS, and custom WebGL micro-interactions, we guarantee instant page loads, flawless search engine indexability, and an unforgettable visual impression on every device.”*

### 06. End-to-End Project Development
- **Tagline:** Structured progression from raw hypothesis to production deployment.
- **Bullets:**
  - Full product scoping & technical requirement mapping
  - Sprint-based milestone roadmap with live demos
  - Automated cloud infrastructure & monitoring
  - Complete source repository handover & documentation
- **Product Overview Paragraph:**
  *“From initial whiteboard concept to production launch, we act as your dedicated engineering arm. We manage the complete product lifecycle through structured 6-stage delivery sprints, combining rapid prototyping, stringent automated testing, and comprehensive technical handover for uninterrupted operations.”*

---

## 4. Interaction Specifications

1. **Grid Alignment:** Clean 3-column symmetrical grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
2. **Animation:** Framer Motion `motion.div` with `layout`, `initial={{ opacity: 0, height: 0 }}`, `animate={{ opacity: 1, height: 'auto' }}`, `exit={{ opacity: 0, height: 0 }}`.
3. **State Management:** Local accordion toggle state (`expandedId === service.id`). Clicking the card toggles it open/closed.
4. **Action Routing:**
   - "Model in Scope Estimator" scrolls to `#estimator` with the service pre-selected.
   - "Inquire About This Service" scrolls to `#contact` with the form pre-filled.
